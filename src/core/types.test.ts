import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Room, Point, Dimensions, Wall, Door, Window } from './types.js';

describe('Core Types', () => {
  it('creates a valid Room', () => {
    const room: Room = {
      name: 'Living Room',
      position: { x: 0, y: 0 },
      dimensions: { width: 18, height: 20 },
      walls: [],
      doors: [],
      windows: []
    };
    assert.equal(room.name, 'Living Room');
    assert.equal(room.dimensions.width, 18);
  });

  it('creates a valid Door', () => {
    const door: Door = {
      position: { x: 5, y: 0 },
      width: 3,
      swing: 'left'
    };
    assert.equal(door.width, 3);
    assert.equal(door.swing, 'left');
  });

  it('creates a valid Window', () => {
    const window: Window = {
      position: { x: 2, y: 0 },
      width: 4
    };
    assert.equal(window.width, 4);
  });
});
