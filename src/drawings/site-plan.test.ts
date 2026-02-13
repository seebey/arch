import { describe, it } from 'node:test';
import assert from 'node:assert';
import { generateSitePlan } from './site-plan.js';
import { SITE } from '../config/house.js';

describe('Site Plan Generator', () => {
  it('generates site plan SVG', () => {
    const svg = generateSitePlan(SITE, 'Site Plan');
    assert.ok(svg.includes('<svg'));
    assert.ok(svg.includes('Site Plan'));
  });

  it('includes property boundary', () => {
    const svg = generateSitePlan(SITE, 'Site Plan');
    assert.ok(svg.includes('<rect'));
  });

  it('includes buildings', () => {
    const svg = generateSitePlan(SITE, 'Site Plan');
    assert.ok(svg.includes('Main House') || svg.includes('MAIN'));
  });
});
