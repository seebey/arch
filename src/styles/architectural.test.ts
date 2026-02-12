import { describe, it } from 'node:test';
import assert from 'node:assert';
import { STYLES, SCALE } from './architectural.js';

describe('Architectural Styles', () => {
  it('defines wall styles', () => {
    assert.ok(STYLES.exteriorWall);
    assert.equal(STYLES.exteriorWall.strokeWidth, 3);
    assert.ok(STYLES.interiorWall);
    assert.equal(STYLES.interiorWall.strokeWidth, 2);
  });

  it('defines scale constants', () => {
    assert.equal(SCALE.pixelsPerFoot, 12);
  });

  it('has door and window styles', () => {
    assert.ok(STYLES.door);
    assert.ok(STYLES.window);
  });
});
