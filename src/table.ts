import { Position } from './position';
import { Command } from './commands';
import { Direction } from './direction';
import { TABLE_SIZE } from './config';

export const INVALID_POSITION_ERROR = 'invalid';
export interface IsValidResult {
  isValid: boolean;
  error: string | null;
}
type Navigate = {
  [key in Command]: (
    currentPos: Position,
    newPos?: Position,
  ) => Position | undefined;
};

const navigate: Navigate = {
  [Command.REPORT]: (currentPos: Position) => {
    return currentPos;
  },
  [Command.PLACE]: (_: Position, newPos?: Position) => {
    return newPos;
  },
  [Command.RIGHT]: (currentPos: Position) => {
    const directionArr = Object.values(Direction);
    const currentDir = currentPos.d;
    const currentDirIndex = directionArr.indexOf(currentDir);
    const newDirIndex = (currentDirIndex + 1) % directionArr.length;
    const newDir = directionArr[newDirIndex];
    return new Position(currentPos.x, currentPos.y, newDir);
  },
  [Command.LEFT]: (currentPos: Position) => {
    const directionArr = Object.values(Direction);
    const numDirections = directionArr.length;
    const currentDir = currentPos.d;
    const currentDirIndex = directionArr.indexOf(currentDir);
    const newDirIndex =
      (((currentDirIndex - 1) % numDirections) + numDirections) % numDirections;
    const newDir = directionArr[newDirIndex];
    return new Position(currentPos.x, currentPos.y, newDir);
  },
  [Command.MOVE]: (currentPos: Position) => {
    switch (currentPos.d) {
      case Direction.NORTH: {
        return new Position(currentPos.x, currentPos.y + 1, currentPos.d);
      }
      case Direction.SOUTH: {
        return new Position(currentPos.x, currentPos.y - 1, currentPos.d);
      }
      case Direction.EAST: {
        return new Position(currentPos.x + 1, currentPos.y, currentPos.d);
      }
      case Direction.WEST: {
        return new Position(currentPos.x - 1, currentPos.y, currentPos.d);
      }
      default: {
        return currentPos;
      }
    }
  },
};

export class Table {
  private size: number;
  constructor() {
    this.size = parseInt(TABLE_SIZE || '');
  }

  getSize(): number {
    return this.size;
  }

  isValid(pos?: Position): IsValidResult {
    const isValid =
      pos !== undefined &&
      pos.x >= 0 &&
      pos.x < this.size &&
      pos.y >= 0 &&
      pos.y < this.size;
    const error = isValid ? null : INVALID_POSITION_ERROR;
    return {
      isValid,
      error,
    };
  }

  getNextPosition(
    currentPos: Position,
    cmd: Command,
    newPos?: Position,
  ): Position | undefined {
    return navigate[cmd](currentPos, newPos);
  }
}
