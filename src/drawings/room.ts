import { Room } from '../core/types.js';
import { rect, line, text, path } from '../core/svg.js';
import { STYLES, feetToPixels } from '../styles/architectural.js';

export function renderRoom(room: Room): string {
  const x = feetToPixels(room.position.x);
  const y = feetToPixels(room.position.y);
  const w = feetToPixels(room.dimensions.width);
  const h = feetToPixels(room.dimensions.height);

  const elements: string[] = [];

  // Room outline (light)
  elements.push(rect(x, y, w, h, { fill: 'none', stroke: '#ccc', strokeWidth: 0.5 }));

  // Walls
  for (const wall of room.walls) {
    const style = wall.exterior ? STYLES.exteriorWall : STYLES.interiorWall;
    const t = feetToPixels(wall.thickness);

    switch (wall.side) {
      case 'top':
        elements.push(rect(x, y, w, t, style));
        break;
      case 'bottom':
        elements.push(rect(x, y + h - t, w, t, style));
        break;
      case 'left':
        elements.push(rect(x, y, t, h, style));
        break;
      case 'right':
        elements.push(rect(x + w - t, y, t, h, style));
        break;
    }
  }

  // Doors
  for (const door of room.doors) {
    const dx = x + feetToPixels(door.position.x);
    const dy = y + feetToPixels(door.position.y);
    const dw = feetToPixels(door.width);

    if (door.slidingGlass) {
      // Sliding glass door - double line
      elements.push(line(dx, dy, dx + dw, dy, { stroke: 'black', strokeWidth: 2 }));
      elements.push(line(dx, dy - 2, dx + dw, dy - 2, { stroke: 'black', strokeWidth: 1 }));
    } else {
      // Regular door with swing arc
      elements.push(line(dx, dy, dx + dw, dy, STYLES.door));
      // Door swing arc
      const arcRadius = dw;
      let arcPath = '';
      switch (door.swing) {
        case 'down':
          arcPath = `M ${dx} ${dy} A ${arcRadius} ${arcRadius} 0 0 1 ${dx + dw} ${dy + dw}`;
          break;
        case 'up':
          arcPath = `M ${dx} ${dy} A ${arcRadius} ${arcRadius} 0 0 0 ${dx + dw} ${dy - dw}`;
          break;
        case 'left':
          arcPath = `M ${dx} ${dy} A ${arcRadius} ${arcRadius} 0 0 0 ${dx - dw} ${dy + dw}`;
          break;
        case 'right':
          arcPath = `M ${dx} ${dy} A ${arcRadius} ${arcRadius} 0 0 1 ${dx + dw} ${dy + dw}`;
          break;
      }
      elements.push(path(arcPath, STYLES.doorSwing));
    }
  }

  // Windows
  for (const window of room.windows) {
    const wx = x + feetToPixels(window.position.x);
    const wy = y + feetToPixels(window.position.y);
    const ww = feetToPixels(window.width);
    elements.push(rect(wx - 1, wy - 1, ww + 2, 4, STYLES.window));
    elements.push(line(wx, wy, wx + ww, wy, { stroke: 'black', strokeWidth: 1 }));
  }

  return elements.join('\n');
}

export function renderRoomLabel(room: Room): string {
  if (!room.label) return '';

  const x = feetToPixels(room.position.x + room.dimensions.width / 2);
  const y = feetToPixels(room.position.y + room.dimensions.height / 2);

  const lines = (room.label || room.name).split('\n');
  const elements: string[] = [];

  lines.forEach((labelLine, i) => {
    const yOffset = (i - (lines.length - 1) / 2) * 12;
    elements.push(text(x, y + yOffset, labelLine, STYLES.roomLabel));
  });

  // Dimensions below label
  const dimText = `${room.dimensions.width}' × ${room.dimensions.height}'`;
  elements.push(text(x, y + lines.length * 6 + 10, dimText, STYLES.roomDimension));

  return elements.join('\n');
}
