export async function fetchBtcBalance(address: string): Promise<string> {
  const res = await fetch(`https://blockstream.info/api/address/${address}`);
  if (!res.ok) throw new Error(`BTC API error: ${res.status}`);

  const data = await res.json();
  const satoshi = data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;

  return (satoshi / 1e8).toFixed(6);
}
