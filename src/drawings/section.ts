import { svgDoc, rect, line, text, polyline, path } from '../core/svg.js';
import { STYLES, feetToPixels } from '../styles/architectural.js';

const MARGIN = 50;
const TITLE_HEIGHT = 40;

export function generateSection(title: string): string {
  const HOUSE_WIDTH = 48;
  const GROUND_HEIGHT = 10;
  const UPPER_HEIGHT = 9;
  const VAULTED_HEIGHT = 14;

  const contentWidth = feetToPixels(HOUSE_WIDTH + 10);
  const contentHeight = feetToPixels(GROUND_HEIGHT + VAULTED_HEIGHT + 10);
  const svgWidth = contentWidth + MARGIN * 2;
  const svgHeight = contentHeight + MARGIN * 2 + TITLE_HEIGHT;

  const elements: string[] = [];

  // Background
  elements.push(rect(0, 0, svgWidth, svgHeight, { fill: 'white' }));

  // Title
  elements.push(text(MARGIN, 30, title, STYLES.titleBlock));
  elements.push(line(MARGIN, TITLE_HEIGHT, svgWidth - MARGIN, TITLE_HEIGHT, { stroke: 'black', strokeWidth: 1 }));

  const baseX = MARGIN + feetToPixels(5);
  const groundY = svgHeight - MARGIN - feetToPixels(2);

  // Ground line
  elements.push(line(MARGIN, groundY, svgWidth - MARGIN, groundY, { stroke: 'black', strokeWidth: 2 }));

  // Foundation
  elements.push(rect(baseX, groundY, feetToPixels(HOUSE_WIDTH), feetToPixels(1), {
    fill: '#888',
    stroke: 'black',
    strokeWidth: 1
  }));

  // Ground floor walls
  const gfTop = groundY - feetToPixels(GROUND_HEIGHT);
  elements.push(line(baseX, groundY, baseX, gfTop, { stroke: 'black', strokeWidth: 3 }));
  elements.push(line(baseX + feetToPixels(HOUSE_WIDTH), groundY, baseX + feetToPixels(HOUSE_WIDTH), gfTop, { stroke: 'black', strokeWidth: 3 }));

  // Ground floor ceiling / upper floor floor
  elements.push(line(baseX, gfTop, baseX + feetToPixels(HOUSE_WIDTH), gfTop, { stroke: 'black', strokeWidth: 2 }));

  // Floor hatching
  elements.push(rect(baseX, gfTop - feetToPixels(1), feetToPixels(HOUSE_WIDTH), feetToPixels(1), {
    fill: '#ddd',
    stroke: 'black',
    strokeWidth: 1
  }));

  // Upper floor area (partial)
  const upperWidth = feetToPixels(26);
  const upperX = baseX + feetToPixels(22);
  const ufTop = gfTop - feetToPixels(UPPER_HEIGHT);
  elements.push(line(upperX, gfTop - feetToPixels(1), upperX, ufTop, { stroke: 'black', strokeWidth: 2 }));
  elements.push(line(upperX + upperWidth, gfTop - feetToPixels(1), upperX + upperWidth, ufTop, { stroke: 'black', strokeWidth: 2 }));
  elements.push(line(upperX, ufTop, upperX + upperWidth, ufTop, { stroke: 'black', strokeWidth: 2 }));

  // Vaulted ceiling in living room
  const vaultPeak = gfTop - feetToPixels(VAULTED_HEIGHT);
  const vaultLeft = baseX + feetToPixels(30);
  const vaultRight = baseX + feetToPixels(HOUSE_WIDTH);
  elements.push(line(vaultLeft, gfTop, vaultLeft, gfTop - feetToPixels(4), { stroke: 'black', strokeWidth: 2 }));

  // Vaulted roof line
  const vaultPoints = [
    { x: vaultLeft, y: gfTop - feetToPixels(4) },
    { x: (vaultLeft + vaultRight) / 2, y: vaultPeak },
    { x: vaultRight, y: gfTop - feetToPixels(4) }
  ];
  elements.push(polyline(vaultPoints, { fill: 'none', stroke: 'black', strokeWidth: 2 }));

  // Main roof
  const roofPeak = gfTop - feetToPixels(VAULTED_HEIGHT + 2);
  const roofPoints = [
    { x: baseX - feetToPixels(2), y: gfTop },
    { x: baseX + feetToPixels(HOUSE_WIDTH / 2), y: roofPeak },
    { x: baseX + feetToPixels(HOUSE_WIDTH) + feetToPixels(2), y: gfTop }
  ];
  elements.push(polyline(roofPoints, { fill: 'none', stroke: 'black', strokeWidth: 2 }));

  // Labels
  elements.push(text(baseX - 30, groundY - feetToPixels(GROUND_HEIGHT / 2), 'GROUND\nFLOOR', { fontSize: 8, textAnchor: 'end' }));
  elements.push(text(upperX - 10, ufTop + feetToPixels(UPPER_HEIGHT / 2), 'UPPER\nFLOOR', { fontSize: 8, textAnchor: 'end' }));
  elements.push(text(vaultLeft + feetToPixels(8), gfTop - feetToPixels(8), 'VAULTED\nLIVING', { fontSize: 8, textAnchor: 'middle' }));

  // Dimension - ground floor height
  const dimX = baseX + feetToPixels(HOUSE_WIDTH) + 20;
  elements.push(line(dimX, groundY, dimX, gfTop, STYLES.dimension));
  elements.push(line(dimX - 5, groundY, dimX + 5, groundY, STYLES.dimension));
  elements.push(line(dimX - 5, gfTop, dimX + 5, gfTop, STYLES.dimension));
  elements.push(text(dimX + 15, groundY - feetToPixels(GROUND_HEIGHT / 2), "10'-0\"", { fontSize: 7, textAnchor: 'start' }));

  // Scale
  elements.push(text(svgWidth - MARGIN - 80, svgHeight - 15, 'Scale: 1/4" = 1\'-0"', { fontSize: 8, textAnchor: 'start' }));

  return svgDoc(svgWidth, svgHeight, elements.join('\n'));
}
