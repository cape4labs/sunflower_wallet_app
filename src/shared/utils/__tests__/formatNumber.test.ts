import formatNumber from '../formatNumber';

it.each([
  ["100.83", "100,83"],
  ["9214839048.832395395", "9.214.839.048,83"],
  ["0.0", "0,000"],
  ["-10.8", "-10,800"],
  ["999", "999,00"],
])('.formatNumber(%i, %i)', (toFormat, expected) => {
  expect(formatNumber(toFormat)).toBe(expected);
});
