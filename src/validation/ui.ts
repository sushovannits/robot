import { isEnum, isInt, isString } from 'class-validator';
import { Command } from '../commands';
import { Direction } from '../direction';
import fs from 'fs';

type ValidationResult = [boolean, string | null];
export function isValidPositionCoordinate(
  x: number,
  y: number,
): ValidationResult {
  const isValid = isInt(x) && isInt(y);
  return [isValid, isValid ? null : 'inavlid coordinates'];
}

export function isValidFile(filename: string): ValidationResult {
  const isValid = fs.existsSync(filename);
  return [isValid, isValid ? null : 'file does not exist'];
}

export function isValidCommand(command: string): ValidationResult {
  const isValid = isEnum(command, Command);
  return [isValid, isValid ? null : 'inavlid command'];
}
export function isValidDirection(direction: string): ValidationResult {
  let isValid = isString(direction);
  isValid = isEnum(direction.toString().toUpperCase(), Direction);
  return [isValid, isValid ? null : 'invalid direction'];
}
