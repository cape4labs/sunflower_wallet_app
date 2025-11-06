type PriceEntry = [number, number][] | null | undefined;

type CalculatePriceDiffSinceReturn = {
  data: string | null;
  error: string | null;
};

/**
 * Calculate difference in percents for a group of values.
 * @param {PriceEntry} data - PriceEntry sorted descendingly by timestamp in seconds
 **/
export default function calculatePriceDiff(
  data: PriceEntry,
): CalculatePriceDiffSinceReturn {
  if (data == null || data == undefined) {
    return {
      data: null,
      error: 'Data must be present',
    };
  }

  // Default time period since diff calculated
  const inSeconds = 3600;

  // In coingecko api, the first value has the smallest timestamp
  for (let i = data.length - 1; i > 0; i--) {
    if (data[data.length - 1][0] - data[i][0] > inSeconds) {
      return {
        data: calculateDiff(data[data.length - 1][1], data[i][1]),
        error: null,
      };
    }
  }
  return {
    data: null,
    error: 'Could not calculate diff',
  };
}

/**
* Calculate diff between two numbers in percents.
* @param {number} n1 - changed number
* @param {number} n2 - base number
**/
export function calculateDiff(n1: number, n2: number, dec: number = 2): string | null {
  // Situations when either n2 or n1 equal 0 are weird and not for calculating
  if (n2 <= 0 || n1 <= 0) {
    return null;
  }

  const diff = (n1 / n2) * 100 - 100;

  if (diff > 0) {
      return "+" + diff.toFixed(dec) + "%";
  } else if (diff < 0) {
      // "-" is put automatically if number is negative
      return diff.toFixed(dec) + "%";
  } else {
      return null;
    }
}
