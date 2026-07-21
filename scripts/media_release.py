#!/usr/bin/env python3
"""Plan, upload, manifest, and verify OS-SM media releases."""

from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
import os
import pathlib
import re
import ssl
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request


REPO_ROOT = pathlib.Path(__file__).resolve().parents[1]
DOCS_DIR = REPO_ROOT / "docs"
APP_DATA = DOCS_DIR / "app-data.js"
MANIFEST_PATH = DOCS_DIR / "media-release.json"
MEDIA_CONFIG = DOCS_DIR / "media-config.js"
SERVICE_WORKER = DOCS_DIR / "sw.js"
PREFIX = "随身寺庙短视频30秒/"
EXPECTED_ENTRIES = ("index.html", "ipad.html", "ipad-standalone.html", "os.html")
REFERENCE_RE = re.compile(r"[\"'](随身寺庙短视频30秒/[^\"']+\.(?:mp4|MP4))[\"']")
CONTROL_RE = re.compile(r"[\x00-\x1f\x7f]")
REQUEST_ATTEMPTS = 3
REQUEST_RETRY_DELAY_SECONDS = 0.5
REQUEST_TIMEOUT_SECONDS = 10
USE_CURL_FALLBACK = False


class ReleaseError(RuntimeError):
    pass


def load_manifest() -> dict:
    data = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    required = {
        "schema",
        "release_id",
        "base_url",
        "object_prefix",
        "object_count",
        "total_bytes",
        "objects",
    }
    missing = required - data.keys()
    if missing:
        raise ReleaseError(f"manifest fields missing: {sorted(missing)}")
    if data["schema"] != "os-sm-media-release-v1":
        raise ReleaseError(f"unsupported manifest schema: {data['schema']}")
    return data


def app_references() -> list[str]:
    references = REFERENCE_RE.findall(APP_DATA.read_text(encoding="utf-8"))
    if not references:
        raise ReleaseError(f"no video references found in {APP_DATA}")
    return references


def sha256_file(path: pathlib.Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(8 * 1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def validate_key(key: str, *, legacy_keys: set[str]) -> None:
    if not key.startswith(PREFIX):
        raise ReleaseError(f"object outside required prefix: {key}")
    name = pathlib.PurePosixPath(key).name
    if not name or "#" in name or "?" in name or CONTROL_RE.search(name):
        raise ReleaseError(f"unsafe object name: {key}")
    if key not in legacy_keys and pathlib.PurePosixPath(key).suffix != ".mp4":
        raise ReleaseError(f"new videos must use a lowercase .mp4 extension: {key}")


def validate_static_contract(manifest: dict) -> None:
    release_id = manifest["release_id"]
    config = MEDIA_CONFIG.read_text(encoding="utf-8")
    if manifest["base_url"] != "https://media.84000.art":
        raise ReleaseError("manifest base_url must be https://media.84000.art")
    if release_id not in config or manifest["base_url"] not in config:
        raise ReleaseError("media-config.js does not match media-release.json")
    for name in EXPECTED_ENTRIES:
        text = (DOCS_DIR / name).read_text(encoding="utf-8")
        if 'src="media-config.js?v=15"' not in text:
            raise ReleaseError(f"{name} does not load the shared media config")
        if "window.__APP_BUILD_VERSION__ = 'v15'" not in text:
            raise ReleaseError(f"{name} is not on app cache version v15")
    sw = SERVICE_WORKER.read_text(encoding="utf-8")
    if "url.hostname === 'media.84000.art'" not in sw:
        raise ReleaseError("service worker does not bypass the media hostname")
    if "suishen-os-v15" not in sw:
        raise ReleaseError("service worker cache version is not v15")
    if f"media-release.json?v={release_id}" not in sw:
        raise ReleaseError("service worker media-release URL does not match the manifest release_id")


def plan(source_root: pathlib.Path | None) -> tuple[dict, list[str]]:
    manifest = load_manifest()
    references = app_references()
    manifest_objects = manifest["objects"]
    manifest_keys = [item["key"] for item in manifest_objects]
    legacy_keys = set(manifest_keys)

    if len(references) != len(set(references)):
        duplicates = sorted({key for key in references if references.count(key) > 1})
        raise ReleaseError(f"duplicate work references: {duplicates}")
    if len(manifest_keys) != len(set(manifest_keys)):
        raise ReleaseError("duplicate keys in media-release.json")
    folded = [pathlib.PurePosixPath(key).name.casefold() for key in manifest_keys]
    if len(folded) != len(set(folded)):
        raise ReleaseError("case-insensitive duplicate filenames in media-release.json")
    reference_folded = [pathlib.PurePosixPath(key).name.casefold() for key in references]
    if len(reference_folded) != len(set(reference_folded)):
        raise ReleaseError("case-insensitive duplicate filenames in work references")

    for key in set(references) | set(manifest_keys):
        validate_key(key, legacy_keys=legacy_keys)
    missing = sorted(set(references) - set(manifest_keys))
    extra = sorted(set(manifest_keys) - set(references))
    if source_root is None and (missing or extra):
        raise ReleaseError(f"reference/manifest mismatch: missing={missing}, extra={extra}")
    if manifest["object_count"] != len(manifest_objects):
        raise ReleaseError("manifest object_count does not match objects")
    if manifest["total_bytes"] != sum(item["size"] for item in manifest_objects):
        raise ReleaseError("manifest total_bytes does not match objects")
    if any(item.get("content_type") != "video/mp4" for item in manifest_objects):
        raise ReleaseError("every manifest object must use video/mp4")
    if any(not re.fullmatch(r"[0-9a-f]{64}", item.get("sha256", "")) for item in manifest_objects):
        raise ReleaseError("every manifest object must include a lowercase SHA-256")

    if source_root is not None:
        if extra:
            raise ReleaseError(
                "removing media references is unsupported because the publisher cannot delete objects: "
                f"{extra}"
            )
        known = {item["key"]: item for item in manifest_objects}
        changes = {"new": 0, "changed": 0, "unchanged": 0}
        for key in references:
            path = source_root / key
            if not path.is_file():
                raise ReleaseError(f"local media missing: {path}")
            prior = known.get(key)
            local_hash = sha256_file(path)
            if prior is None:
                changes["new"] += 1
            elif path.stat().st_size == prior["size"] and local_hash == prior["sha256"]:
                changes["unchanged"] += 1
            else:
                changes["changed"] += 1
        print(
            "PLAN source: "
            f"new={changes['new']} changed={changes['changed']} unchanged={changes['unchanged']}"
        )

    validate_static_contract(manifest)
    return manifest, references


def coscli_path(args: argparse.Namespace) -> str:
    candidate = args.coscli or os.environ.get("COSCLI", "coscli")
    resolved = shutil_which(candidate)
    if not resolved:
        raise ReleaseError(f"coscli not found: {candidate}")
    return resolved


def shutil_which(command: str) -> str | None:
    if os.path.sep in command:
        path = pathlib.Path(command).expanduser()
        return str(path) if path.is_file() and os.access(path, os.X_OK) else None
    for folder in os.environ.get("PATH", "").split(os.pathsep):
        path = pathlib.Path(folder) / command
        if path.is_file() and os.access(path, os.X_OK):
            return str(path)
    return None


def run_coscli(args: argparse.Namespace, *command: str, capture: bool = False) -> subprocess.CompletedProcess:
    config = pathlib.Path(args.cos_config).expanduser()
    if not config.is_file() or config.stat().st_mode & 0o077:
        raise ReleaseError(f"COS config must exist with mode 0600: {config}")
    return subprocess.run(
        [coscli_path(args), "-c", str(config), *command],
        check=False,
        text=True,
        capture_output=capture,
    )


def remote_object_exists(args: argparse.Namespace, key: str) -> bool:
    result = run_coscli(args, "ls", f"cos://{args.cos_alias}/{key}", "--limit", "1", capture=True)
    if result.returncode != 0:
        raise ReleaseError(result.stderr.strip() or f"coscli ls failed for {key}")
    return key in result.stdout


def upload(args: argparse.Namespace) -> None:
    if args.source_root is None:
        raise ReleaseError("upload requires --source-root")
    manifest, references = plan(args.source_root)
    known = {item["key"]: item for item in manifest["objects"]}
    uploaded = 0
    skipped = 0
    for key in references:
        path = args.source_root / key
        local_hash = sha256_file(path)
        prior = known.get(key)
        if prior and prior["sha256"] == local_hash and remote_object_exists(args, key):
            print(f"SKIP unchanged: {key}")
            skipped += 1
            continue
        exists = remote_object_exists(args, key)
        if exists and not args.replace:
            raise ReleaseError(f"refusing overwrite without --replace: {key}")
        command = [
            "cp",
            str(path),
            f"cos://{args.cos_alias}/{key}",
            "--forbid-overwrite" if not args.replace else "--check-point",
            "--encryption-type",
            "SSE-COS",
            "--server-side-encryption",
            "AES256",
            "--meta",
            "Cache-Control:public, max-age=31536000, immutable#Content-Type:video/mp4",
        ]
        result = run_coscli(args, *command)
        if result.returncode:
            raise ReleaseError(f"coscli upload failed: {key}")
        uploaded += 1
        print(f"UPLOAD: {key}")
    print(f"PASS upload: uploaded={uploaded} skipped={skipped} replace={args.replace}")


def write_manifest(source_root: pathlib.Path) -> None:
    current, references = plan(source_root)
    legacy_keys = {item["key"] for item in current["objects"]}
    objects = []
    for key in sorted(references):
        validate_key(key, legacy_keys=legacy_keys)
        path = source_root / key
        if not path.is_file():
            raise ReleaseError(f"local media missing: {path}")
        objects.append(
            {
                "key": key,
                "size": path.stat().st_size,
                "sha256": sha256_file(path),
                "content_type": "video/mp4",
            }
        )
    digest_input = json.dumps(objects, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode()
    release_id = dt.datetime.now(dt.timezone.utc).strftime("%Y%m%dT%H%M%SZ-") + hashlib.sha256(digest_input).hexdigest()[:8]
    manifest = {
        "schema": "os-sm-media-release-v1",
        "release_id": release_id,
        "base_url": "https://media.84000.art",
        "object_prefix": PREFIX,
        "object_count": len(objects),
        "total_bytes": sum(item["size"] for item in objects),
        "objects": objects,
    }
    MANIFEST_PATH.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    config_text = MEDIA_CONFIG.read_text(encoding="utf-8")
    updated_config, replacements = re.subn(
        r"const MEDIA_RELEASE_ID = '[^']+';",
        f"const MEDIA_RELEASE_ID = '{release_id}';",
        config_text,
        count=1,
    )
    if replacements != 1:
        raise ReleaseError("unable to update MEDIA_RELEASE_ID in docs/media-config.js")
    MEDIA_CONFIG.write_text(updated_config, encoding="utf-8")
    sw_text = SERVICE_WORKER.read_text(encoding="utf-8")
    updated_sw, sw_replacements = re.subn(
        r"media-release\.json\?v=[^']+",
        f"media-release.json?v={release_id}",
        sw_text,
        count=1,
    )
    if sw_replacements != 1:
        raise ReleaseError("unable to update the media release URL in docs/sw.js")
    SERVICE_WORKER.write_text(updated_sw, encoding="utf-8")
    print(f"PASS manifest: release_id={release_id} objects={len(objects)} bytes={manifest['total_bytes']}")
    print("Updated docs/media-release.json, docs/media-config.js, and docs/sw.js together.")


def curl_request(
    url: str,
    method: str,
    headers: dict[str, str] | None,
    prior_error: BaseException,
) -> tuple[int, dict[str, str]]:
    curl = shutil_which("curl")
    if not curl:
        raise OSError("curl fallback is unavailable") from prior_error
    command = [curl, "--http1.1", "--silent", "--show-error", "--max-time", "30"]
    if method == "HEAD":
        command.append("--head")
    else:
        command.extend(["--request", method])
    for key, value in (headers or {}).items():
        command.extend(["--header", f"{key}: {value}"])
    command.extend(["--dump-header", "-", "--output", os.devnull, url])
    result = subprocess.run(command, check=False, capture_output=True, text=True)
    if result.returncode:
        detail = result.stderr.strip() or "no error detail"
        raise OSError(f"curl fallback failed with exit {result.returncode}: {detail}") from prior_error
    blocks = [
        block
        for block in re.split(r"\r?\n\r?\n", result.stdout.strip())
        if block.startswith("HTTP/")
    ]
    if not blocks:
        raise OSError("curl fallback returned no HTTP response headers") from prior_error
    lines = blocks[-1].splitlines()
    try:
        status = int(lines[0].split()[1])
    except (IndexError, ValueError) as error:
        raise OSError(f"curl fallback returned an invalid status line: {lines[0]}") from error
    response_headers: dict[str, str] = {}
    for line in lines[1:]:
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        response_headers[key.strip().lower()] = value.strip()
    return status, response_headers


def request(url: str, method: str, headers: dict[str, str] | None = None) -> tuple[int, dict[str, str]]:
    global USE_CURL_FALLBACK
    if USE_CURL_FALLBACK:
        return curl_request(url, method, headers, OSError("urllib disabled after persistent transient failures"))
    last_error: BaseException | None = None
    for attempt in range(1, REQUEST_ATTEMPTS + 1):
        req = urllib.request.Request(url, method=method, headers=headers or {})
        try:
            with urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT_SECONDS) as response:
                return response.status, {key.lower(): value for key, value in response.headers.items()}
        except urllib.error.HTTPError as error:
            return error.code, {key.lower(): value for key, value in error.headers.items()}
        except (urllib.error.URLError, TimeoutError, ConnectionResetError, ssl.SSLError) as error:
            last_error = error
            if attempt == REQUEST_ATTEMPTS:
                break
            time.sleep(REQUEST_RETRY_DELAY_SECONDS * (2 ** (attempt - 1)))
    if last_error is None:
        raise AssertionError("request retry loop exhausted without an error")
    USE_CURL_FALLBACK = True
    return curl_request(url, method, headers, last_error)


def public_url(manifest: dict, key: str) -> str:
    encoded = urllib.parse.quote(key, safe="/")
    return f"{manifest['base_url'].rstrip('/')}/{encoded}?v={urllib.parse.quote(manifest['release_id'])}"


def verify_public(manifest: dict) -> None:
    failures = []
    required_exposed = {"accept-ranges", "content-length", "content-range", "etag"}
    for index, item in enumerate(manifest["objects"], 1):
        url = public_url(manifest, item["key"])
        status, headers = request(url, "HEAD", {"Origin": "https://os-sm.84000.art"})
        if status != 200:
            failures.append(f"HEAD {status}: {item['key']}")
        if headers.get("content-type", "").split(";", 1)[0] != "video/mp4":
            failures.append(f"Content-Type: {item['key']}")
        if int(headers.get("content-length", "-1")) != item["size"]:
            failures.append(f"Content-Length: {item['key']}")
        if headers.get("access-control-allow-origin") != "https://os-sm.84000.art":
            failures.append(f"CORS: {item['key']}")
        exposed = {value.strip().lower() for value in headers.get("access-control-expose-headers", "").split(",")}
        if not required_exposed.issubset(exposed):
            failures.append(f"CORS exposed headers: {item['key']}")
        if "access-control-allow-credentials" in headers:
            failures.append(f"CORS credentials must be absent: {item['key']}")
        cache_control = headers.get("cache-control", "").lower()
        if not all(token in cache_control for token in ("public", "max-age=31536000", "immutable")):
            failures.append(f"Cache-Control: {item['key']}")
        if headers.get("accept-ranges", "").lower() != "bytes":
            failures.append(f"Accept-Ranges: {item['key']}")
        status, headers = request(url, "GET", {"Range": "bytes=0-1", "Origin": "https://os-sm.84000.art"})
        if status != 206 or headers.get("content-range") != f"bytes 0-1/{item['size']}":
            failures.append(f"Range: {item['key']}")
        print(f"VERIFY {index}/{manifest['object_count']}: {item['key']}")

    first_url = public_url(manifest, manifest["objects"][0]["key"])
    status, headers = request(
        first_url,
        "OPTIONS",
        {
            "Origin": "https://os-sm.84000.art",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "Range",
        },
    )
    if status not in (200, 204):
        failures.append(f"OPTIONS expected 200/204, got {status}")
    allowed_methods = {value.strip().upper() for value in headers.get("access-control-allow-methods", "").split(",")}
    if not {"GET", "HEAD", "OPTIONS"}.issubset(allowed_methods):
        failures.append("OPTIONS Access-Control-Allow-Methods")
    allowed_headers = {value.strip().lower() for value in headers.get("access-control-allow-headers", "").split(",")}
    if "range" not in allowed_headers:
        failures.append("OPTIONS Access-Control-Allow-Headers")
    if "access-control-allow-credentials" in headers:
        failures.append("OPTIONS CORS credentials must be absent")

    unknown = f"{manifest['base_url'].rstrip('/')}/{urllib.parse.quote(PREFIX, safe='/')}__unknown__.mp4"
    status, _ = request(unknown, "HEAD")
    if status != 404:
        failures.append(f"unknown object expected 404, got {status}")
    status, _ = request(f"{manifest['base_url'].rstrip('/')}/", "HEAD")
    if status not in (403, 404):
        failures.append(f"bucket root must not be browsable, got {status}")
    if failures:
        raise ReleaseError("public verification failed:\n" + "\n".join(failures))


def verify_private_origin(manifest: dict) -> None:
    item = manifest["objects"][0]
    key = urllib.parse.quote(item["key"], safe="/")
    url = f"https://os-sm-media-1392306384.cos.ap-nanjing.myqcloud.com/{key}"
    status, _ = request(url, "HEAD")
    if status != 403:
        raise ReleaseError(f"private COS origin expected 403, got {status}")
    status, _ = request("https://os-sm-media-1392306384.cos.ap-nanjing.myqcloud.com/", "HEAD")
    if status != 403:
        raise ReleaseError(f"private COS bucket root expected 403, got {status}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="action", required=True)

    plan_parser = sub.add_parser("plan")
    plan_parser.add_argument("--source-root", type=pathlib.Path)

    upload_parser = sub.add_parser("upload")
    upload_parser.add_argument("--source-root", required=True, type=pathlib.Path)
    upload_parser.add_argument("--replace", action="store_true")
    upload_parser.add_argument("--coscli")
    upload_parser.add_argument("--cos-config", default=os.environ.get("COSCLI_CONFIG", "~/.config/os-sm-media/coscli.yaml"))
    upload_parser.add_argument("--cos-alias", default="os-sm-media")

    manifest_parser = sub.add_parser("manifest")
    manifest_parser.add_argument("--source-root", required=True, type=pathlib.Path)

    verify_parser = sub.add_parser("verify")
    verify_parser.add_argument("--cdn", action="store_true", help="run all public CDN HEAD and Range checks")
    verify_parser.add_argument("--private-origin", action="store_true", help="confirm anonymous COS access is denied")

    args = parser.parse_args()
    try:
        if args.action == "plan":
            manifest, _ = plan(args.source_root)
            print(f"PASS plan: objects={manifest['object_count']} bytes={manifest['total_bytes']} release={manifest['release_id']}")
        elif args.action == "upload":
            upload(args)
        elif args.action == "manifest":
            write_manifest(args.source_root)
        elif args.action == "verify":
            manifest, _ = plan(None)
            if args.private_origin:
                verify_private_origin(manifest)
            if args.cdn:
                verify_public(manifest)
            print(f"PASS verify: static=true private_origin={args.private_origin} cdn={args.cdn}")
        return 0
    except (ReleaseError, OSError, ValueError) as error:
        print(f"FAIL: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
