import { Table } from './table';
import { Command } from './commands';
import { Position } from './position';
import chalk from 'chalk';
import emoji from 'node-emoji';

export function errorEmojify(message: string): string {
  return emoji.emojify(':x: ' + message);
}

function tickEmojify(message: string): string {
  return emoji.emojify(':white_check_mark: ' + message);
}

export class Game {
  table: Table;
  currentPos?: Position;
  constructor() {
    this.table = new Table();
  }

  handle(cmd: Command, newPos?: Position): string {
    let error = null;
    let result = 'OK';
    const currentPosIsValid = this.table.isValid(this.currentPos);
    if (
      cmd === Command.PLACE || // when placing the bot current position does not matter
      (currentPosIsValid.isValid && this.currentPos !== null) // check current position
    ) {
      const derivedPos = this.table.getNextPosition(
        this.currentPos as Position,
        cmd,
        newPos,
      );
      const derivedPosIsValid = this.table.isValid(derivedPos); // check new position
      if (derivedPosIsValid.isValid) {
        this.currentPos = derivedPos;
        result = tickEmojify(`OK: ${JSON.stringify(this.currentPos)}`);
      } else {
        error = errorEmojify(
          chalk.red.bgBlack(`new position ${derivedPosIsValid.error}`),
        );
      }
    } else {
      error = errorEmojify(`current position ${currentPosIsValid.error}`);
    }
    return error || result;
  }
}
