#!/usr/bin/env bash
set -euo pipefail

TARGET="${1:-docs/index.html}"
EXPECTED_TITLE="隨身寺廟 · 非遺工藝譜系（iPad）"
EXPECTED_DOMAIN="os-sm.84000.art"
EXPECTED_MEDIA_DOMAIN="media.84000.art"

tmp_file="$(mktemp)"
cleanup() {
  rm -f "$tmp_file"
}
trap cleanup EXIT

if [[ "$TARGET" == http://* || "$TARGET" == https://* ]]; then
  status="$(curl --http1.1 -L -sS -o "$tmp_file" -w "%{http_code}" "$TARGET")"
  if [[ "$status" != "200" ]]; then
    echo "FAIL: expected HTTP 200, got $status for $TARGET" >&2
    exit 1
  fi
  base_url="${TARGET%/}"
  media_config="$(curl --http1.1 -L -fsS "$base_url/media-config.js")"
  media_manifest="$(curl --http1.1 -L -fsS "$base_url/media-release.json")"
  if [[ "$media_config" != *"$EXPECTED_MEDIA_DOMAIN"* ]]; then
    echo "FAIL: deployed media-config.js does not use $EXPECTED_MEDIA_DOMAIN" >&2
    exit 1
  fi
  if [[ "$media_manifest" != *'"schema": "os-sm-media-release-v1"'* ]]; then
    echo "FAIL: deployed media-release.json is missing or invalid" >&2
    exit 1
  fi
else
  cp "$TARGET" "$tmp_file"
  if [[ ! -f docs/CNAME ]]; then
    echo "FAIL: docs/CNAME not found" >&2
    exit 1
  fi
  cname="$(tr -d '[:space:]' < docs/CNAME)"
  if [[ "$cname" != "$EXPECTED_DOMAIN" ]]; then
    echo "FAIL: docs/CNAME must be $EXPECTED_DOMAIN, got $cname" >&2
    exit 1
  fi
fi

if ! grep -Fq "<title>$EXPECTED_TITLE</title>" "$tmp_file"; then
  echo "FAIL: expected title not found: $EXPECTED_TITLE" >&2
  exit 1
fi

if ! grep -Fq 'src="media-config.js?v=15"' "$tmp_file"; then
  echo "FAIL: shared media configuration is not loaded" >&2
  exit 1
fi

python3 scripts/media_release.py plan

bytes="$(wc -c < "$tmp_file" | tr -d ' ')"
sha="$(shasum -a 256 "$tmp_file" | awk '{print $1}')"
echo "PASS: $TARGET"
echo "bytes=$bytes"
echo "sha256=$sha"
