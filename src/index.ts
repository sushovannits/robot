import Vorpal from 'vorpal';
import { Args, CommandInstance } from 'vorpal';
import { Game } from './game';
import { Direction, DirectionStrings } from './direction';
import { Position } from './position';
import { Cmd } from './commands';
import { emojify } from 'node-emoji';
import LineByLine from 'n-readlines';

const vorpal = new Vorpal();
const game = new Game();

vorpal
  .command('file <fileName>', 'executes from a file')
  .action(async function(this: CommandInstance, arg: Args) {
    const liner = new LineByLine(arg.fileName);
    let line;
    while ((line = liner.next())) {
      vorpal.execSync(line.toString('ascii'));
    }
  });

vorpal
  .command('place <x> <y> <d>', 'Queries the server')
  .action(async function(this: CommandInstance, arg: Args) {
    this.log(
      game.handle(
        Cmd.PLACE,
        new Position(
          parseInt(arg.x),
          parseInt(arg.y),
          Direction[arg.d as DirectionStrings],
        ),
      ),
    );
  });

vorpal
  .command('move', 'Queries the server')
  .action(async function(this: CommandInstance) {
    this.log(game.handle(Cmd.MOVE));
  });

vorpal
  .command('report', 'Queries the server')
  .action(async function(this: CommandInstance) {
    this.log(game.handle(Cmd.SHOW));
  });

vorpal
  .command('left', 'Queries the server')
  .action(async function(this: CommandInstance) {
    this.log(game.handle(Cmd.LEFT));
  });

vorpal
  .command('right', 'Queries the server')
  .action(async function(this: CommandInstance) {
    this.log(game.handle(Cmd.RIGHT));
  });

vorpal.delimiter(emojify('robot :robot_face:')).show();

export function checkSize(): string | undefined {
  return process.env.TABLE_SIZE;
}
