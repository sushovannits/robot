import 'expect';
import 'jest';
// import { TABLE_SIZE } from '../config';
import { Table, INVALID_POSITION_ERROR } from '../table';
import { Direction } from '../direction';
import { Position } from '../position';
import { Cmd } from '../commands';

let table: Table;
let tableSize: number;

beforeAll(() => {
  table = new Table();
  tableSize = table.getSize();
});

describe('table functionality', () => {
  it('should return true for a valid position', () => {
    const validPositions: [number, number, Direction][] = [
      [0, 0, Direction.NORTH],
      [tableSize / 2, 1, Direction.SOUTH],
      [tableSize - 1, tableSize - 1, Direction.EAST],
      [1, 0, Direction.NORTH],
      [1, tableSize / 2, Direction.SOUTH],
      [tableSize - 1, tableSize - 1, Direction.EAST],
    ];
    validPositions.forEach(([x, y, d]: [number, number, Direction]) => {
      expect(table.isValid(new Position(x, y, d))).toEqual({
        isValid: true,
        error: null,
      });
    });
  });

  it('should return false for invalid position', () => {
    const invalidPositions: [number, number, Direction][] = [
      // x,            y,             d
      [-1, tableSize - 1, Direction.NORTH],
      [-2, tableSize - 1, Direction.SOUTH],
      [tableSize, tableSize - 1, Direction.EAST],
      [tableSize + 1, tableSize - 1, Direction.WEST],
      [1, -1, Direction.NORTH],
      [1, -2, Direction.SOUTH],
      [tableSize - 1, tableSize, Direction.EAST],
      [tableSize - 1, tableSize + 1, Direction.WEST],
    ];
    invalidPositions.forEach(([x, y, d]: [number, number, Direction]) => {
      expect(table.isValid(new Position(x, y, d))).toEqual({
        isValid: false,
        error: INVALID_POSITION_ERROR,
      });
    });
  });

  it('should calculate next position correctly', () => {
    const nextPositionTestData: [
      Position,
      Cmd,
      Position | undefined,
      Position,
    ][] = [
      [
        new Position(0, 2, Direction.NORTH),
        Cmd.PLACE,
        new Position(0, 2, Direction.SOUTH),
        new Position(0, 2, Direction.SOUTH),
      ],
      // y axis movements
      [
        new Position(0, tableSize - 2, Direction.NORTH),
        Cmd.MOVE,
        undefined,
        new Position(0, tableSize - 1, Direction.NORTH),
      ],
      [
        new Position(0, tableSize - 1, Direction.SOUTH),
        Cmd.MOVE,
        undefined,
        new Position(0, tableSize - 2, Direction.SOUTH),
      ],
      // x axis movements
      [
        new Position(tableSize - 2, 0, Direction.EAST),
        Cmd.MOVE,
        undefined,
        new Position(tableSize - 1, 0, Direction.EAST),
      ],
      [
        new Position(tableSize - 1, 0, Direction.WEST),
        Cmd.MOVE,
        undefined,
        new Position(tableSize - 2, 0, Direction.WEST),
      ],
    ];
    table.getNextPosition(
      new Position(0, 2, Direction.NORTH),
      Cmd.PLACE,
      undefined,
    );
    nextPositionTestData.forEach(([currentPos, cmd, newPos, expectedPos]) => {
      expect(table.getNextPosition(currentPos, cmd, newPos)).toEqual(
        expectedPos,
      );
    });
  });

  // it('should turn right', () => {
  //   const dirs = Object.values(Direction);
  //   const currentDir = Direction.WEST;
  //   const currentDirIndex = dirs.indexOf(currentDir);
  //   const newDirIndex = (currentDirIndex + 1) % dirs.length;
  //   const newDir = dirs[newDirIndex];
  // });
  // it('should turn left', () => {
  //   const dirs = Object.values(Direction);
  //   const currentDir = Direction.SOUTH;
  //   const currentDirIndex = dirs.indexOf(currentDir);
  //   const newDirIndex =
  //     (((currentDirIndex - 1) % dirs.length) + dirs.length) % dirs.length;
  //   const newDir = dirs[newDirIndex];
  // });
});
