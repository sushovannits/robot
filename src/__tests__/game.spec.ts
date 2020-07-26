import 'expect';
import 'jest';
import { Game } from '../game';
import { Command } from '../commands';
import { Direction } from '../direction';
import { INVALID_POSITION_ERROR } from '../table';
import { Position } from '../position';

let game: Game;
let tableSize: number;

beforeAll(() => {
  game = new Game();
  tableSize = game.table.getSize();
});

describe('game control handles commands correctly', () => {
  it('when invalid cmd due to bot not initialized', () => {
    const invalidCommandsBeforeInit = [
      Command.MOVE,
      Command.LEFT,
      Command.RIGHT,
      Command.REPORT,
    ];
    invalidCommandsBeforeInit.forEach(cmd => {
      const result = game.handle(cmd);
      expect(result).toContain('current position');
      expect(result).toContain(INVALID_POSITION_ERROR);
    });
  });

  it('when valid cmd', () => {
    Object.keys(Command).forEach(cmd => {
      game.currentPos = new Position(
        tableSize / 2,
        tableSize / 2,
        Direction.NORTH,
      );
      const result = game.handle(cmd as Command, game.currentPos);
      expect(result).toContain('OK');
    });
  });

  it('errors when bot falls off', () => {
    const directionAndStartPos: [number, number, Direction][] = [
      [0, 0, Direction.NORTH],
      [0, tableSize - 1, Direction.SOUTH],
      [0, 0, Direction.EAST],
      [tableSize - 1, 0, Direction.WEST],
    ];
    directionAndStartPos.forEach(([x, y, d]: [number, number, Direction]) => {
      game.currentPos = new Position(x, y, d);
      const result = [...Array(tableSize).keys()].map(_ =>
        game.handle(Command.MOVE),
      );
      expect(result[result.length - 1]).toContain(
        'new position ' + INVALID_POSITION_ERROR,
      );
    });
  });

  it('errors when invalid place coordinates', () => {
    expect(
      game.handle(Command.PLACE, new Position(tableSize, -1, Direction.NORTH)),
    ).toContain('new position ' + INVALID_POSITION_ERROR);
  });

  it('reports correctly', () => {
    const currentPos = new Position(1, 2, Direction.NORTH);
    game.currentPos = currentPos;
    const result = game.handle(Command.REPORT);
    expect(result).toContain('OK');
    expect(result).toContain(JSON.stringify(currentPos));
  });
});
