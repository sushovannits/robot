// Order is important here for supporting left and right
export enum Direction {
  NORTH = 'NORTH',
  EAST = 'EAST',
  SOUTH = 'SOUTH',
  WEST = 'WEST',
}
export type DirectionStrings = keyof typeof Direction;
