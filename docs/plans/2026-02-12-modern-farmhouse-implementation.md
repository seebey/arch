# Modern Farmhouse Architecture Generator - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a TypeScript application that generates architectural drawings (floor plans, elevations, sections, site plan) as SVG files and exports them to PDF.

**Architecture:** Define house configuration as typed data structures. SVG rendering functions compose primitives (rect, line, text, path) into architectural drawings. Puppeteer converts SVG to PDF. CLI orchestrates generation of all deliverables.

**Tech Stack:** TypeScript, Node.js, Puppeteer (PDF generation)

---

## Task 1: Project Setup

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `src/index.ts`

**Step 1: Initialize package.json**

```bash
npm init -y
```

**Step 2: Install dependencies**

```bash
npm install puppeteer
npm install -D typescript @types/node
```

**Step 3: Create tsconfig.json**

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Step 4: Create entry point stub**

Create `src/index.ts`:

```typescript
console.log('Modern Farmhouse Architecture Generator');
```

**Step 5: Add scripts to package.json**

Update `package.json` scripts:

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsc && node dist/index.js",
    "test": "node --test dist/**/*.test.js"
  },
  "type": "module"
}
```

**Step 6: Verify build works**

Run: `npm run build && npm start`
Expected: "Modern Farmhouse Architecture Generator"

**Step 7: Commit**

```bash
git add package.json package-lock.json tsconfig.json src/index.ts
git commit -m "chore: initialize TypeScript project with Puppeteer"
```

---

## Task 2: Core Types

**Files:**
- Create: `src/core/types.ts`
- Create: `src/core/types.test.ts`

**Step 1: Write failing test for types**

Create `src/core/types.test.ts`:

```typescript
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
```

**Step 2: Run test to verify it fails**

Run: `npm run build && npm test`
Expected: FAIL - Cannot find module './types.js'

**Step 3: Implement types**

Create `src/core/types.ts`:

```typescript
export interface Point {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export type WallSide = 'top' | 'right' | 'bottom' | 'left';
export type DoorSwing = 'left' | 'right' | 'up' | 'down';

export interface Wall {
  side: WallSide;
  thickness: number;
  exterior: boolean;
}

export interface Door {
  position: Point;
  width: number;
  swing: DoorSwing;
  slidingGlass?: boolean;
}

export interface Window {
  position: Point;
  width: number;
}

export interface Room {
  name: string;
  position: Point;
  dimensions: Dimensions;
  walls: Wall[];
  doors: Door[];
  windows: Window[];
  vaulted?: boolean;
  label?: string;
}

export interface Floor {
  name: string;
  level: number;
  rooms: Room[];
}

export interface Building {
  name: string;
  floors: Floor[];
}

export interface Site {
  dimensions: Dimensions;
  buildings: Building[];
  driveway: Point[];
  walkways: { start: Point; end: Point; width: number; covered: boolean }[];
}
```

**Step 4: Run test to verify it passes**

Run: `npm run build && npm test`
Expected: PASS - all tests pass

**Step 5: Commit**

```bash
git add src/core/types.ts src/core/types.test.ts
git commit -m "feat: add core architectural types"
```

---

## Task 3: SVG Primitives

**Files:**
- Create: `src/core/svg.ts`
- Create: `src/core/svg.test.ts`

**Step 1: Write failing test for SVG primitives**

Create `src/core/svg.test.ts`:

```typescript
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { rect, line, text, path, polyline, svgDoc } from './svg.js';

describe('SVG Primitives', () => {
  it('creates a rect element', () => {
    const r = rect(10, 20, 100, 50, { fill: 'none', stroke: 'black' });
    assert.ok(r.includes('<rect'));
    assert.ok(r.includes('x="10"'));
    assert.ok(r.includes('y="20"'));
    assert.ok(r.includes('width="100"'));
    assert.ok(r.includes('height="50"'));
  });

  it('creates a line element', () => {
    const l = line(0, 0, 100, 100, { stroke: 'black', strokeWidth: 2 });
    assert.ok(l.includes('<line'));
    assert.ok(l.includes('x1="0"'));
    assert.ok(l.includes('y1="0"'));
    assert.ok(l.includes('x2="100"'));
    assert.ok(l.includes('y2="100"'));
  });

  it('creates a text element', () => {
    const t = text(50, 50, 'Living Room', { fontSize: 12 });
    assert.ok(t.includes('<text'));
    assert.ok(t.includes('Living Room'));
  });

  it('creates a path element', () => {
    const p = path('M 0 0 L 100 0 L 100 100 Z', { fill: 'none' });
    assert.ok(p.includes('<path'));
    assert.ok(p.includes('d="M 0 0 L 100 0 L 100 100 Z"'));
  });

  it('creates a polyline element', () => {
    const pl = polyline([{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }]);
    assert.ok(pl.includes('<polyline'));
    assert.ok(pl.includes('points="0,0 100,0 100,100"'));
  });

  it('wraps content in SVG document', () => {
    const doc = svgDoc(800, 600, '<rect x="0" y="0" width="100" height="100"/>');
    assert.ok(doc.includes('<svg'));
    assert.ok(doc.includes('width="800"'));
    assert.ok(doc.includes('height="600"'));
    assert.ok(doc.includes('</svg>'));
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run build && npm test`
Expected: FAIL - Cannot find module './svg.js'

**Step 3: Implement SVG primitives**

Create `src/core/svg.ts`:

```typescript
import { Point } from './types.js';

export interface StyleProps {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  fontSize?: number;
  fontFamily?: string;
  textAnchor?: 'start' | 'middle' | 'end';
}

function styleAttrs(props: StyleProps): string {
  const attrs: string[] = [];
  if (props.fill) attrs.push(`fill="${props.fill}"`);
  if (props.stroke) attrs.push(`stroke="${props.stroke}"`);
  if (props.strokeWidth) attrs.push(`stroke-width="${props.strokeWidth}"`);
  if (props.strokeDasharray) attrs.push(`stroke-dasharray="${props.strokeDasharray}"`);
  if (props.fontSize) attrs.push(`font-size="${props.fontSize}"`);
  if (props.fontFamily) attrs.push(`font-family="${props.fontFamily}"`);
  if (props.textAnchor) attrs.push(`text-anchor="${props.textAnchor}"`);
  return attrs.join(' ');
}

export function rect(
  x: number,
  y: number,
  width: number,
  height: number,
  props: StyleProps = {}
): string {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" ${styleAttrs(props)}/>`;
}

export function line(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  props: StyleProps = {}
): string {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${styleAttrs(props)}/>`;
}

export function text(
  x: number,
  y: number,
  content: string,
  props: StyleProps = {}
): string {
  return `<text x="${x}" y="${y}" ${styleAttrs(props)}>${content}</text>`;
}

export function path(d: string, props: StyleProps = {}): string {
  return `<path d="${d}" ${styleAttrs(props)}/>`;
}

export function polyline(points: Point[], props: StyleProps = {}): string {
  const pointsStr = points.map(p => `${p.x},${p.y}`).join(' ');
  return `<polyline points="${pointsStr}" ${styleAttrs(props)}/>`;
}

export function group(content: string, transform?: string): string {
  const transformAttr = transform ? ` transform="${transform}"` : '';
  return `<g${transformAttr}>${content}</g>`;
}

export function svgDoc(width: number, height: number, content: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<style>
  text { font-family: 'Helvetica Neue', Arial, sans-serif; }
</style>
${content}
</svg>`;
}
```

**Step 4: Run test to verify it passes**

Run: `npm run build && npm test`
Expected: PASS - all tests pass

**Step 5: Commit**

```bash
git add src/core/svg.ts src/core/svg.test.ts
git commit -m "feat: add SVG primitive functions"
```

---

## Task 4: Architectural Styles

**Files:**
- Create: `src/styles/architectural.ts`
- Create: `src/styles/architectural.test.ts`

**Step 1: Write failing test for architectural styles**

Create `src/styles/architectural.test.ts`:

```typescript
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { STYLES, SCALE } from './architectural.js';

describe('Architectural Styles', () => {
  it('defines wall styles', () => {
    assert.ok(STYLES.exteriorWall);
    assert.equal(STYLES.exteriorWall.strokeWidth, 3);
    assert.ok(STYLES.interiorWall);
    assert.equal(STYLES.interiorWall.strokeWidth, 2);
  });

  it('defines scale constants', () => {
    assert.equal(SCALE.pixelsPerFoot, 12);
  });

  it('has door and window styles', () => {
    assert.ok(STYLES.door);
    assert.ok(STYLES.window);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run build && npm test`
Expected: FAIL - Cannot find module './architectural.js'

**Step 3: Implement architectural styles**

Create `src/styles/architectural.ts`:

```typescript
import { StyleProps } from '../core/svg.js';

export const SCALE = {
  pixelsPerFoot: 12,
  quarterInchScale: true
} as const;

export const STYLES: Record<string, StyleProps> = {
  exteriorWall: {
    fill: 'black',
    stroke: 'black',
    strokeWidth: 3
  },
  interiorWall: {
    fill: 'black',
    stroke: 'black',
    strokeWidth: 2
  },
  door: {
    fill: 'none',
    stroke: 'black',
    strokeWidth: 1
  },
  doorSwing: {
    fill: 'none',
    stroke: 'black',
    strokeWidth: 1,
    strokeDasharray: '4,2'
  },
  window: {
    fill: 'white',
    stroke: 'black',
    strokeWidth: 1
  },
  dimension: {
    fill: 'none',
    stroke: 'black',
    strokeWidth: 0.5
  },
  dimensionText: {
    fontSize: 8,
    textAnchor: 'middle'
  },
  roomLabel: {
    fontSize: 10,
    textAnchor: 'middle'
  },
  roomDimension: {
    fontSize: 7,
    textAnchor: 'middle'
  },
  titleBlock: {
    fontSize: 14,
    textAnchor: 'start'
  },
  hidden: {
    fill: 'none',
    stroke: 'gray',
    strokeWidth: 1,
    strokeDasharray: '2,2'
  }
} as const;

export function feetToPixels(feet: number): number {
  return feet * SCALE.pixelsPerFoot;
}

export function pixelsToFeet(pixels: number): number {
  return pixels / SCALE.pixelsPerFoot;
}
```

**Step 4: Run test to verify it passes**

Run: `npm run build && npm test`
Expected: PASS - all tests pass

**Step 5: Commit**

```bash
git add src/styles/architectural.ts src/styles/architectural.test.ts
git commit -m "feat: add architectural drawing styles and scale"
```

---

## Task 5: House Configuration

**Files:**
- Create: `src/config/house.ts`
- Create: `src/config/house.test.ts`

**Step 1: Write failing test for house config**

Create `src/config/house.test.ts`:

```typescript
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
        // Check for overlap (excluding adjacent rooms that share walls)
        const aRight = a.position.x + a.dimensions.width;
        const aBottom = a.position.y + a.dimensions.height;
        const bRight = b.position.x + b.dimensions.width;
        const bBottom = b.position.y + b.dimensions.height;

        const overlapsX = a.position.x < bRight && aRight > b.position.x;
        const overlapsY = a.position.y < bBottom && aBottom > b.position.y;

        if (overlapsX && overlapsY) {
          // Allow small overlaps for shared walls (0.5' thickness)
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
```

**Step 2: Run test to verify it fails**

Run: `npm run build && npm test`
Expected: FAIL - Cannot find module './house.js'

**Step 3: Implement house configuration**

Create `src/config/house.ts`:

```typescript
import { Building, Floor, Room, Site } from '../core/types.js';

// Ground floor layout - coordinates verified against design grid
// Origin (0,0) at front-left corner, y increases toward backyard
const groundFloorRooms: Room[] = [
  {
    name: 'Foyer',
    position: { x: 0, y: 0 },
    dimensions: { width: 10, height: 12 },
    walls: [
      { side: 'top', thickness: 0.5, exterior: true },
      { side: 'left', thickness: 0.5, exterior: true }
    ],
    doors: [{ position: { x: 5, y: 0 }, width: 3, swing: 'down' }], // front door
    windows: [],
    label: 'FOYER'
  },
  {
    name: 'Living Room',
    position: { x: 10, y: 0 },
    dimensions: { width: 20, height: 22 },
    walls: [
      { side: 'top', thickness: 0.5, exterior: true },
      { side: 'right', thickness: 0.5, exterior: true }
    ],
    doors: [],
    windows: [
      { position: { x: 5, y: 0 }, width: 6 },  // front window
      { position: { x: 14, y: 0 }, width: 6 }  // front window
    ],
    vaulted: true,
    label: 'LIVING ROOM\n(vaulted)'
  },
  {
    name: 'Garage',
    position: { x: 30, y: 0 },
    dimensions: { width: 24, height: 24 },
    walls: [
      { side: 'top', thickness: 0.5, exterior: true },
      { side: 'right', thickness: 0.5, exterior: true },
      { side: 'bottom', thickness: 0.5, exterior: true }
    ],
    doors: [{ position: { x: 0, y: 12 }, width: 16, swing: 'left' }], // side-entry garage door
    windows: [],
    label: 'GARAGE\n24×24'
  },
  {
    name: 'Mud Room',
    position: { x: 0, y: 12 },
    dimensions: { width: 10, height: 10 },
    walls: [
      { side: 'left', thickness: 0.5, exterior: true }
    ],
    doors: [
      { position: { x: 0, y: 5 }, width: 3, swing: 'right' },  // side entry from driveway
      { position: { x: 10, y: 5 }, width: 3, swing: 'left' }   // to garage
    ],
    windows: [],
    label: 'MUD\nROOM'
  },
  {
    name: 'Main Bath',
    position: { x: 0, y: 22 },
    dimensions: { width: 10, height: 10 },
    walls: [
      { side: 'left', thickness: 0.5, exterior: true },
      { side: 'top', thickness: 0.5, exterior: false },
      { side: 'right', thickness: 0.5, exterior: false },
      { side: 'bottom', thickness: 0.5, exterior: false }
    ],
    doors: [{ position: { x: 10, y: 5 }, width: 2.5, swing: 'left' }],
    windows: [],
    label: 'BATH'
  },
  {
    name: 'Dining Room',
    position: { x: 10, y: 22 },
    dimensions: { width: 14, height: 14 },
    walls: [],  // open to living and kitchen
    doors: [],
    windows: [],
    label: 'DINING'
  },
  {
    name: 'Family Room',
    position: { x: 24, y: 22 },
    dimensions: { width: 14, height: 16 },
    walls: [
      { side: 'right', thickness: 0.5, exterior: true }
    ],
    doors: [{ position: { x: 7, y: 16 }, width: 8, swing: 'down', slidingGlass: true }],
    windows: [{ position: { x: 14, y: 8 }, width: 5 }],
    label: 'FAMILY\nROOM'
  },
  {
    name: 'Kitchen',
    position: { x: 0, y: 32 },
    dimensions: { width: 18, height: 18 },
    walls: [
      { side: 'left', thickness: 0.5, exterior: true },
      { side: 'bottom', thickness: 0.5, exterior: true }
    ],
    doors: [{ position: { x: 9, y: 18 }, width: 8, swing: 'down', slidingGlass: true }],
    windows: [{ position: { x: 0, y: 9 }, width: 4 }],
    label: 'KITCHEN'
  }
];

// Upper floor - sits above left portion of ground floor (NOT above vaulted living room)
// Footprint: roughly 28' x 26'
const upperFloorRooms: Room[] = [
  {
    name: 'Kids Bedroom 1',
    position: { x: 0, y: 0 },
    dimensions: { width: 12, height: 14 },
    walls: [
      { side: 'top', thickness: 0.5, exterior: true },
      { side: 'left', thickness: 0.5, exterior: true }
    ],
    doors: [{ position: { x: 12, y: 7 }, width: 2.5, swing: 'left' }],
    windows: [
      { position: { x: 0, y: 7 }, width: 4 },   // left window
      { position: { x: 6, y: 0 }, width: 4 }    // front window
    ],
    label: 'BEDROOM 1'
  },
  {
    name: 'Kids Bedroom 2',
    position: { x: 12, y: 0 },
    dimensions: { width: 12, height: 14 },
    walls: [
      { side: 'top', thickness: 0.5, exterior: true },
      { side: 'right', thickness: 0.5, exterior: true }
    ],
    doors: [{ position: { x: 0, y: 7 }, width: 2.5, swing: 'right' }],
    windows: [
      { position: { x: 12, y: 7 }, width: 4 },  // right window
      { position: { x: 6, y: 0 }, width: 4 }    // front window
    ],
    label: 'BEDROOM 2'
  },
  {
    name: 'Hallway',
    position: { x: 24, y: 0 },
    dimensions: { width: 4, height: 14 },
    walls: [
      { side: 'right', thickness: 0.5, exterior: true }
    ],
    doors: [],
    windows: [],
    label: 'HALL'
  },
  {
    name: 'Kids Bath',
    position: { x: 0, y: 14 },
    dimensions: { width: 10, height: 10 },
    walls: [
      { side: 'left', thickness: 0.5, exterior: true },
      { side: 'bottom', thickness: 0.5, exterior: true },
      { side: 'top', thickness: 0.5, exterior: false },
      { side: 'right', thickness: 0.5, exterior: false }
    ],
    doors: [{ position: { x: 10, y: 5 }, width: 2.5, swing: 'left' }],
    windows: [{ position: { x: 0, y: 5 }, width: 3 }],
    label: 'BATH'
  },
  {
    name: 'Bonus Room',
    position: { x: 10, y: 14 },
    dimensions: { width: 14, height: 12 },
    walls: [
      { side: 'right', thickness: 0.5, exterior: true },
      { side: 'bottom', thickness: 0.5, exterior: true }
    ],
    doors: [],  // open to hallway
    windows: [{ position: { x: 14, y: 6 }, width: 5 }],
    label: 'BONUS\nROOM'
  }
];

// Casita layout - origin at top-left of casita building
// Total footprint: 24' x 26'
const casitaRooms: Room[] = [
  {
    name: 'Walk-in Closet',
    position: { x: 0, y: 0 },
    dimensions: { width: 8, height: 12 },
    walls: [
      { side: 'top', thickness: 0.5, exterior: true },
      { side: 'left', thickness: 0.5, exterior: true }
    ],
    doors: [{ position: { x: 8, y: 6 }, width: 2.5, swing: 'left' }],
    windows: [],
    label: 'CLOSET'
  },
  {
    name: 'Master Bedroom',
    position: { x: 8, y: 0 },
    dimensions: { width: 16, height: 18 },
    walls: [
      { side: 'top', thickness: 0.5, exterior: true },
      { side: 'right', thickness: 0.5, exterior: true }
    ],
    doors: [{ position: { x: 0, y: 18 }, width: 3, swing: 'up' }],  // to bathroom
    windows: [
      { position: { x: 8, y: 0 }, width: 6 },   // front window
      { position: { x: 16, y: 9 }, width: 5 }   // side window
    ],
    label: 'MASTER\nBEDROOM'
  },
  {
    name: 'Master Bath',
    position: { x: 0, y: 12 },
    dimensions: { width: 12, height: 14 },
    walls: [
      { side: 'left', thickness: 0.5, exterior: true },
      { side: 'bottom', thickness: 0.5, exterior: true }
    ],
    doors: [{ position: { x: 6, y: 0 }, width: 2.5, swing: 'down' }],
    windows: [{ position: { x: 0, y: 7 }, width: 3 }],
    label: 'MASTER\nBATH'
  },
  {
    name: 'Entry Vestibule',
    position: { x: 12, y: 18 },
    dimensions: { width: 6, height: 8 },
    walls: [
      { side: 'right', thickness: 0.5, exterior: true },
      { side: 'bottom', thickness: 0.5, exterior: true }
    ],
    doors: [{ position: { x: 3, y: 8 }, width: 3, swing: 'up' }],  // entry from walkway
    windows: [],
    label: 'ENTRY'
  }
];

const groundFloor: Floor = {
  name: 'Ground Floor',
  level: 0,
  rooms: groundFloorRooms
};

const upperFloor: Floor = {
  name: 'Upper Floor',
  level: 1,
  rooms: upperFloorRooms
};

const casitaFloor: Floor = {
  name: 'Casita Floor',
  level: 0,
  rooms: casitaRooms
};

export const HOUSE: Building = {
  name: 'Main House',
  floors: [groundFloor, upperFloor]
};

export const CASITA: Building = {
  name: 'Master Casita',
  floors: [casitaFloor]
};

// Site layout: 100' wide x 150' deep lot
// Main house at front, casita at rear-left, connected by covered walkway
export const SITE: Site = {
  dimensions: { width: 100, height: 150 },
  buildings: [HOUSE, CASITA],
  // Driveway runs along left side to garage
  driveway: [
    { x: 0, y: 0 },    // front-left corner
    { x: 20, y: 0 },   // front edge
    { x: 20, y: 35 },  // extends past garage
    { x: 0, y: 35 }    // back to property edge
  ],
  // Main house position on site: front-center, ~15' setback
  // House footprint: 54' wide (including garage) x 50' deep
  // Casita position: rear-left, against side setback
  // Casita at site coords: (5, 90) - leaving 5' side setback
  walkways: [
    {
      start: { x: 5, y: 65 },   // from main house rear-left
      end: { x: 5, y: 90 },     // to casita entry (30' path)
      width: 7,
      covered: true
    }
  ]
};

// Building positions on site (for site plan rendering)
export const SITE_POSITIONS = {
  mainHouse: { x: 15, y: 15 },   // 15' front setback, 15' left setback
  casita: { x: 5, y: 95 },       // 5' side setback, rear of property
  garage: { x: 45, y: 15 }       // attached to right side of main house
};
```

**Step 4: Run test to verify it passes**

Run: `npm run build && npm test`
Expected: PASS - all tests pass

**Step 5: Commit**

```bash
git add src/config/house.ts src/config/house.test.ts
git commit -m "feat: add house, casita, and site configuration"
```

---

## Task 6: Room Renderer

**Files:**
- Create: `src/drawings/room.ts`
- Create: `src/drawings/room.test.ts`

**Step 1: Write failing test for room renderer**

Create `src/drawings/room.test.ts`:

```typescript
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
    windows: [],
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
```

**Step 2: Run test to verify it fails**

Run: `npm run build && npm test`
Expected: FAIL - Cannot find module './room.js'

**Step 3: Implement room renderer**

Create `src/drawings/room.ts`:

```typescript
import { Room } from '../core/types.js';
import { rect, line, text, path, group } from '../core/svg.js';
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

  lines.forEach((line, i) => {
    const yOffset = (i - (lines.length - 1) / 2) * 12;
    elements.push(text(x, y + yOffset, line, STYLES.roomLabel));
  });

  // Dimensions below label
  const dimText = `${room.dimensions.width}' × ${room.dimensions.height}'`;
  elements.push(text(x, y + lines.length * 6 + 10, dimText, STYLES.roomDimension));

  return elements.join('\n');
}
```

**Step 4: Run test to verify it passes**

Run: `npm run build && npm test`
Expected: PASS - all tests pass

**Step 5: Commit**

```bash
git add src/drawings/room.ts src/drawings/room.test.ts
git commit -m "feat: add room renderer with walls, doors, windows"
```

---

## Task 7: Floor Plan Generator

**Files:**
- Create: `src/drawings/floor-plan.ts`
- Create: `src/drawings/floor-plan.test.ts`

**Step 1: Write failing test for floor plan generator**

Create `src/drawings/floor-plan.test.ts`:

```typescript
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { generateFloorPlan } from './floor-plan.js';
import { HOUSE } from '../config/house.js';

describe('Floor Plan Generator', () => {
  it('generates SVG for ground floor', () => {
    const ground = HOUSE.floors.find(f => f.level === 0)!;
    const svg = generateFloorPlan(ground, 'Ground Floor - Main House');
    assert.ok(svg.includes('<svg'));
    assert.ok(svg.includes('</svg>'));
    assert.ok(svg.includes('Ground Floor'));
  });

  it('includes all rooms', () => {
    const ground = HOUSE.floors.find(f => f.level === 0)!;
    const svg = generateFloorPlan(ground, 'Ground Floor');
    assert.ok(svg.includes('LIVING ROOM'));
    assert.ok(svg.includes('KITCHEN'));
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run build && npm test`
Expected: FAIL - Cannot find module './floor-plan.js'

**Step 3: Implement floor plan generator**

Create `src/drawings/floor-plan.ts`:

```typescript
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
```

**Step 4: Run test to verify it passes**

Run: `npm run build && npm test`
Expected: PASS - all tests pass

**Step 5: Commit**

```bash
git add src/drawings/floor-plan.ts src/drawings/floor-plan.test.ts
git commit -m "feat: add floor plan generator"
```

---

## Task 8: PDF Export

**Files:**
- Create: `src/core/pdf.ts`
- Create: `src/core/pdf.test.ts`

**Step 1: Write failing test for PDF export**

Create `src/core/pdf.test.ts`:

```typescript
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { existsSync, unlinkSync } from 'node:fs';
import { svgToPdf } from './pdf.js';
import { svgDoc, rect } from './svg.js';

describe('PDF Export', () => {
  const testSvg = svgDoc(200, 200, rect(10, 10, 180, 180, { fill: 'none', stroke: 'black' }));
  const testPath = './test-output.pdf';

  it('converts SVG to PDF file', async () => {
    await svgToPdf(testSvg, testPath);
    assert.ok(existsSync(testPath));
    unlinkSync(testPath);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run build && npm test`
Expected: FAIL - Cannot find module './pdf.js'

**Step 3: Implement PDF export**

Create `src/core/pdf.ts`:

```typescript
import puppeteer from 'puppeteer';

export async function svgToPdf(svgContent: string, outputPath: string): Promise<void> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Create HTML wrapper for SVG
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; }
          svg { display: block; }
        </style>
      </head>
      <body>
        ${svgContent}
      </body>
    </html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle0' });

  // Get SVG dimensions
  const dimensions = await page.evaluate(() => {
    const svg = document.querySelector('svg');
    return {
      width: svg?.getAttribute('width') || '800',
      height: svg?.getAttribute('height') || '600'
    };
  });

  await page.pdf({
    path: outputPath,
    width: `${dimensions.width}px`,
    height: `${dimensions.height}px`,
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  await browser.close();
}
```

**Step 4: Run test to verify it passes**

Run: `npm run build && npm test`
Expected: PASS - all tests pass

**Step 5: Commit**

```bash
git add src/core/pdf.ts src/core/pdf.test.ts
git commit -m "feat: add SVG to PDF conversion with Puppeteer"
```

---

## Task 9: Elevation Generator

**Files:**
- Create: `src/drawings/elevation.ts`
- Create: `src/drawings/elevation.test.ts`

**Step 1: Write failing test for elevation generator**

Create `src/drawings/elevation.test.ts`:

```typescript
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { generateElevation } from './elevation.js';

describe('Elevation Generator', () => {
  it('generates front elevation SVG', () => {
    const svg = generateElevation('front', 'Front Elevation');
    assert.ok(svg.includes('<svg'));
    assert.ok(svg.includes('Front Elevation'));
  });

  it('generates rear elevation SVG', () => {
    const svg = generateElevation('rear', 'Rear Elevation');
    assert.ok(svg.includes('<svg'));
  });

  it('includes roof outline', () => {
    const svg = generateElevation('front', 'Front Elevation');
    assert.ok(svg.includes('<path') || svg.includes('<polyline'));
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run build && npm test`
Expected: FAIL - Cannot find module './elevation.js'

**Step 3: Implement elevation generator**

Create `src/drawings/elevation.ts`:

```typescript
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
  // Upper floor is ~28' wide over the ~54' total width
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
```

**Step 4: Run test to verify it passes**

Run: `npm run build && npm test`
Expected: PASS - all tests pass

**Step 5: Commit**

```bash
git add src/drawings/elevation.ts src/drawings/elevation.test.ts
git commit -m "feat: add elevation generator for all four sides"
```

---

## Task 10: Site Plan Generator

**Files:**
- Create: `src/drawings/site-plan.ts`
- Create: `src/drawings/site-plan.test.ts`

**Step 1: Write failing test for site plan generator**

Create `src/drawings/site-plan.test.ts`:

```typescript
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { generateSitePlan } from './site-plan.js';
import { SITE } from '../config/house.js';

describe('Site Plan Generator', () => {
  it('generates site plan SVG', () => {
    const svg = generateSitePlan(SITE, 'Site Plan');
    assert.ok(svg.includes('<svg'));
    assert.ok(svg.includes('Site Plan'));
  });

  it('includes property boundary', () => {
    const svg = generateSitePlan(SITE, 'Site Plan');
    assert.ok(svg.includes('<rect'));
  });

  it('includes buildings', () => {
    const svg = generateSitePlan(SITE, 'Site Plan');
    assert.ok(svg.includes('Main House') || svg.includes('MAIN'));
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run build && npm test`
Expected: FAIL - Cannot find module './site-plan.js'

**Step 3: Implement site plan generator**

Create `src/drawings/site-plan.ts`:

```typescript
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
```

**Step 4: Run test to verify it passes**

Run: `npm run build && npm test`
Expected: PASS - all tests pass

**Step 5: Commit**

```bash
git add src/drawings/site-plan.ts src/drawings/site-plan.test.ts
git commit -m "feat: add site plan generator"
```

---

## Task 11: Section Generator

**Files:**
- Create: `src/drawings/section.ts`
- Create: `src/drawings/section.test.ts`

**Step 1: Write failing test for section generator**

Create `src/drawings/section.test.ts`:

```typescript
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { generateSection } from './section.js';

describe('Section Generator', () => {
  it('generates section SVG', () => {
    const svg = generateSection('Section A-A');
    assert.ok(svg.includes('<svg'));
    assert.ok(svg.includes('Section A-A'));
  });

  it('shows floor levels', () => {
    const svg = generateSection('Section A-A');
    assert.ok(svg.includes('GROUND') || svg.includes('UPPER') || svg.includes('floor'));
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run build && npm test`
Expected: FAIL - Cannot find module './section.js'

**Step 3: Implement section generator**

Create `src/drawings/section.ts`:

```typescript
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
```

**Step 4: Run test to verify it passes**

Run: `npm run build && npm test`
Expected: PASS - all tests pass

**Step 5: Commit**

```bash
git add src/drawings/section.ts src/drawings/section.test.ts
git commit -m "feat: add building section generator"
```

---

## Task 12: Roof Plan Generator

**Files:**
- Create: `src/drawings/roof-plan.ts`
- Create: `src/drawings/roof-plan.test.ts`

**Step 1: Write failing test for roof plan generator**

Create `src/drawings/roof-plan.test.ts`:

```typescript
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { generateRoofPlan } from './roof-plan.js';

describe('Roof Plan Generator', () => {
  it('generates roof plan SVG', () => {
    const svg = generateRoofPlan('Roof Plan');
    assert.ok(svg.includes('<svg'));
    assert.ok(svg.includes('Roof Plan'));
  });

  it('shows roof ridges', () => {
    const svg = generateRoofPlan('Roof Plan');
    assert.ok(svg.includes('<line') || svg.includes('<path'));
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run build && npm test`
Expected: FAIL - Cannot find module './roof-plan.js'

**Step 3: Implement roof plan generator**

Create `src/drawings/roof-plan.ts`:

```typescript
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
```

**Step 4: Run test to verify it passes**

Run: `npm run build && npm test`
Expected: PASS - all tests pass

**Step 5: Commit**

```bash
git add src/drawings/roof-plan.ts src/drawings/roof-plan.test.ts
git commit -m "feat: add roof plan generator"
```

---

## Task 13: CLI Entry Point

**Files:**
- Modify: `src/index.ts`

**Step 1: Update entry point to generate all drawings**

Update `src/index.ts`:

```typescript
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
```

**Step 2: Build and run to verify all drawings generate**

Run: `npm run build && npm start`
Expected: All 10 drawings generated in output/ directory

**Step 3: Commit**

```bash
git add src/index.ts
git commit -m "feat: add CLI to generate all architectural drawings"
```

---

## Task 14: Final Verification

**Files:**
- None (verification only)

**Step 1: Run full test suite**

Run: `npm run build && npm test`
Expected: All tests pass

**Step 2: Generate all drawings**

Run: `npm start`
Expected: 10 SVG files and 10 PDF files in output/

**Step 3: Verify PDF output**

Run: `ls -la output/*.pdf`
Expected: 10 PDF files listed

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore: complete modern farmhouse architecture generator"
```

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | Project setup | package.json, tsconfig.json, src/index.ts |
| 2 | Core types | src/core/types.ts |
| 3 | SVG primitives | src/core/svg.ts |
| 4 | Architectural styles | src/styles/architectural.ts |
| 5 | House configuration | src/config/house.ts |
| 6 | Room renderer | src/drawings/room.ts |
| 7 | Floor plan generator | src/drawings/floor-plan.ts |
| 8 | PDF export | src/core/pdf.ts |
| 9 | Elevation generator | src/drawings/elevation.ts |
| 10 | Site plan generator | src/drawings/site-plan.ts |
| 11 | Section generator | src/drawings/section.ts |
| 12 | Roof plan generator | src/drawings/roof-plan.ts |
| 13 | CLI entry point | src/index.ts |
| 14 | Final verification | - |

**Total commits:** 14
**Deliverables:** 10 architectural PDFs (3 floor plans, 4 elevations, 1 section, 1 roof plan, 1 site plan)
