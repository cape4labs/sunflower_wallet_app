export async function fetchStacksBalances(address: string) {
  const res = await fetch(
    `https://api.hiro.so/extended/v1/address/${address}/balances?unanchored=true`,
    {
      headers: {
        Accept: 'application/json',
      },
    },
  );

  if (!res.ok) {
    throw new Error(`Stacks API error: ${res.status}`);
  }

  return res.json();
}
