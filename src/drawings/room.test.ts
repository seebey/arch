import { describe, it } from 'node:test';
import assert from 'node:assert';
import { renderRoom, renderRoomLabel } from './room.js';
import { Room } from '../core/types.js';

describe('Room Renderer', () => {
  const testRoom: Room = {
    name: 'Test Room',
    position: { x: 0, y: 0 },
    dimensions: { width: 10, height: 12 },
    walls: [
      { side: 'top', thickness: 0.5, exterior: true },
      { side: 'left', thickness: 0.5, exterior: true }
    ],
    doors: [],
    windows: [
      { position: { x: 2, y: 0 }, width: 4 }
    ],
    label: 'TEST'
  };

  it('renders room walls as SVG', () => {
    const svg = renderRoom(testRoom);
    assert.ok(svg.includes('<rect'));
    assert.ok(svg.includes('<line'));
  });

  it('renders room label', () => {
    const svg = renderRoomLabel(testRoom);
    assert.ok(svg.includes('<text'));
    assert.ok(svg.includes('TEST'));
  });
});
