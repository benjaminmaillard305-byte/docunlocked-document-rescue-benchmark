#!/usr/bin/env node
// Interactive analyzer: https://bluehorizonlabs.io/docunlocked/tesseract-confidence-analyzer/
// Interpretation guide: https://bluehorizonlabs.io/docunlocked/tesseract-confidence-score/

import fs from 'node:fs';

const file=process.argv[2];
if(!file){
  console.error('Usage: node tesseract-confidence-summary.mjs output.tsv');
  process.exit(1);
}

const lines=fs.readFileSync(file,'utf8').replace(/^\uFEFF/,'').split(/\r?\n/).filter(line=>line.trim());
const headers=lines[0].split('\t');
const confIndex=headers.indexOf('conf');
const textIndex=headers.indexOf('text');
const pageIndex=headers.indexOf('page_num');

if(confIndex<0||textIndex<0||pageIndex<0){
  throw new Error('Expected Tesseract TSV columns: page_num, conf and text.');
}

const words=lines.slice(1).map(line=>line.split('\t')).filter(columns=>{
  return String(columns[textIndex]||'').trim()&&Number(columns[confIndex])>=0;
}).map(columns=>({
  text:String(columns[textIndex]).trim(),
  confidence:Number(columns[confIndex]),
  page:Number(columns[pageIndex])||1
}));

if(!words.length)throw new Error('No recognized word rows found.');

const confidences=words.map(word=>word.confidence).sort((a,b)=>a-b);
const middle=Math.floor(confidences.length/2);
const median=confidences.length%2?confidences[middle]:(confidences[middle-1]+confidences[middle])/2;
const below50=words.filter(word=>word.confidence<50);

console.log(JSON.stringify({
  interpretation_warning:'Tesseract confidence is not ground-truth OCR accuracy.',
  recognized_words:words.length,
  pages:new Set(words.map(word=>word.page)).size,
  mean_confidence:Number((confidences.reduce((sum,value)=>sum+value,0)/confidences.length).toFixed(2)),
  median_confidence:Number(median.toFixed(2)),
  words_below_50:below50.length,
  words_below_50_share:Number((below50.length/words.length).toFixed(4)),
  lowest_confidence_words:[...words].sort((a,b)=>a.confidence-b.confidence).slice(0,20)
},null,2));
