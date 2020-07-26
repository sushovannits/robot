import 'expect';
import 'jest';
// import { TABLE_SIZE } from '../config';
import { Table, INVALID_POSITION_ERROR } from '../table';
import { Direction } from '../direction';
import { Position } from '../position';
import { Command } from '../commands';

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
      Command,
      Position | undefined,
      Position,
    ][] = [
      [
        new Position(0, 2, Direction.NORTH),
        Command.PLACE,
        new Position(0, 2, Direction.SOUTH),
        new Position(0, 2, Direction.SOUTH),
      ],
      // y axis movements
      [
        new Position(0, tableSize - 2, Direction.NORTH),
        Command.MOVE,
        undefined,
        new Position(0, tableSize - 1, Direction.NORTH),
      ],
      [
        new Position(0, tableSize - 1, Direction.SOUTH),
        Command.MOVE,
        undefined,
        new Position(0, tableSize - 2, Direction.SOUTH),
      ],
      // x axis movements
      [
        new Position(tableSize - 2, 0, Direction.EAST),
        Command.MOVE,
        undefined,
        new Position(tableSize - 1, 0, Direction.EAST),
      ],
      [
        new Position(tableSize - 1, 0, Direction.WEST),
        Command.MOVE,
        undefined,
        new Position(tableSize - 2, 0, Direction.WEST),
      ],
    ];
    table.getNextPosition(
      new Position(0, 2, Direction.NORTH),
      Command.PLACE,
      undefined,
    );
    nextPositionTestData.forEach(([currentPos, cmd, newPos, expectedPos]) => {
      expect(table.getNextPosition(currentPos, cmd, newPos)).toEqual(
        expectedPos,
      );
    });
  });

  it('should turn right', () => {
    const directions = Object.values(Direction);
    directions.forEach((dir: Direction, index: number) => {
      const expectedDirection = [
        Direction.EAST,
        Direction.SOUTH,
        Direction.WEST,
        Direction.NORTH,
      ];
      expect(
        table.getNextPosition(new Position(0, 0, dir), Command.RIGHT),
      ).toEqual(new Position(0, 0, expectedDirection[index]));
    });
  });

  it('should turn left', () => {
    const directions = Object.values(Direction);
    directions.forEach((dir: Direction, index: number) => {
      const expectedDirection = [
        Direction.WEST,
        Direction.NORTH,
        Direction.EAST,
        Direction.SOUTH,
      ];
      expect(
        table.getNextPosition(new Position(0, 0, dir), Command.LEFT),
      ).toEqual(new Position(0, 0, expectedDirection[index]));
    });
  });

  it('should report current pos', () => {
    const currentPos = new Position(1, 2, Direction.NORTH);
    expect(table.getNextPosition(currentPos, Command.REPORT)).toEqual(
      currentPos,
    );
  });
});
