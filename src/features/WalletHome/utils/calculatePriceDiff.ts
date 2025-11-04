type PriceEntry = [number, number][] | null | undefined;

type CalculatePriceDiffSinceReturn = {
  data: string | null;
  error: string | null;
};

/**
 * Calculate difference in percents.
 * @param {PriceEntry} data - PriceEntry sorted descendingly by timestamp in seconds
 **/
export default async function calculatePriceDiff(
  data: PriceEntry,
): Promise<CalculatePriceDiffSinceReturn> {
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
        data: (await calculateDiff(data[data.length - 1][1], data[i][1])).toFixed(2),
        error: null,
      };
    }
  }
  return {
    data: null,
    error: 'Could not calculate diff',
  };
}

async function calculateDiff(n1: number, n2: number) {
  if (n2 == 0) {
    return 0;
  }
  return (n1 / n2) * 100 - 100;
}
