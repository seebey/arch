import { describe, it } from 'node:test';
import assert from 'node:assert';
import { generateRoofPlan } from './roof-plan.js';

describe('Roof Plan Generator', () => {
  it('generates roof plan SVG', () => {
    const svg = generateRoofPlan('Roof Plan');
    assert.ok(svg.includes('<svg'));
    assert.ok(svg.includes('Roof Plan'));
  });

  it('shows roof ridges', () => {
    const svg = generateRoofPlan('Roof Plan');
    assert.ok(svg.includes('<line') || svg.includes('<path'));
  });
});
