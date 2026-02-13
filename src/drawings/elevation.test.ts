import { describe, it } from 'node:test';
import assert from 'node:assert';
import { generateElevation } from './elevation.js';

describe('Elevation Generator', () => {
  it('generates front elevation SVG', () => {
    const svg = generateElevation('front', 'Front Elevation');
    assert.ok(svg.includes('<svg'));
    assert.ok(svg.includes('Front Elevation'));
  });

  it('generates rear elevation SVG', () => {
    const svg = generateElevation('rear', 'Rear Elevation');
    assert.ok(svg.includes('<svg'));
  });

  it('includes roof outline', () => {
    const svg = generateElevation('front', 'Front Elevation');
    assert.ok(svg.includes('<path') || svg.includes('<polyline'));
  });
});
