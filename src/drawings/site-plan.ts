import { Site } from '../core/types.js';
import { svgDoc, rect, line, text, polyline } from '../core/svg.js';
import { STYLES } from '../styles/architectural.js';
import { SITE_POSITIONS } from '../config/house.js';

const MARGIN = 50;
const TITLE_HEIGHT = 40;
const SITE_SCALE = 6; // pixels per foot for site plan (smaller scale)

function siteFeet(feet: number): number {
  return feet * SITE_SCALE;
}

export function generateSitePlan(site: Site, title: string): string {
  const contentWidth = siteFeet(site.dimensions.width);
  const contentHeight = siteFeet(site.dimensions.height);
  const svgWidth = contentWidth + MARGIN * 2;
  const svgHeight = contentHeight + MARGIN * 2 + TITLE_HEIGHT;

  const elements: string[] = [];

  // Background
  elements.push(rect(0, 0, svgWidth, svgHeight, { fill: 'white' }));

  // Title
  elements.push(text(MARGIN, 30, title, STYLES.titleBlock));
  elements.push(line(MARGIN, TITLE_HEIGHT, svgWidth - MARGIN, TITLE_HEIGHT, { stroke: 'black', strokeWidth: 1 }));

  // Property boundary
  elements.push(rect(MARGIN, MARGIN + TITLE_HEIGHT, contentWidth, contentHeight, {
    fill: '#f5f5f0',
    stroke: 'black',
    strokeWidth: 2
  }));

  // Street label
  elements.push(text(MARGIN + contentWidth / 2, MARGIN + TITLE_HEIGHT - 10, 'STREET', {
    fontSize: 10,
    textAnchor: 'middle'
  }));

  // Driveway - use config data
  if (site.driveway.length >= 4) {
    const dw = site.driveway;
    const driveX = MARGIN + siteFeet(dw[0].x);
    const driveY = MARGIN + TITLE_HEIGHT + siteFeet(dw[0].y);
    const driveW = siteFeet(dw[1].x - dw[0].x);
    const driveH = siteFeet(dw[2].y - dw[0].y);
    elements.push(rect(driveX, driveY, driveW, driveH, {
      fill: '#ccc',
      stroke: 'black',
      strokeWidth: 1
    }));
    elements.push(text(driveX + driveW / 2, driveY + driveH / 2, 'DRIVEWAY', {
      fontSize: 8,
      textAnchor: 'middle'
    }));
  }

  // Main house footprint - use SITE_POSITIONS config
  const houseX = MARGIN + siteFeet(SITE_POSITIONS.mainHouse.x);
  const houseY = MARGIN + TITLE_HEIGHT + siteFeet(SITE_POSITIONS.mainHouse.y);
  const houseW = siteFeet(38);  // main house width (excluding garage)
  const houseH = siteFeet(50);  // main house depth
  elements.push(rect(houseX, houseY, houseW, houseH, {
    fill: '#e8e8e8',
    stroke: 'black',
    strokeWidth: 2
  }));
  elements.push(text(houseX + houseW / 2, houseY + houseH / 2 - 10, 'MAIN HOUSE', {
    fontSize: 10,
    textAnchor: 'middle'
  }));
  elements.push(text(houseX + houseW / 2, houseY + houseH / 2 + 5, '(1.5 story)', {
    fontSize: 8,
    textAnchor: 'middle'
  }));

  // Garage - attached to right side of main house
  const garageX = houseX + houseW;
  const garageY = houseY;
  const garageW = siteFeet(24);
  const garageH = siteFeet(24);
  elements.push(rect(garageX, garageY, garageW, garageH, {
    fill: '#ddd',
    stroke: 'black',
    strokeWidth: 1
  }));
  elements.push(text(garageX + garageW / 2, garageY + garageH / 2, 'GARAGE', {
    fontSize: 7,
    textAnchor: 'middle'
  }));

  // Covered walkway - use config data
  for (const walkway of site.walkways) {
    const wx = MARGIN + siteFeet(walkway.start.x);
    const wy = MARGIN + TITLE_HEIGHT + siteFeet(walkway.start.y);
    const ww = siteFeet(walkway.width);
    const wh = siteFeet(walkway.end.y - walkway.start.y);
    elements.push(rect(wx, wy, ww, wh, {
      fill: walkway.covered ? '#d4c4a8' : '#ccc',
      stroke: 'black',
      strokeWidth: 1
    }));
    elements.push(text(wx + ww / 2, wy + wh / 2, 'COVERED\nWALKWAY', {
      fontSize: 6,
      textAnchor: 'middle'
    }));
  }

  // Casita - use SITE_POSITIONS config
  const casitaX = MARGIN + siteFeet(SITE_POSITIONS.casita.x);
  const casitaY = MARGIN + TITLE_HEIGHT + siteFeet(SITE_POSITIONS.casita.y);
  const casitaW = siteFeet(24);  // casita width
  const casitaH = siteFeet(26);  // casita depth
  elements.push(rect(casitaX, casitaY, casitaW, casitaH, {
    fill: '#e8e8e8',
    stroke: 'black',
    strokeWidth: 2
  }));
  elements.push(text(casitaX + casitaW / 2, casitaY + casitaH / 2, 'MASTER\nCASITA', {
    fontSize: 8,
    textAnchor: 'middle'
  }));

  // Private garden - strip between casita and side fence
  if (SITE_POSITIONS.casita.x > 0) {
    elements.push(rect(MARGIN, casitaY, siteFeet(SITE_POSITIONS.casita.x), casitaH, {
      fill: '#90EE90',
      stroke: 'green',
      strokeWidth: 1
    }));
    elements.push(text(MARGIN + siteFeet(SITE_POSITIONS.casita.x / 2), casitaY + casitaH / 2, 'GARDEN', {
      fontSize: 6,
      textAnchor: 'middle'
    }));
  }

  // Backyard label
  const backyardX = houseX + houseW / 2 + siteFeet(15);
  const backyardY = houseY + houseH + siteFeet(20);
  elements.push(text(backyardX, backyardY, 'BACKYARD', {
    fontSize: 12,
    textAnchor: 'middle'
  }));

  // Patio - behind main house
  const patioX = houseX + siteFeet(5);
  const patioY = houseY + houseH;
  elements.push(rect(patioX, patioY, siteFeet(28), siteFeet(15), {
    fill: '#ddd',
    stroke: 'black',
    strokeWidth: 1,
    strokeDasharray: '2,2'
  }));
  elements.push(text(patioX + siteFeet(14), patioY + siteFeet(8), 'PATIO', {
    fontSize: 8,
    textAnchor: 'middle'
  }));

  // North arrow
  const arrowX = svgWidth - MARGIN - 30;
  const arrowY = MARGIN + TITLE_HEIGHT + 40;
  elements.push(line(arrowX, arrowY + 20, arrowX, arrowY, { stroke: 'black', strokeWidth: 2 }));
  elements.push(text(arrowX, arrowY - 5, 'N', { fontSize: 12, textAnchor: 'middle' }));

  // Scale
  elements.push(text(svgWidth - MARGIN - 80, svgHeight - 15, 'Scale: 1" = 16\'-0"', { fontSize: 8, textAnchor: 'start' }));

  return svgDoc(svgWidth, svgHeight, elements.join('\n'));
}
