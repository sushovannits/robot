import 'expect';
import 'jest';
import {
  isValidFile,
  isValidPositionCoordinate,
  isValidDirection,
} from '../validation/ui';
import fs from 'fs';

describe('validation should work', () => {
  it('when invalid coordinates', () => {
    expect(isValidPositionCoordinate('jibberish', 'jibberish')).toEqual([
      false,
      'invalid coordinates',
    ]);
  });
  it('when valid coordinates', () => {
    expect(isValidPositionCoordinate(4, 5)).toEqual([true, null]);
  });
  it('when invalid file', () => {
    const filename = './non-existent.txt';
    if (fs.existsSync(filename)) fs.unlinkSync(filename);
    expect(isValidFile(filename)).toEqual([false, 'file does not exist']);
  });
  it('when valid file', () => {
    const filename = './valid.txt';
    fs.closeSync(fs.openSync(filename, 'w'));
    expect(isValidFile(filename)).toEqual([true, null]);
    if (fs.existsSync(filename)) fs.unlinkSync(filename);
  });
  it('when valid direction', () => {
    ['north', 'EAST', 'west', 'SOUTH'].forEach(dir => {
      expect(isValidDirection(dir)).toEqual([true, null]);
    });
  });
  it('when invalid direction', () => {
    ['jibberish', 2, '%$#%#'].forEach(dir => {
      expect(isValidDirection(dir)).toEqual([false, 'invalid direction']);
    });
  });
});
