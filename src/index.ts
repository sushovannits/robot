import Vorpal from 'vorpal';
import { Args, CommandInstance } from 'vorpal';
import { Game, errorEmojify } from './game';
import { Direction, DirectionStrings } from './direction';
import { Position } from './position';
import { Command } from './commands';
import { emojify } from 'node-emoji';
import LineByLine from 'n-readlines';
import {
  isValidPositionCoordinate,
  isValidFile,
  isValidDirection,
} from './validation/ui';

const vorpal = new Vorpal();
const game = new Game();
type CommandDescription = {
  [key in Command]?: string;
};
const commandDescription: CommandDescription = {
  [Command.PLACE]: 'places the bot at x,y facing direction d',
  [Command.MOVE]: 'moves the bot',
  [Command.RIGHT]: 'turns bot by 90 degress to right',
  [Command.LEFT]: 'turns bot by 90 degress to left',
  [Command.REPORT]: 'reports current position of the bot',
};

// This one is actually not part of the requirement but included because vorpal does not support piping from a file
vorpal
  .command('file <filename>', 'executes command fro the file')
  .validate(function(args: Args): boolean | string {
    const [isValid, error] = isValidFile(args.filename);
    return isValid || errorEmojify(error || 'validation failed');
  })
  .action(async function(this: CommandInstance, arg: Args) {
    const liner = new LineByLine(arg.filename);
    let line;
    while ((line = liner.next())) {
      const lineStr = line.toString('ascii');
      this.log(lineStr);
      vorpal.execSync(lineStr);
    }
  });

vorpal
  .command(
    `${Command.PLACE.toString().toLowerCase()} <x> <y> <d>`,
    commandDescription[Command.PLACE],
  )
  .validate(function(args: Args): boolean | string {
    const [isValidCoordinate, errorCoordinate] = isValidPositionCoordinate(
      args.x,
      args.y,
    );
    const [isValidInputDirection, errorDirection] = isValidDirection(args.d);
    const isValid = isValidCoordinate && isValidInputDirection;
    const error =
      [errorCoordinate, errorDirection].filter(e => !!e).join(',') ||
      'validation fail';
    return isValid || errorEmojify(error);
  })
  .action(async function(this: CommandInstance, arg: Args) {
    this.log(
      game.handle(
        Command.PLACE,
        new Position(
          parseInt(arg.x),
          parseInt(arg.y),
          Direction[arg.d.toUpperCase() as DirectionStrings],
        ),
      ),
    );
  });

// Piggy backing on vorpal validation here
Object.keys(commandDescription).forEach((cmd: string) => {
  const commandEnum = Command[cmd.toUpperCase() as Command];
  if (cmd === Command.PLACE) return; // Already registered differently
  vorpal
    .command(`${cmd.toLowerCase()}`, commandDescription[commandEnum as Command])
    .action(async function(this: CommandInstance) {
      this.log(game.handle(cmd as Command));
    });
});

vorpal.delimiter(emojify('robot')).show();

export function checkSize(): string | undefined {
  return process.env.TABLE_SIZE;
}
