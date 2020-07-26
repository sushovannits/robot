import { Position } from './position';
import { Cmd } from './commands';
import { Direction } from './direction';
import { TABLE_SIZE } from './config';

export const INVALID_POSITION_ERROR = 'invalid position';
export interface IsValidResult {
  isValid: boolean;
  error: string | null;
}
type Navigate = {
  [key in Cmd]: (
    currentPos: Position,
    newPos?: Position,
  ) => Position | undefined;
};

const navigate: Navigate = {
  [Cmd.SHOW]: (currentPos: Position) => {
    return currentPos;
  },
  [Cmd.PLACE]: (_: Position, newPos?: Position) => {
    return newPos;
  },
  [Cmd.LEFT]: (currentPos: Position) => {
    return currentPos;
  },
  [Cmd.RIGHT]: (currentPos: Position) => {
    return currentPos;
  },
  [Cmd.MOVE]: (currentPos: Position) => {
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
    cmd: Cmd,
    newPos?: Position,
  ): Position | undefined {
    return navigate[cmd](currentPos, newPos);
  }
}
