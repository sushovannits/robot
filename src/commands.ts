import { isEnum } from 'class-validator';
export enum Cmd {
  MOVE = 'MOVE',
  PLACE = 'PLACE',
  SHOW = 'SHOW',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export function isValidCommand(command: string): boolean {
  return isEnum(command, Cmd);
}
