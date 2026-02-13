import { describe, it } from 'node:test';
import assert from 'node:assert';
import { existsSync, unlinkSync } from 'node:fs';
import { svgToPdf } from './pdf.js';
import { svgDoc, rect } from './svg.js';

describe('PDF Export', () => {
  const testSvg = svgDoc(200, 200, rect(10, 10, 180, 180, { fill: 'none', stroke: 'black' }));
  const testPath = './test-output.pdf';

  it('converts SVG to PDF file', async () => {
    await svgToPdf(testSvg, testPath);
    assert.ok(existsSync(testPath));
    unlinkSync(testPath);
  });
});
