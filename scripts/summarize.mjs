import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'data/cases.json'),'utf8'));

function median(values){
  const sorted=[...values].sort((a,b)=>a-b);
  const middle=Math.floor(sorted.length/2);
  return sorted.length%2?sorted[middle]:(sorted[middle-1]+sorted[middle])/2;
}

function summarizeCase(testCase,psm){
  const base=path.join(root,'results','tesseract-5.5.2',`${testCase.id}-psm${psm}`);
  const text=fs.readFileSync(`${base}.txt`,'utf8').trim();
  const rows=fs.readFileSync(`${base}.tsv`,'utf8').trim().split(/\r?\n/).slice(1);
  const words=rows.map(row=>row.split('\t')).filter(columns=>columns.length>=12&&columns[11].trim()&&Number(columns[10])>=0);
  const confidences=words.map(columns=>Number(columns[10]));
  const below50=confidences.filter(value=>value<50).length;
  return {
    case_id:testCase.id,
    title:testCase.title,
    psm,
    recognized_words:words.length,
    text_characters:text.length,
    nonempty_lines:text.split(/\r?\n/).filter(line=>line.trim()).length,
    mean_confidence:Number((confidences.reduce((sum,value)=>sum+value,0)/confidences.length).toFixed(2)),
    median_confidence:Number(median(confidences).toFixed(2)),
    words_below_50:below50,
    words_below_50_share:Number((below50/confidences.length).toFixed(4)),
    source_sha256:testCase.source_sha256,
    observation:testCase.observation
  };
}

const results=manifest.cases.flatMap(testCase=>manifest.engine.page_segmentation_modes.map(psm=>summarizeCase(testCase,psm)));
const report={
  benchmark_version:manifest.benchmark_version,
  released:manifest.released,
  engine:manifest.engine,
  interpretation_warning:'Engine confidence is not ground-truth accuracy.',
  results
};
fs.writeFileSync(path.join(root,'results/summary.json'),JSON.stringify(report,null,2)+'\n');

const columns=['case_id','title','psm','recognized_words','text_characters','nonempty_lines','mean_confidence','median_confidence','words_below_50','words_below_50_share','source_sha256'];
const csv=[columns.join(','),...results.map(result=>columns.map(column=>JSON.stringify(result[column])).join(','))].join('\n')+'\n';
fs.writeFileSync(path.join(root,'results/summary.csv'),csv);
console.log(JSON.stringify({ok:true,benchmark_version:report.benchmark_version,results:results.length},null,2));
