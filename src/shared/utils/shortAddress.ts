
export default function shortenAddress (address: string | undefined) {
    if (!address) return 'Loading...';
    return `${address.slice(0, 5)}...${address.slice(-3)}`;
};