import { svgDoc, rect, line, text, polyline } from '../core/svg.js';
import { STYLES, feetToPixels } from '../styles/architectural.js';

const MARGIN = 50;
const TITLE_HEIGHT = 40;

export function generateRoofPlan(title: string): string {
  const HOUSE_WIDTH = 52; // with overhangs
  const HOUSE_DEPTH = 54;

  const contentWidth = feetToPixels(HOUSE_WIDTH);
  const contentHeight = feetToPixels(HOUSE_DEPTH);
  const svgWidth = contentWidth + MARGIN * 2;
  const svgHeight = contentHeight + MARGIN * 2 + TITLE_HEIGHT;

  const elements: string[] = [];

  // Background
  elements.push(rect(0, 0, svgWidth, svgHeight, { fill: 'white' }));

  // Title
  elements.push(text(MARGIN, 30, title, STYLES.titleBlock));
  elements.push(line(MARGIN, TITLE_HEIGHT, svgWidth - MARGIN, TITLE_HEIGHT, { stroke: 'black', strokeWidth: 1 }));

  const baseX = MARGIN;
  const baseY = MARGIN + TITLE_HEIGHT;

  // Main roof outline
  elements.push(rect(baseX, baseY, contentWidth, contentHeight, {
    fill: '#f0f0f0',
    stroke: 'black',
    strokeWidth: 2
  }));

  // Main ridge (running east-west)
  const ridgeY = baseY + contentHeight / 2;
  elements.push(line(baseX, ridgeY, baseX + contentWidth, ridgeY, {
    stroke: 'black',
    strokeWidth: 2
  }));

  // Cross gable ridge (for upper floor section)
  const crossRidgeX = baseX + feetToPixels(36);
  const crossRidgeTop = baseY + feetToPixels(10);
  const crossRidgeBottom = baseY + feetToPixels(30);
  elements.push(line(crossRidgeX, crossRidgeTop, crossRidgeX, crossRidgeBottom, {
    stroke: 'black',
    strokeWidth: 2
  }));

  // Hip lines
  elements.push(line(baseX, baseY, baseX + feetToPixels(20), ridgeY, { stroke: 'black', strokeWidth: 1 }));
  elements.push(line(baseX, baseY + contentHeight, baseX + feetToPixels(20), ridgeY, { stroke: 'black', strokeWidth: 1 }));
  elements.push(line(baseX + contentWidth, baseY, baseX + contentWidth - feetToPixels(20), ridgeY, { stroke: 'black', strokeWidth: 1 }));
  elements.push(line(baseX + contentWidth, baseY + contentHeight, baseX + contentWidth - feetToPixels(20), ridgeY, { stroke: 'black', strokeWidth: 1 }));

  // Slope arrows
  const arrowY1 = baseY + feetToPixels(15);
  const arrowY2 = baseY + contentHeight - feetToPixels(15);
  elements.push(line(baseX + feetToPixels(26), arrowY1, baseX + feetToPixels(26), arrowY1 - feetToPixels(8), { stroke: 'black', strokeWidth: 1 }));
  elements.push(text(baseX + feetToPixels(28), arrowY1 - feetToPixels(4), '8:12', { fontSize: 8, textAnchor: 'start' }));

  elements.push(line(baseX + feetToPixels(26), arrowY2, baseX + feetToPixels(26), arrowY2 + feetToPixels(8), { stroke: 'black', strokeWidth: 1 }));
  elements.push(text(baseX + feetToPixels(28), arrowY2 + feetToPixels(4), '8:12', { fontSize: 8, textAnchor: 'start' }));

  // Roof material indication
  elements.push(text(baseX + contentWidth / 2, baseY + contentHeight / 2 - 20, 'STANDING SEAM', { fontSize: 10, textAnchor: 'middle' }));
  elements.push(text(baseX + contentWidth / 2, baseY + contentHeight / 2, 'METAL ROOF', { fontSize: 10, textAnchor: 'middle' }));
  elements.push(text(baseX + contentWidth / 2, baseY + contentHeight / 2 + 15, '(CHARCOAL)', { fontSize: 8, textAnchor: 'middle' }));

  // Chimney
  const chimX = baseX + feetToPixels(40);
  const chimY = baseY + feetToPixels(25);
  elements.push(rect(chimX, chimY, feetToPixels(3), feetToPixels(4), {
    fill: '#999',
    stroke: 'black',
    strokeWidth: 1
  }));
  elements.push(text(chimX + feetToPixels(1.5), chimY + feetToPixels(2), 'CH', { fontSize: 6, textAnchor: 'middle' }));

  // North arrow
  const arrowX = svgWidth - MARGIN - 30;
  const arrowYPos = MARGIN + TITLE_HEIGHT + 40;
  elements.push(line(arrowX, arrowYPos + 20, arrowX, arrowYPos, { stroke: 'black', strokeWidth: 2 }));
  elements.push(text(arrowX, arrowYPos - 5, 'N', { fontSize: 12, textAnchor: 'middle' }));

  // Scale
  elements.push(text(svgWidth - MARGIN - 80, svgHeight - 15, 'Scale: 1/4" = 1\'-0"', { fontSize: 8, textAnchor: 'start' }));

  return svgDoc(svgWidth, svgHeight, elements.join('\n'));
}
