import { isEnum, isInt, isString } from 'class-validator';
import { Command } from '../commands';
import { Direction } from '../direction';
import fs from 'fs';

type ValidationResult = [boolean, string | null];
export function isValidPositionCoordinate(
  x: string | number,
  y: string | number,
): ValidationResult {
  const isValid = isInt(x) && isInt(y);
  return [isValid, isValid ? null : 'invalid coordinates'];
}

export function isValidFile(filename: string | number): ValidationResult {
  const isValid = fs.existsSync(filename.toString());
  return [isValid, isValid ? null : 'file does not exist'];
}

export function isValidCommand(command: string): ValidationResult {
  const isValid = isEnum(command, Command);
  return [isValid, isValid ? null : 'inavlid command'];
}
export function isValidDirection(direction: string | number): ValidationResult {
  let isValid = isString(direction);
  isValid = isEnum(direction.toString().toUpperCase(), Direction);
  return [isValid, isValid ? null : 'invalid direction'];
}
