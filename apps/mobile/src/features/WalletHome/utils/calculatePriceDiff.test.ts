import { calculateDiff } from './calculatePriceDiff.ts';

it.each([
  ['+11.11%', 1000000, 900000],
  ['+25.00%', 123456, 98765],
  ['+1.01%', 900000, 891000],
  ['-10.00%', 900000, 1000000],
  ['-32.12%', 900000, 1325875],
])(
  'Must return correct difference in percents %s between %i and %i with 2 numbers after a decimal point',
  async (expected, n1, n2) => {
    expect(calculateDiff(n1, n2, 2)).toBe(expected);
  },
);

it.each([
  ['+11.1%', 1000000, 900000],
  ['-45.9%', 12445887, 23010349],
  ['-99.9%', 900, 891000],
  ['+7139.6%', 72395900, 1000000],
  ['-32.1%', 900000, 1325875],
])(
  'Must return correct difference in percents %s between %i and %i with a single number after a decimal point',
  async (expected, n1, n2) => {
    expect(calculateDiff(n1, n2, 1)).toBe(expected);
  },
);

it.each([
  [null, 0, 0],
  [null, 900000, 0],
  [null, 0, 900000],
])('Must return null if one of the numbers is 0', async (expected, n1, n2) => {
  expect(calculateDiff(n1, n2, 2)).toBe(expected);
});

it.each([
  [null, -1, -100],
  [null, -900000, 1],
  [null, 1, -900000],
])('Must return null if one or more of the numbers are negative', async (expected, n1, n2) => {
  expect(calculateDiff(n1, n2)).toBe(expected);
});
