#!/usr/bin/env bash
set -euo pipefail

TARGET="${1:-docs/index.html}"
EXPECTED_TITLE="os-sm.84000.art"
EXPECTED_DOMAIN="os-sm.84000.art"

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

if ! grep -Fq "$EXPECTED_DOMAIN" "$tmp_file"; then
  echo "FAIL: expected domain text not found: $EXPECTED_DOMAIN" >&2
  exit 1
fi

bytes="$(wc -c < "$tmp_file" | tr -d ' ')"
sha="$(shasum -a 256 "$tmp_file" | awk '{print $1}')"
echo "PASS: $TARGET"
echo "bytes=$bytes"
echo "sha256=$sha"
