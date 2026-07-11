#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${DOCUNLOCKED_SITE_ROOT:-}" ]]; then
  echo "Set DOCUNLOCKED_SITE_ROOT to the local docunlocked site directory." >&2
  exit 1
fi

command -v tesseract >/dev/null || { echo "Tesseract is required." >&2; exit 1; }
version=$(tesseract --version 2>&1 | head -1 | awk '{print $2}')
[[ "$version" == "5.5.2" ]] || { echo "Expected Tesseract 5.5.2, found $version." >&2; exit 1; }

root=$(cd "$(dirname "$0")/.." && pwd)
mkdir -p "$root/results/tesseract-5.5.2"

run_case() {
  local id=$1
  local asset=$2
  local expected=$3
  local source="$DOCUNLOCKED_SITE_ROOT/$asset"
  [[ -f "$source" ]] || { echo "Missing source: $source" >&2; exit 1; }
  actual=$(shasum -a 256 "$source" | awk '{print $1}')
  [[ "$actual" == "$expected" ]] || { echo "Hash mismatch for $id" >&2; exit 1; }
  for psm in 6 11; do
    tesseract "$source" "$root/results/tesseract-5.5.2/${id}-psm${psm}" -l eng --oem 1 --psm "$psm" txt tsv
  done
}

run_case nist-sd19 assets/industry/handwriting-nist-form.jpg 19077d062910638da0aa39e2a4344da68374ec745231074dbf9f46f07b72a1bc
run_case nara-1930-census assets/industry/handwriting-census-table.jpg 489eb0a3acbed2bfe7c9452d10e140cd8c090af2add702e1f8f8b9881aa1088c
run_case loc-bell-notebook assets/industry/handwriting-lab-notebook.jpg 4d387dd0ba9d38af0ac7d2751a7db10c822f360d6d0fa2d2efbd7c632a6c48a5
run_case irs-w4 assets/proof-public/before-irs-w4-en.jpg 904b53ad9c31444e1db36e6dcfc830155616a48e97a26ac46f52e2039c774192

node "$root/scripts/summarize.mjs"
