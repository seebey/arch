# Modern Farmhouse Residential Design

## Overview

A rustic modern farmhouse residential design featuring a 1.5-story main house with a detached master casita, optimized for Bay Area, California climate. The project generates architectural drawings (floor plans, elevations, sections, site plan) as code-generated SVG/PDF files.

**Purpose:** Portfolio piece, conceptual design, and personal dream home exploration.

## House Specifications

| Attribute | Value |
|-----------|-------|
| Style | Rustic Modern Farmhouse |
| Total Size | ~3,000 sq ft |
| Main House | ~2,400 sq ft (1.5 stories) |
| Master Casita | ~600 sq ft (detached) |
| Climate | Bay Area, California (Mediterranean) |
| Bedrooms | 3 (2 kids + 1 master) |
| Bathrooms | 3 (main, kids, master) |

## Site Plan

```
                        STREET / FRONT
    +-----------------------------------------------------+
    |                   DRIVEWAY                           |
    |                      |                               |
    |    +-----------------+------+                       |
    |    |       2-CAR GARAGE     |                       |
    |    |        (side entry)    |                       |
    |    +------------+------------+                       |
    |                 |                                    |
    |    +------------+-------------------+               |
    |    |                                 |               |
    |    |         MAIN HOUSE              |               |
    |    |         (1.5 story)             |               |
    |    |                                 |               |
    |    |    Kitchen/Living face backyard |               |
    |    |                                 |               |
    |    +--+------------------------------+               |
    |       |                                              |
    |       | COVERED          MAIN BACKYARD              |
    |       | WALKWAY          (large open lawn,          |
    |       | (straight)        patio, outdoor            |
    |       |                   dining)                   |
    |       |                                              |
    |    +--+---------------------+                       |
    |    |   MASTER CASITA        |                       |
    |    |                        |-- PRIVATE GARDEN      |
    |    +------------------------+                       |
    |    ^                                                |
    |    | SIDE SETBACK (property edge)                   |
    +-----------------------------------------------------+
```

### Site Layout

- **Casita position:** Left side of lot against property edge
- **Walkway:** Straight path from main house side to casita (~30'), covered
- **Main backyard:** Full open space on the right side
- **Private garden:** Narrow strip between casita and side fence

## Room Program

### Main House - Ground Floor (~1,500 sq ft living + garage)

```
Floor Plan Grid (1 unit = 2 feet):

     0         10        20        30        40        50   54
  0  +---------+---------+---------+---------+---------+----+
     |         |                             |              |
     |  FOYER  |        LIVING ROOM          |    GARAGE    |
     |  10x12  |          20x22              |    24x24     |
     |         |        (vaulted)            |  (side-entry)|
 12  +---------+                             |              |
     |         |                             |              |
     | MUD RM  |                             +--------------+
     |  10x10  |                             |
 22  +---------+-----------------------------+
     |         |              |              |
     |  BATH   |    DINING    |    FAMILY    |
     |  10x10  |    14x14     |    14x16     |
     |         |              |              |
 32  +---------+--------------+              |
     |                        |              |
     |       KITCHEN          |              |
     |        18x18           +--------------+
     |                        |
 50  +---------+--------------+
            BACKYARD (sliding glass doors)
```

| Room | Position | Dimensions | Sq Ft | Notes |
|------|----------|------------|-------|-------|
| Foyer/Entry | (0, 0) | 10' x 12' | 120 | Front door faces street |
| Living Room | (10, 0) | 20' x 22' | 440 | Vaulted ceiling, fireplace, rear windows |
| Mud Room | (0, 12) | 10' x 10' | 100 | Side entry from driveway, connects to garage |
| Main Bathroom | (0, 22) | 10' x 10' | 100 | Full bath, hallway access |
| Dining Room | (10, 22) | 14' x 14' | 196 | Casual, opens to kitchen/living |
| Family Room | (24, 22) | 14' x 16' | 224 | TV area, sliding doors to patio |
| Kitchen | (0, 32) | 18' x 18' | 324 | Island, sliding doors to backyard |
| Garage | (30, 0) | 24' x 24' | 576 | Side-entry, attached right side |
| **Ground Floor Total** | | | **~1,500** | (excluding garage) |

### Main House - Upper Floor (~640 sq ft)

Upper floor sits above the left/center portion of ground floor (above foyer, mud room, bath area - NOT above vaulted living room).

```
Upper Floor Grid:

     0         12        24        28
  0  +---------+---------+---------+
     |   KIDS  |   KIDS  |         |
     | BEDROOM | BEDROOM |  HALL/  |
     |    1    |    2    | LANDING |
     |  12x14  |  12x14  |  4x14   |
 14  +---------+---------+---------+
     |         |                   |
     |  BATH   |    BONUS ROOM     |
     |  10x10  |      14x12        |
     |         |                   |
 26  +---------+-------------------+
              (open to living below)
```

| Room | Position | Dimensions | Sq Ft | Notes |
|------|----------|------------|-------|-------|
| Kids Bedroom 1 | (0, 0) | 12' x 14' | 168 | Front-left, closet included |
| Kids Bedroom 2 | (12, 0) | 12' x 14' | 168 | Front-right, closet included |
| Hallway/Landing | (24, 0) | 4' x 14' | 56 | Stairs, open to living below |
| Kids Bathroom | (0, 14) | 10' x 10' | 100 | Shared hall bath |
| Bonus Room | (10, 14) | 14' x 12' | 168 | Play area, study nook |
| **Upper Floor Total** | | | **~660** | |

### Master Casita (~600 sq ft)

Detached structure at left rear of property, connected via covered walkway.

```
Casita Floor Plan:

     0    8         24
  0  +----+---------+
     | CL |         |
     |OST | MASTER  |
     | 8  | BEDROOM |
     | x  |  16x18  |
     | 12 |         |
 12  +----+         |
     |    |         |
     |BATH+---------+
     |12  | ENTRY   |
     |x14 |   6x8   |
 26  +----+---------+
      (walkway connects here)
```

| Room | Position | Dimensions | Sq Ft | Notes |
|------|----------|------------|-------|-------|
| Walk-in Closet | (0, 0) | 8' x 12' | 96 | Attached to bedroom |
| Master Bedroom | (8, 0) | 16' x 18' | 288 | King bed, sitting area, windows both sides |
| Master Bathroom | (0, 12) | 12' x 14' | 168 | Double vanity, walk-in shower, soaking tub |
| Entry Vestibule | (12, 18) | 6' x 8' | 48 | Transition from covered walkway |
| **Casita Total** | | | **600** | |

### Covered Walkway (~210 sq ft)

- **Length:** 30 feet (straight path from main house to casita)
- **Width:** 7 feet
- **Roof:** Extended gable with solid roof (rain protection)
- **Connection:** Main house rear (x=0, y=50) to casita entry (x=12, y=26)
- **Features:** Slight elevation changes with steps, integrated planters

## Entry Points

| Entry | Location | Access |
|-------|----------|--------|
| Front door | Front porch, street-facing | Main formal entry into foyer |
| Side entry | Through mud room from driveway | Casual entry without going to front |
| Sliding glass doors | Rear of family room/dining/kitchen | Opens to backyard patio |
| Casita entry | Via covered walkway from main house | Private access to master suite |

## Architectural Style

### Exterior Materials

| Element | Material | Notes |
|---------|----------|-------|
| Primary siding | Reclaimed wood / weathered cedar | Horizontal lap or board-and-batten, natural gray-brown tones |
| Accent walls | Natural stone veneer | Stacked ledgestone, warm grays/tans, entry + chimney |
| Trim & fascia | Dark bronze / black metal | Clean contrast against wood |
| Roof | Standing seam metal | Dark charcoal or weathered bronze |
| Windows | Black aluminum-clad wood | Large panes, farmhouse grid on select windows |
| Garage doors | Wood-look carriage style | Stained to match siding |
| Covered walkway | Exposed wood beams + metal roof | Matches main house, visible rafter tails |

### Architectural Features

| Feature | Description |
|---------|-------------|
| Roofline | Primary gable with cross-gable accents, 8:12 pitch |
| Front porch | Partial-width covered entry, wood posts with stone base |
| Rear patio | Covered outdoor living extending from kitchen/living |
| Windows | Oversized on rear elevation, clerestory in vaulted living room |
| Chimney | Stone-clad, exterior expression on side elevation |
| Casita | Miniature echo of main house - same materials, simplified gable |

### Color Scheme

| Element | Color |
|---------|-------|
| Wood siding | Natural weathered gray-brown |
| Stone | Warm tan/gray blend |
| Metal accents | Matte black or dark bronze |
| Roof | Charcoal |
| Window frames | Black |

## Technical Implementation

### Approach

TypeScript + SVG generation with PDF export via Puppeteer. All architectural data defined in code, rendered programmatically.

### Project Structure

```
arch/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts                 # CLI entry point
│   ├── config/
│   │   └── house.ts             # All dimensions, room definitions
│   ├── core/
│   │   ├── types.ts             # Room, Wall, Door, Window types
│   │   ├── svg.ts               # SVG primitives (rect, line, text, path)
│   │   └── pdf.ts               # SVG -> PDF conversion
│   ├── drawings/
│   │   ├── floor-plan.ts        # Floor plan generator
│   │   ├── elevation.ts         # Elevation generator
│   │   ├── section.ts           # Section cut generator
│   │   ├── roof-plan.ts         # Roof plan generator
│   │   └── site-plan.ts         # Site plan generator
│   └── styles/
│       └── architectural.ts     # Line weights, hatching, fonts
└── output/
    └── [generated PDFs]
```

### Technical Decisions

| Decision | Approach |
|----------|----------|
| SVG generation | Build simple primitives (rect, line, path, text) |
| PDF conversion | Puppeteer to render SVG to PDF |
| Scale | 1/4" = 1' (standard architectural), configurable |
| Units | All dimensions in feet internally, converted at render |
| Styling | Architectural conventions: heavy walls, light fixtures, dashed hidden |

### Dependencies

```json
{
  "dependencies": {
    "puppeteer": "^22.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0"
  }
}
```

## Deliverables

| Drawing | Description |
|---------|-------------|
| floor-plan-ground.pdf | Main house ground floor with room labels, dimensions |
| floor-plan-upper.pdf | Main house upper floor |
| floor-plan-casita.pdf | Master casita plan |
| elevation-front.pdf | Street-facing view with materials indicated |
| elevation-rear.pdf | Backyard-facing view |
| elevation-left.pdf | Side with casita/walkway |
| elevation-right.pdf | Opposite side |
| section-aa.pdf | Cross-section showing vaulted living room, upper floor |
| roof-plan.pdf | Bird's eye roof layout with slopes indicated |
| site-plan.pdf | Property with buildings, driveway, landscaping zones |
