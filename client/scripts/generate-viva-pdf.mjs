import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { jsPDF } from 'jspdf';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.resolve(__dirname, '../../docs/viva-fullstack-qa.md');
const outputPath = path.resolve(__dirname, '../../docs/viva-fullstack-qa.pdf');

const markdown = fs.readFileSync(inputPath, 'utf8');
const lines = markdown.split('\n');

const doc = new jsPDF({ unit: 'pt', format: 'a4' });
const pageWidth = doc.internal.pageSize.getWidth();
const pageHeight = doc.internal.pageSize.getHeight();
const margin = 44;
const maxWidth = pageWidth - margin * 2;

let y = margin;

const ensureSpace = (needed = 18) => {
  if (y + needed > pageHeight - margin) {
    doc.addPage();
    y = margin;
  }
};

const writeLine = (text, opts = {}) => {
  const { font = 'helvetica', style = 'normal', size = 11, color = [17, 24, 39], spacing = 16 } = opts;
  doc.setFont(font, style);
  doc.setFontSize(size);
  doc.setTextColor(...color);

  const wrapped = doc.splitTextToSize(text, maxWidth);
  for (const part of wrapped) {
    ensureSpace(spacing);
    doc.text(part, margin, y);
    y += spacing;
  }
};

for (const raw of lines) {
  const line = raw.trimEnd();

  if (!line.trim()) {
    y += 6;
    continue;
  }

  if (line.startsWith('# ')) {
    y += 4;
    writeLine(line.slice(2), { style: 'bold', size: 18, color: [15, 23, 42], spacing: 24 });
    y += 2;
    continue;
  }

  if (line.startsWith('## ')) {
    y += 2;
    writeLine(line.slice(3), { style: 'bold', size: 14, color: [15, 23, 42], spacing: 20 });
    continue;
  }

  if (line.startsWith('Q:')) {
    writeLine(line, { style: 'bold', size: 11.5, color: [15, 23, 42], spacing: 16 });
    continue;
  }

  if (line.startsWith('A:')) {
    writeLine(line, { size: 11, color: [31, 41, 55], spacing: 16 });
    continue;
  }

  if (/^\d+\.\s/.test(line)) {
    writeLine(line, { size: 11, color: [31, 41, 55], spacing: 16 });
    continue;
  }

  if (line.startsWith('- ')) {
    writeLine(`• ${line.slice(2)}`, { size: 11, color: [31, 41, 55], spacing: 16 });
    continue;
  }

  writeLine(line, { size: 11, color: [31, 41, 55], spacing: 16 });
}

const buffer = Buffer.from(doc.output('arraybuffer'));
fs.writeFileSync(outputPath, buffer);

console.log(`PDF generated: ${outputPath}`);
