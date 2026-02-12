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
    label: 'GARAGE\n24x24'
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
    position: { x: 24, y: 24 },
    dimensions: { width: 14, height: 14 },
    walls: [
      { side: 'right', thickness: 0.5, exterior: true }
    ],
    doors: [{ position: { x: 7, y: 16 }, width: 8, swing: 'down', slidingGlass: true }],
    windows: [{ position: { x: 14, y: 8 }, width: 5 }],
    label: 'FAMILY\nROOM'
  },
  {
    name: 'Kitchen',
    position: { x: 0, y: 36 },
    dimensions: { width: 18, height: 14 },
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
