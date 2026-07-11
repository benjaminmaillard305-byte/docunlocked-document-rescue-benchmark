# Open Document Rescue Benchmark

Reproducible evidence for a narrow question: what survives when a standard OCR baseline meets handwriting, dense tables, faded notebooks, and structured forms?

This is not a universal OCR leaderboard and it does not claim that one tool is best. Version 0.1 records raw Tesseract 5.5.2 outputs from four public web sources under two unchanged page-segmentation profiles. It publishes the inputs' provenance and hashes, raw TXT and TSV files, and descriptive metrics that anyone can recompute.

Live report: https://bluehorizonlabs.io/docunlocked/ocr-failure-benchmark/

## Included cases

| Case | Failure pressure | Source |
| --- | --- | --- |
| NIST SD19 sample | handwriting mixed with a printed form | [NIST](https://www.nist.gov/image/sd19jpg) |
| 1930 Census schedule | handwriting inside a dense row/column grid | [U.S. National Archives](https://www.archives.gov/files/education/lessons/images/1930-census-orchard-st.pdf) |
| Bell notebook page | faded historical handwriting and irregular reading order | [Library of Congress](https://www.loc.gov/resource/magbell.25300201/?sp=4) |
| IRS Form W-4 | printed labels, checkboxes, fields, and multi-column semantics | [IRS](https://www.irs.gov/pub/irs-pdf/fw4.pdf) |

## Results at a glance

- PSM 6 treats each page as one uniform block.
- PSM 11 searches for sparse text without a fixed reading order.
- The benchmark reports recognized word count, text characters, non-empty lines, mean confidence, median confidence, and words below 50 confidence.
- Tesseract confidence is an engine signal, not ground-truth accuracy.
- No customer files are included.

See [PROTOCOL.md](PROTOCOL.md) for the exact commands and limitations. Machine-readable results are in [results/summary.json](results/summary.json) and [results/summary.csv](results/summary.csv).

## Reproduce

Prerequisites: Tesseract 5.5.2 with the `eng` model and the exact source derivatives identified in `data/cases.json`.

```bash
DOCUNLOCKED_SITE_ROOT=/path/to/site/docunlocked ./scripts/run-benchmark.sh
node scripts/summarize.mjs
```

The summarizer fails when an expected result is missing and writes deterministic JSON and CSV from the TSV/TXT files.

## Contributions

Open an issue with a public or contributor-authorized difficult document, source rights information, and the failure mode it tests. Do not submit private, personal, medical, legal, or customer documents.

## Rights

Benchmark code is MIT licensed. Source documents remain under their source terms. No license is granted here for third-party source documents. Generated OCR outputs and metadata are provided for research and evaluation to the extent Blue Horizon Ventures Florida LLC can license them.
