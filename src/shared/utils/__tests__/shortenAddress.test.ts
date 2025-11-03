import shortenAddress from '../shortAddress';

it.each([
  ['SP3SBQ9PZEMBNBAWTR7FRPE3XK0EFW9JWVX4G80S2', 'SP3SB...0S2'],
  ['SP3MPPQM3AQ079990S1Y5H0FJGVNSS122N8WR9H5D', 'SP3MP...H5D'],
  ['SP3XXK8BG5X7CRH7W07RRJK3JZJXJ799WX3Y0SMCR', 'SP3XX...MCR'],
  ['SPX8T06E8FJQ33CX8YVR9CC6D9DSTF6JE0Y8R7DS', 'SPX8T...7DS'],
])('.shortenAddress(%s, %s)', (input, expected) => {
  expect(shortenAddress(input)).toBe(expected);
});
