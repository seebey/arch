import { svgDoc, rect, line, text, polyline } from '../core/svg.js';
import { STYLES, feetToPixels } from '../styles/architectural.js';
import { HOUSE } from '../config/house.js';

type ElevationSide = 'front' | 'rear' | 'left' | 'right';

const MARGIN = 50;
const TITLE_HEIGHT = 40;

// Derive dimensions from house config
function getHouseDimensions() {
  const groundFloor = HOUSE.floors.find(f => f.level === 0)!;
  let maxX = 0, maxY = 0;
  for (const room of groundFloor.rooms) {
    const right = room.position.x + room.dimensions.width;
    const bottom = room.position.y + room.dimensions.height;
    if (right > maxX) maxX = right;
    if (bottom > maxY) maxY = bottom;
  }
  return { width: maxX, depth: maxY };
}

// Heights are architectural constants
const GROUND_FLOOR_HEIGHT = 10;  // feet
const UPPER_FLOOR_HEIGHT = 9;    // feet
const ROOF_PITCH = 8 / 12;       // 8:12 pitch

export function generateElevation(side: ElevationSide, title: string): string {
  const houseDims = getHouseDimensions();
  const houseWidth = houseDims.width;  // front/rear view width
  const houseDepth = houseDims.depth;  // left/right view width

  const viewWidth = side === 'front' || side === 'rear' ? houseWidth : houseDepth;
  const totalHeight = GROUND_FLOOR_HEIGHT + UPPER_FLOOR_HEIGHT + (viewWidth / 2) * ROOF_PITCH * 0.5;

  const contentWidth = feetToPixels(viewWidth);
  const contentHeight = feetToPixels(totalHeight);
  const svgWidth = contentWidth + MARGIN * 2;
  const svgHeight = contentHeight + MARGIN * 2 + TITLE_HEIGHT + 50;

  const elements: string[] = [];

  // Background
  elements.push(rect(0, 0, svgWidth, svgHeight, { fill: 'white' }));

  // Title
  elements.push(text(MARGIN, 30, title, STYLES.titleBlock));
  elements.push(line(MARGIN, TITLE_HEIGHT, svgWidth - MARGIN, TITLE_HEIGHT, { stroke: 'black', strokeWidth: 1 }));

  // Ground line
  const groundY = MARGIN + TITLE_HEIGHT + contentHeight + 30;
  elements.push(line(MARGIN - 20, groundY, svgWidth - MARGIN + 20, groundY, { stroke: 'black', strokeWidth: 2 }));

  const bx = MARGIN;
  const gfHeight = feetToPixels(GROUND_FLOOR_HEIGHT);
  const ufHeight = feetToPixels(UPPER_FLOOR_HEIGHT);

  // Ground floor outline
  elements.push(rect(bx, groundY - gfHeight, contentWidth, gfHeight, {
    fill: 'none',
    stroke: 'black',
    strokeWidth: 2
  }));

  // Upper floor (partial - 1.5 story, centered)
  const upperWidth = feetToPixels(28);
  const upperX = bx + (contentWidth - upperWidth) / 2;
  const upperY = groundY - gfHeight - ufHeight;
  elements.push(rect(upperX, upperY, upperWidth, ufHeight, {
    fill: 'none',
    stroke: 'black',
    strokeWidth: 2
  }));

  // Main roof - gable over full width
  const mainRoofPeak = upperY - feetToPixels(8);
  const mainRoofPoints = [
    { x: bx - 10, y: groundY - gfHeight },
    { x: bx + contentWidth / 2, y: mainRoofPeak },
    { x: bx + contentWidth + 10, y: groundY - gfHeight }
  ];
  elements.push(polyline(mainRoofPoints, { fill: 'none', stroke: 'black', strokeWidth: 2 }));

  // Upper floor cross-gable roof
  const upperRoofPeak = upperY - feetToPixels(6);
  const upperRoofPoints = [
    { x: upperX - 5, y: upperY },
    { x: upperX + upperWidth / 2, y: upperRoofPeak },
    { x: upperX + upperWidth + 5, y: upperY }
  ];
  elements.push(polyline(upperRoofPoints, { fill: 'none', stroke: 'black', strokeWidth: 2 }));

  // Windows - ground floor (evenly spaced)
  const windowY = groundY - feetToPixels(6);
  const windowH = feetToPixels(4);
  const windowW = feetToPixels(3);
  const numWindows = Math.floor(viewWidth / 12);
  const windowSpacing = contentWidth / (numWindows + 1);

  for (let i = 1; i <= numWindows; i++) {
    const wx = bx + windowSpacing * i - windowW / 2;
    elements.push(rect(wx, windowY, windowW, windowH, STYLES.window));
    // Farmhouse window grid
    elements.push(line(wx + windowW / 2, windowY, wx + windowW / 2, windowY + windowH, { stroke: 'black', strokeWidth: 0.5 }));
    elements.push(line(wx, windowY + windowH / 2, wx + windowW, windowY + windowH / 2, { stroke: 'black', strokeWidth: 0.5 }));
  }

  // Upper floor windows
  const ufWindowY = upperY + feetToPixels(2);
  for (let i = 0; i < 2; i++) {
    const wx = upperX + feetToPixels(4) + i * feetToPixels(16);
    elements.push(rect(wx, ufWindowY, windowW, windowH, STYLES.window));
    elements.push(line(wx + windowW / 2, ufWindowY, wx + windowW / 2, ufWindowY + windowH, { stroke: 'black', strokeWidth: 0.5 }));
    elements.push(line(wx, ufWindowY + windowH / 2, wx + windowW, ufWindowY + windowH / 2, { stroke: 'black', strokeWidth: 0.5 }));
  }

  // Front door (front elevation only)
  if (side === 'front') {
    const doorX = bx + feetToPixels(5) - feetToPixels(1.5);  // near foyer position
    const doorH = feetToPixels(7);
    elements.push(rect(doorX, groundY - doorH, feetToPixels(3), doorH, { fill: '#8B4513', stroke: 'black', strokeWidth: 1 }));
  }

  // Garage door (front elevation - right side)
  if (side === 'front') {
    const garageX = bx + feetToPixels(35);  // garage position
    const garageH = feetToPixels(8);
    const garageW = feetToPixels(16);
    elements.push(rect(garageX, groundY - garageH, garageW, garageH, { fill: '#d4a76a', stroke: 'black', strokeWidth: 1 }));
    // Carriage door lines
    elements.push(line(garageX + garageW / 2, groundY - garageH, garageX + garageW / 2, groundY, { stroke: 'black', strokeWidth: 1 }));
  }

  // Siding indication (horizontal lap lines)
  for (let sy = groundY - feetToPixels(1); sy > upperY; sy -= feetToPixels(0.8)) {
    elements.push(line(bx + 2, sy, bx + contentWidth - 2, sy, { stroke: '#ddd', strokeWidth: 0.3 }));
  }

  // Stone wainscot at base
  elements.push(rect(bx, groundY - feetToPixels(2), contentWidth, feetToPixels(2), {
    fill: 'none',
    stroke: 'black',
    strokeWidth: 1,
    strokeDasharray: '2,1'
  }));

  // Scale notation
  elements.push(text(svgWidth - MARGIN - 80, svgHeight - 15, 'Scale: 1/4" = 1\'-0"', { fontSize: 8, textAnchor: 'start' }));

  return svgDoc(svgWidth, svgHeight, elements.join('\n'));
}
