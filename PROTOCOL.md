# Protocol v0.1

Release date: 2026-07-11

## Question

How much text does a standard open-source OCR baseline surface from four structurally different difficult documents, and what structural information is visibly absent from the resulting plain text?

## Baseline

- Engine: Tesseract 5.5.2
- Language model: `eng`
- OCR engine mode: `--oem 1`
- Page segmentation profiles:
  - `--psm 6`: assume one uniform block of text;
  - `--psm 11`: sparse text with no prescribed order.
- Outputs: plain text and TSV.
- Preprocessing: none beyond the fixed source derivatives identified by SHA-256.

Every case receives the same two profiles. There is no per-document tuning.

## Metrics

- `recognized_words`: non-empty TSV tokens with non-negative confidence.
- `text_characters`: character count after trimming the TXT output.
- `nonempty_lines`: non-empty TXT lines.
- `mean_confidence`: arithmetic mean of recognized-word confidence values.
- `median_confidence`: median recognized-word confidence.
- `words_below_50`: count and share of recognized words with confidence below 50.

Confidence is not accuracy. The benchmark does not provide character error rate or word error rate because no complete, independently verified ground truth is bundled for all four cases.

## Interpretation boundary

The raw outputs can demonstrate fragmentation, reading-order loss, and missing table semantics. They cannot establish that another engine is more accurate without the same inputs, a declared configuration, and a suitable ground truth.

The Bell notebook source is linked but not redistributed by this repository. See the Library of Congress source page for rights information. Other source terms are recorded in `data/cases.json`.

## Reproducibility

`scripts/run-benchmark.sh` verifies that each expected source file exists, checks its SHA-256 against the manifest, then runs both profiles. `scripts/summarize.mjs` parses the generated TSV and TXT files and emits deterministic summaries.
