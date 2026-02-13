import { describe, it } from 'node:test';
import assert from 'node:assert';
import { generateFloorPlan } from './floor-plan.js';
import { HOUSE } from '../config/house.js';

describe('Floor Plan Generator', () => {
  it('generates SVG for ground floor', () => {
    const ground = HOUSE.floors.find(f => f.level === 0)!;
    const svg = generateFloorPlan(ground, 'Ground Floor - Main House');
    assert.ok(svg.includes('<svg'));
    assert.ok(svg.includes('</svg>'));
    assert.ok(svg.includes('Ground Floor'));
  });

  it('includes all rooms', () => {
    const ground = HOUSE.floors.find(f => f.level === 0)!;
    const svg = generateFloorPlan(ground, 'Ground Floor');
    assert.ok(svg.includes('LIVING ROOM'));
    assert.ok(svg.includes('KITCHEN'));
  });
});
