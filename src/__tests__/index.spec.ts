import 'expect';
import 'jest';
import { TABLE_SIZE } from '../config';
import * as sample from '../index';

describe('sample functionality from index module', () => {
  it('should do something', () => {
    expect(sample.checkSize()).toBe(TABLE_SIZE);
  });
});
