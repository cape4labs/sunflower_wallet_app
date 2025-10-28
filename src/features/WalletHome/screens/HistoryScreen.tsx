import Wrapper from '../../../shared/components/Wrapper';
import { View, Text, SectionList, ActivityIndicator, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { useWalletData } from '../../../shared/hooks/useWalletData';
import { useWalletContext } from '../../../providers/WalletContext';
import { Send, Upload, RefreshCw, Repeat, Copy } from 'lucide-react-native';
import { CopyToClipboard } from '../../../shared/utils/copyToClipboard';


interface Transaction {
  tx_id: string;
  tx_type: string;
  amount: string;
  recipient_address: string;
  sender_address: string;
  timestamp: number;
  tx_status: string;
}

export default function HistoryScreen() {
  const { walletName } = useWalletContext();
  const { walletData, isLoadingWalletData, errorWalletData } = useWalletData(walletName);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [errorTransactions, setErrorTransactions] = useState<string | null>(null);
  const [expandedTxId, setExpandedTxId] = useState<string | null>(null);

  const fetchTransactions = async () => {
    if (!walletData?.stxAddress) return;

    setIsLoadingTransactions(true);
    setErrorTransactions(null);

    try {
      const response = await fetch(
        `https://api.hiro.so/extended/v1/address/${walletData.stxAddress}/transactions?limit=50&unanchored=true`,
        { headers: { Accept: 'application/json' } },
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const txs = data.results.map((tx: any) => ({
        tx_id: tx.tx_id,
        tx_type: tx.tx_type,
        amount: tx.token_transfer?.amount ? (Number(tx.token_transfer.amount) / 1e6).toFixed(6) : '0',
        recipient_address: tx.token_transfer?.recipient_address || 'N/A',
        sender_address: tx.sender_address || 'N/A',
        timestamp: tx.burn_block_time_iso ? new Date(tx.burn_block_time_iso).getTime() : Date.now(),
        tx_status: tx.tx_status || 'pending',
      }));

      setTransactions(txs);
    } catch (err) {
      setErrorTransactions(
        `Error with fetching transactions: ${err instanceof Error ? err.message : 'Error'}`,
      );
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [walletData?.stxAddress]);

  const refreshTransactions = () => {
    setTransactions([]);
    fetchTransactions();
  };

  const getTransactionDetails = (tx: Transaction) => {
    const isSent = tx.sender_address === walletData?.stxAddress;
    const icon = isSent ? Send : Upload;
    const label = isSent ? 'Sent' : 'Received';

    switch (tx.tx_type) {
      case 'contract_call':
        return { icon: Repeat, label: 'Swap' };
      case 'coinbase':
        return { icon: Upload, label: 'Received' };
      default:
        return { icon, label };
    }
  };

  const groupTransactionsByDate = (txs: Transaction[]) => {
    const grouped = txs.reduce((acc, tx) => {
      const date = new Date(tx.timestamp).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
      });
      if (!acc[date]) acc[date] = [];
      acc[date].push(tx);
      return acc;
    }, {} as { [key: string]: Transaction[] });

    return Object.keys(grouped).map(date => ({
      title: date,
      data: grouped[date],
    }));
  };

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const { icon: IconComponent, label } = getTransactionDetails(item);
    const isExpanded = expandedTxId === item.tx_id;

    const shortenTxId = (txId: string) => {
      if (!txId) return '';
      return `${txId.slice(0, 6)}...${txId.slice(-4)}`;
    };

    return (
      <View className="w-full mb-2">
        <Pressable
          onPress={() => setExpandedTxId(isExpanded ? null : item.tx_id)}
          className={`flex-row justify-between items-center w-full p-4 border-b bg-custom_complement rounded-lg border-2 border-custom_border ${isExpanded ? "border-b-0 rounded-b-none" : ''} `}
        >
          <View className="flex-row items-center">
            <View>
              <IconComponent color="white" size={20} strokeWidth={1.5} />
            </View>
            <View className="ml-2">
              <Text className="text-white text-xl">{label}</Text>
              <Text className="text-gray-400 text-sm">{item.recipient_address.slice(0, 8)}...</Text>
            </View>
          </View>
          <View className="flex-col items-end">
            <Text className="text-white text-xl">{item.amount} STX</Text>
            <Text className={`text-sm ${item.tx_status === 'success' ? 'text-green-500' : 'text-yellow-500'}`}>
              {item.tx_status}
            </Text>
          </View>
        </Pressable>
        {isExpanded && (
          <View className="bg-custom_complement p-4 rounded-lg rounded-t-none border-t-0 border-2 border-custom_border">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-white">TXid: {shortenTxId(item.tx_id)}</Text>
              <Pressable
                onPress={() => CopyToClipboard(item.tx_id)}
                className="p-1"
              >
                <Copy color="white" size={16} strokeWidth={1.5} />
              </Pressable>
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <View>
      <Text className="text-white text-lg font-semibold">{section.title}</Text>
    </View>
  );

  return (
    <Wrapper>
      <View className="flex-1 w-full">
        <View className="flex-row justify-between items-center mb-4 p-4 border-b-2 border-gray-500">
          <Text className="text-white text-2xl font-bold">History</Text>
          <Pressable onPress={refreshTransactions} className="p-2 bg-custom_border rounded-full">
            <RefreshCw color="#FF4800" size={20} />
          </Pressable>
        </View>

        {isLoadingWalletData || isLoadingTransactions ? (
          <View className="flex-1 w-full justify-center items-center">
            <ActivityIndicator size="large" color="#FF4800" />
            <Text className="text-white mt-2">Loading</Text>
          </View>
        ) : errorWalletData || errorTransactions ? (
          <View className="flex-1 w-full justify-center items-center">
            <Text className="text-red-500 text-center">{errorWalletData || errorTransactions}</Text>
            <Pressable
              onPress={refreshTransactions}
              className="mt-4 p-2 bg-custom_border rounded-lg"
            >
              <Text className="text-white">Retry</Text>
            </Pressable>
          </View>
        ) : transactions.length === 0 ? (
          <View className="flex-1 w-full justify-center items-center">
            <Text className="text-gray-400 text-center">No transactions</Text>
          </View>
        ) : (
          <SectionList
            sections={groupTransactionsByDate(transactions)}
            renderItem={renderTransaction}
            renderSectionHeader={renderSectionHeader}
            keyExtractor={(item) => item.tx_id}
            className="flex-1 w-full"
            contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 4 }}
          />
        )}
      </View>
    </Wrapper>
  );
}
