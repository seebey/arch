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

| Room | Dimensions | Sq Ft | Notes |
|------|------------|-------|-------|
| Kitchen | 16' x 18' | 288 | Island, opens to dining/living |
| Dining Room | 14' x 14' | 196 | Casual, 6-8 person table |
| Living Room | 18' x 20' | 360 | Vaulted ceiling, fireplace |
| Family Room | 14' x 16' | 224 | TV/casual area |
| Mud Room | 8' x 10' | 80 | Entry from garage, side entry from driveway |
| Main Bathroom | 8' x 10' | 80 | Full bath |
| Foyer/Entry | 8' x 12' | 96 | Front entrance |
| Hallway/Circulation | - | ~140 | Stairs, corridors |
| 2-Car Garage | 22' x 24' | 528 | Attached, side-entry |

### Main House - Upper Floor (~640 sq ft)

| Room | Dimensions | Sq Ft | Notes |
|------|------------|-------|-------|
| Kids Bedroom 1 | 12' x 14' | 168 | Closet included |
| Kids Bedroom 2 | 12' x 14' | 168 | Closet included |
| Kids Bathroom | 8' x 10' | 80 | Shared hall bath |
| Bonus/Flex Space | 12' x 12' | 144 | Play area, study nook |
| Hallway/Landing | - | ~80 | Open to living below |

### Master Casita (~600 sq ft)

| Room | Dimensions | Sq Ft | Notes |
|------|------------|-------|-------|
| Master Bedroom | 16' x 18' | 288 | King bed, sitting area |
| Master Bathroom | 12' x 14' | 168 | Double vanity, walk-in shower, soaking tub |
| Walk-in Closet | 8' x 12' | 96 | Attached to bedroom |
| Entry Vestibule | 6' x 8' | 48 | Transition from covered walkway |

### Covered Walkway (~200 sq ft)

- **Length:** ~30 feet
- **Width:** 6-8 feet
- **Roof:** Extended gable with solid roof (rain protection)
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
