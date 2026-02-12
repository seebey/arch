import { describe, it } from 'node:test';
import assert from 'node:assert';
import { rect, line, text, path, polyline, svgDoc } from './svg.js';

describe('SVG Primitives', () => {
  it('creates a rect element', () => {
    const r = rect(10, 20, 100, 50, { fill: 'none', stroke: 'black' });
    assert.ok(r.includes('<rect'));
    assert.ok(r.includes('x="10"'));
    assert.ok(r.includes('y="20"'));
    assert.ok(r.includes('width="100"'));
    assert.ok(r.includes('height="50"'));
  });

  it('creates a line element', () => {
    const l = line(0, 0, 100, 100, { stroke: 'black', strokeWidth: 2 });
    assert.ok(l.includes('<line'));
    assert.ok(l.includes('x1="0"'));
    assert.ok(l.includes('y1="0"'));
    assert.ok(l.includes('x2="100"'));
    assert.ok(l.includes('y2="100"'));
  });

  it('creates a text element', () => {
    const t = text(50, 50, 'Living Room', { fontSize: 12 });
    assert.ok(t.includes('<text'));
    assert.ok(t.includes('Living Room'));
  });

  it('creates a path element', () => {
    const p = path('M 0 0 L 100 0 L 100 100 Z', { fill: 'none' });
    assert.ok(p.includes('<path'));
    assert.ok(p.includes('d="M 0 0 L 100 0 L 100 100 Z"'));
  });

  it('creates a polyline element', () => {
    const pl = polyline([{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }]);
    assert.ok(pl.includes('<polyline'));
    assert.ok(pl.includes('points="0,0 100,0 100,100"'));
  });

  it('wraps content in SVG document', () => {
    const doc = svgDoc(800, 600, '<rect x="0" y="0" width="100" height="100"/>');
    assert.ok(doc.includes('<svg'));
    assert.ok(doc.includes('width="800"'));
    assert.ok(doc.includes('height="600"'));
    assert.ok(doc.includes('</svg>'));
  });
});
