import { describe, it } from 'node:test';
import assert from 'node:assert';
import { HOUSE, CASITA, SITE, SITE_POSITIONS } from './house.js';

describe('House Configuration', () => {
  it('defines main house with floors', () => {
    assert.equal(HOUSE.name, 'Main House');
    assert.equal(HOUSE.floors.length, 2);
  });

  it('has ground floor with correct rooms', () => {
    const ground = HOUSE.floors.find(f => f.level === 0);
    assert.ok(ground);
    const roomNames = ground!.rooms.map(r => r.name);
    assert.ok(roomNames.includes('Living Room'));
    assert.ok(roomNames.includes('Kitchen'));
    assert.ok(roomNames.includes('Dining Room'));
    assert.ok(roomNames.includes('Foyer'));
    assert.ok(roomNames.includes('Garage'));
  });

  it('has upper floor with bedrooms', () => {
    const upper = HOUSE.floors.find(f => f.level === 1);
    assert.ok(upper);
    const roomNames = upper!.rooms.map(r => r.name);
    assert.ok(roomNames.includes('Kids Bedroom 1'));
    assert.ok(roomNames.includes('Kids Bedroom 2'));
    assert.ok(roomNames.includes('Bonus Room'));
  });

  it('defines casita building', () => {
    assert.equal(CASITA.name, 'Master Casita');
    assert.equal(CASITA.floors.length, 1);
    const roomNames = CASITA.floors[0].rooms.map(r => r.name);
    assert.ok(roomNames.includes('Master Bedroom'));
    assert.ok(roomNames.includes('Master Bath'));
    assert.ok(roomNames.includes('Walk-in Closet'));
  });

  it('defines site with buildings and walkway', () => {
    assert.equal(SITE.buildings.length, 2);
    assert.ok(SITE.walkways.length > 0);
    assert.ok(SITE.walkways[0].covered);
    assert.equal(SITE.dimensions.width, 100);
    assert.equal(SITE.dimensions.height, 150);
  });

  it('defines site positions for rendering', () => {
    assert.ok(SITE_POSITIONS.mainHouse);
    assert.ok(SITE_POSITIONS.casita);
    assert.ok(SITE_POSITIONS.mainHouse.x >= 0);
    assert.ok(SITE_POSITIONS.casita.y > SITE_POSITIONS.mainHouse.y);
  });

  it('rooms do not overlap on ground floor', () => {
    const ground = HOUSE.floors.find(f => f.level === 0)!;
    for (let i = 0; i < ground.rooms.length; i++) {
      for (let j = i + 1; j < ground.rooms.length; j++) {
        const a = ground.rooms[i];
        const b = ground.rooms[j];
        const aRight = a.position.x + a.dimensions.width;
        const aBottom = a.position.y + a.dimensions.height;
        const bRight = b.position.x + b.dimensions.width;
        const bBottom = b.position.y + b.dimensions.height;

        const overlapsX = a.position.x < bRight && aRight > b.position.x;
        const overlapsY = a.position.y < bBottom && aBottom > b.position.y;

        if (overlapsX && overlapsY) {
          const overlapX = Math.min(aRight, bRight) - Math.max(a.position.x, b.position.x);
          const overlapY = Math.min(aBottom, bBottom) - Math.max(a.position.y, b.position.y);
          assert.ok(
            overlapX <= 0.5 || overlapY <= 0.5,
            `Rooms "${a.name}" and "${b.name}" overlap significantly`
          );
        }
      }
    }
  });
});
