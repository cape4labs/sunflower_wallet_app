export async function fetchTokenPrices(ids: string[]) {
  if (ids.length === 0) return '';

  const res = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=usd`,
  );

  if (res.status === 429) throw new Error('Reload prices');

  if (!res.ok) throw new Error(`Price API error: ${res.status}`);

  return res.json();
}
