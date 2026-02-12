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
