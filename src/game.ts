import { Table } from './table';
import { Cmd } from './commands';
import { Position } from './position';
import chalk from 'chalk';
import emoji from 'node-emoji';

function errorEmojify(message: string): string {
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

  handle(cmd: Cmd, newPos?: Position): string {
    try {
      const currentPosIsValid = this.table.isValid(this.currentPos);
      if (
        cmd === Cmd.PLACE ||
        (currentPosIsValid.isValid && this.currentPos !== null)
      ) {
        const derivedPos = this.table.getNextPosition(
          this.currentPos as Position,
          cmd,
          newPos,
        );
        const derivedPosIsValid = this.table.isValid(derivedPos);
        if (derivedPosIsValid.isValid) {
          this.currentPos = derivedPos;
          return tickEmojify(`OK: ${JSON.stringify(this.currentPos)}`);
        }
        return errorEmojify(
          chalk.red.bgBlack(`New position ${derivedPosIsValid.error}`),
        );
      }
      return errorEmojify(
        `The current positon ${currentPosIsValid.error} is invalid`,
      );
    } catch (err) {
      return `Invalid command due to ${err.toString()}`;
    }
  }
}
