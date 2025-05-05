import { sum } from '../../src/tests/sum';

describe('sum function', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  });

  test('adds negative numbers correctly', () => {
    expect(sum(-1, -2)).toBe(-3);
  });

  test('handles zero properly', () => {
    expect(sum(0, 5)).toBe(5);
  });
});