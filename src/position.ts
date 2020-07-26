import { Direction } from './direction';
export class Position {
  x: number;
  y: number;
  d: Direction;
  constructor(x: number, y: number, d: Direction) {
    this.x = x;
    this.y = y;
    this.d = d;
  }
}
