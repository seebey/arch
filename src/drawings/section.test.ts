import { describe, it } from 'node:test';
import assert from 'node:assert';
import { generateSection } from './section.js';

describe('Section Generator', () => {
  it('generates section SVG', () => {
    const svg = generateSection('Section A-A');
    assert.ok(svg.includes('<svg'));
    assert.ok(svg.includes('Section A-A'));
  });

  it('shows floor levels', () => {
    const svg = generateSection('Section A-A');
    assert.ok(svg.includes('GROUND') || svg.includes('UPPER') || svg.includes('floor'));
  });
});
