// scripts/compress-dist.mjs
// Pre-compresses static build assets with Brotli and Gzip using native Node.js zlib

import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const distDir = path.resolve('dist');

if (!fs.existsSync(distDir)) {
  console.error('dist directory not found.');
  process.exit(1);
}

const COMPRESSIBLE_EXTS = new Set(['.html', '.css', '.js', '.json', '.svg', '.txt', '.xml']);

function getFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getFiles(fullPath));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (COMPRESSIBLE_EXTS.has(ext)) {
        files.push(fullPath);
      }
    }
  }
  return files;
}

const files = getFiles(distDir);
let totalOriginal = 0;
let totalBrotli = 0;
let totalGzip = 0;

for (const file of files) {
  const content = fs.readFileSync(file);
  totalOriginal += content.length;

  // Gzip compression (maximum level 9)
  const gzipped = zlib.gzipSync(content, { level: 9 });
  fs.writeFileSync(`${file}.gz`, gzipped);
  totalGzip += gzipped.length;

  // Brotli compression (maximum quality 11)
  const brotli = zlib.brotliCompressSync(content, {
    params: {
      [zlib.constants.BROTLI_PARAM_QUALITY]: 11
    }
  });
  fs.writeFileSync(`${file}.br`, brotli);
  totalBrotli += brotli.length;
}

const origKb = (totalOriginal / 1024).toFixed(1);
const gzKb = (totalGzip / 1024).toFixed(1);
const brKb = (totalBrotli / 1024).toFixed(1);
const brSavings = (100 - (totalBrotli / totalOriginal) * 100).toFixed(1);

console.log(`📦 Pre-compression complete for ${files.length} text assets:`);
console.log(`   Original: ${origKb} kB | Gzip: ${gzKb} kB | Brotli: ${brKb} kB (-${brSavings}%)`);
