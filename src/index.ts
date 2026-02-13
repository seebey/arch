import { mkdirSync, writeFileSync } from 'node:fs';
import { HOUSE, CASITA, SITE } from './config/house.js';
import { generateFloorPlan } from './drawings/floor-plan.js';
import { generateElevation } from './drawings/elevation.js';
import { generateSitePlan } from './drawings/site-plan.js';
import { generateSection } from './drawings/section.js';
import { generateRoofPlan } from './drawings/roof-plan.js';
import { svgToPdf } from './core/pdf.js';

const OUTPUT_DIR = './output';

interface Drawing {
  name: string;
  generate: () => string;
}

async function main() {
  console.log('Modern Farmhouse Architecture Generator');
  console.log('=======================================\n');

  // Ensure output directory exists
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const drawings: Drawing[] = [
    // Floor plans
    {
      name: 'floor-plan-ground',
      generate: () => generateFloorPlan(HOUSE.floors[0], 'Ground Floor Plan - Main House')
    },
    {
      name: 'floor-plan-upper',
      generate: () => generateFloorPlan(HOUSE.floors[1], 'Upper Floor Plan - Main House')
    },
    {
      name: 'floor-plan-casita',
      generate: () => generateFloorPlan(CASITA.floors[0], 'Floor Plan - Master Casita')
    },
    // Elevations
    {
      name: 'elevation-front',
      generate: () => generateElevation('front', 'Front Elevation')
    },
    {
      name: 'elevation-rear',
      generate: () => generateElevation('rear', 'Rear Elevation')
    },
    {
      name: 'elevation-left',
      generate: () => generateElevation('left', 'Left Side Elevation')
    },
    {
      name: 'elevation-right',
      generate: () => generateElevation('right', 'Right Side Elevation')
    },
    // Other drawings
    {
      name: 'site-plan',
      generate: () => generateSitePlan(SITE, 'Site Plan')
    },
    {
      name: 'section-aa',
      generate: () => generateSection('Section A-A')
    },
    {
      name: 'roof-plan',
      generate: () => generateRoofPlan('Roof Plan')
    }
  ];

  for (const drawing of drawings) {
    console.log(`Generating ${drawing.name}...`);

    const svg = drawing.generate();
    const svgPath = `${OUTPUT_DIR}/${drawing.name}.svg`;
    const pdfPath = `${OUTPUT_DIR}/${drawing.name}.pdf`;

    // Save SVG
    writeFileSync(svgPath, svg);
    console.log(`  ✓ Saved ${svgPath}`);

    // Convert to PDF
    await svgToPdf(svg, pdfPath);
    console.log(`  ✓ Saved ${pdfPath}`);
  }

  console.log('\n=======================================');
  console.log(`Done! Generated ${drawings.length} drawings in ${OUTPUT_DIR}/`);
}

main().catch(console.error);
