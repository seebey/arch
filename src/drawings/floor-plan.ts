import { Floor } from '../core/types.js';
import { svgDoc, text, line, rect } from '../core/svg.js';
import { renderRoom, renderRoomLabel } from './room.js';
import { STYLES, feetToPixels } from '../styles/architectural.js';

const MARGIN = 50;
const TITLE_HEIGHT = 40;

export function generateFloorPlan(floor: Floor, title: string): string {
  // Calculate bounds
  let maxX = 0;
  let maxY = 0;
  for (const room of floor.rooms) {
    const roomRight = room.position.x + room.dimensions.width;
    const roomBottom = room.position.y + room.dimensions.height;
    if (roomRight > maxX) maxX = roomRight;
    if (roomBottom > maxY) maxY = roomBottom;
  }

  const contentWidth = feetToPixels(maxX);
  const contentHeight = feetToPixels(maxY);
  const width = contentWidth + MARGIN * 2;
  const height = contentHeight + MARGIN * 2 + TITLE_HEIGHT;

  const elements: string[] = [];

  // Background
  elements.push(rect(0, 0, width, height, { fill: 'white' }));

  // Title block
  elements.push(text(MARGIN, 30, title, STYLES.titleBlock));
  elements.push(line(MARGIN, TITLE_HEIGHT, width - MARGIN, TITLE_HEIGHT, { stroke: 'black', strokeWidth: 1 }));

  // Translate content
  elements.push(`<g transform="translate(${MARGIN}, ${MARGIN + TITLE_HEIGHT})">`);

  // Render all rooms
  for (const room of floor.rooms) {
    elements.push(renderRoom(room));
  }

  // Render labels on top
  for (const room of floor.rooms) {
    elements.push(renderRoomLabel(room));
  }

  elements.push('</g>');

  // Scale indicator
  elements.push(text(width - MARGIN - 80, height - 15, 'Scale: 1/4" = 1\'-0"', { fontSize: 8, textAnchor: 'start' }));

  return svgDoc(width, height, elements.join('\n'));
}
