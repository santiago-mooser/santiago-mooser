#!/usr/bin/env sh
# Renders dist/index.html to dist/cv.pdf with headless Chrome.
# Locally on NixOS: nix-shell -p chromium --command 'npm run pdf'
set -eu

BIN="${CHROME_BIN:-}"
[ -n "$BIN" ] || BIN=$(command -v google-chrome || command -v chromium || command -v chromium-browser) \
  || { echo "no Chrome/Chromium found; set CHROME_BIN" >&2; exit 1; }
[ -f dist/index.html ] || { echo "dist/index.html missing — run npm run build first" >&2; exit 1; }

"$BIN" --headless=new --disable-gpu --no-sandbox \
  --no-pdf-header-footer \
  --print-to-pdf="dist/cv.pdf" \
  "file://$(pwd)/dist/index.html"

# Legacy URL that was advertised for two years — serve the same PDF there
cp dist/cv.pdf dist/cv_santiago_espinosa_mooser.pdf
echo "Wrote dist/cv.pdf and dist/cv_santiago_espinosa_mooser.pdf"
