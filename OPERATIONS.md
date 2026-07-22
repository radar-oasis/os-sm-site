# OS-SM media operations

The website is served by GitHub Pages. Public video URLs use
`https://media.84000.art`, which normally points to Tencent Cloud CDN. The CDN
privately pulls from `os-sm-media-1392306384` in `ap-nanjing`.

## Publisher setup

1. Sign in through Tencent Cloud's sub-account login page using
   `os-sm-media-publisher@<owner-account-id-or-alias>`. The publisher CAM UIN
   is an identity check value, not the owner account ID used in the login
   name. Obtain the owner account ID or alias and the one-time password through
   a separate secure channel.
2. Change the temporary password immediately and enroll an MFA authenticator.
3. Install COSBrowser for occasional uploads. Select the existing
   `os-sm-media-1392306384` bucket and keep every video below
   `随身寺庙短视频30秒/`.
4. Install `coscli` from Tencent's official release and create a dedicated
   config at `~/.config/os-sm-media/coscli.yaml` with mode `0600`.
5. Add the bucket with alias `os-sm-media` in region `ap-nanjing`.

Never place passwords, SecretId, SecretKey, session tokens, or COS configs in
this repository, chat, PDFs, shell scripts, or server command history. Rotate
the publisher API key every 90 days.

## Release workflow

The repository manifest is the source of truth. Existing 45 legacy filenames,
including uppercase `.MP4` suffixes, must not be renamed. New videos must use a
lowercase `.mp4` suffix and must not contain `#`, `?`, control characters, or a
duplicate filename.

```bash
export COSCLI_CONFIG="$HOME/.config/os-sm-media/coscli.yaml"
export PATH="$HOME/.local/bin:$PATH"

# The source root contains the 随身寺庙短视频30秒 directory.
python3 scripts/media_release.py plan --source-root /path/to/media-root

# Uploads new objects and skips unchanged objects. It never runs sync --delete.
python3 scripts/media_release.py upload --source-root /path/to/media-root

# An intentional replacement must be explicit. COS versioning retains history.
python3 scripts/media_release.py upload --source-root /path/to/media-root --replace

# Regenerate hashes, sizes, release_id, and the shared browser configuration.
python3 scripts/media_release.py manifest --source-root /path/to/media-root

python3 scripts/media_release.py plan --source-root /path/to/media-root
bash scripts/smoke.sh
```

Open a pull request only after the final plan and smoke gates pass. The manifest
action updates `docs/media-release.json`, `docs/media-config.js`, and the release
reference in `docs/sw.js`; commit all three together. Cache invalidation uses
`?v=<release_id>`, so publishers do not need CDN purge permission.

After deployment, run the public acceptance gate:

```bash
python3 scripts/media_release.py verify --private-origin --cdn
bash scripts/smoke.sh https://os-sm.84000.art/
```

The scheduled GitHub Actions job repeats all 45 HEAD and two-byte Range checks
daily without cloud credentials.

## Rollback

The application always uses `media.84000.art`. If CDN playback has widespread
403, 404, 5xx, TLS, CORS, or Range failures, change only the NewNet DNS record:

```text
media.84000.art  A  1.13.184.65  TTL 600
```

Confirm that the old server returns `200` for HEAD and `206` for
`Range: bytes=0-1`. Once the CDN is repaired, restore the CNAME supplied by
Tencent Cloud. Do not delete or move the old-server source videos during the
90-day rollback window.

## Security checks

- The publisher may list only the URL-encoded media prefix and may read/upload
  its objects.
- The publisher must receive `403` when listing another prefix, reading bucket
  ACL/configuration, uploading outside the prefix, or deleting an object.
- Anonymous direct COS requests must receive `403`; CDN requests are public.
- Git and CI logs must remain free of account passwords and cloud credentials.
