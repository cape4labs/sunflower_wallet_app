import {
  Activity,
  Copy,
  Database,
  Layers,
  RefreshCw,
  Repeat,
  Send,
  Upload,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, SectionList, View } from 'react-native';

import { useWalletContext } from '../../../providers/WalletContext';
import TextWithFont from '../../../shared/components/TextWithFont';
import Wrapper from '../../../shared/components/Wrapper';
import { useWalletData } from '../../../shared/hooks/useWalletData';
import { useWalletScreenStyles } from '../../../shared/hooks/useWalletScreenStyle';
import { copyToClipboard } from '../../../shared/utils/clipboard';

interface Transaction {
  tx_id: string;
  tx_type: string;
  amount: string;
  recipient_address: string;
  sender_address: string;
  timestamp: number;
  tx_status: string;
  contract_name?: string;
  contract_id?: string;
  function_name?: string;
}

const BTCFI_CONTRACTS: Record<string, { label: string; icon: any; description: string }> = {
  'stableswap-core-v-1-4': { label: 'Bitflow Pool', icon: Database, description: 'Stable Swap' },
  'amm-pool-v2-01': { label: 'ALEX Pool', icon: Layers, description: 'AMM Liquidity' },
  'stacking-dao-core-v1': { label: 'Stacking DAO', icon: Activity, description: 'Liquid Stacking' },
  'stacking-dao-core-v2': { label: 'Stacking DAO', icon: Activity, description: 'Liquid Stacking' },
  'btcz-token': { label: 'Zest Protocol', icon: Database, description: 'BTC Borrowing' },
};

const formatFunctionName = (name: string) => {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function HistoryScreen() {
  const { walletName } = useWalletContext();
  const { walletData, isLoadingWalletData, errorWalletData } = useWalletData(walletName);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [errorTransactions, setErrorTransactions] = useState<string | null>(null);
  const [expandedTxId, setExpandedTxId] = useState<string | null>(null);

  const globalStyles = useWalletScreenStyles().global;
  const screenStyles = useWalletScreenStyles().historyScreen;

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
      const txs = data.results.map((tx: any) => {
        let contractName;
        let functionName;
        let contractId;

        if (tx.tx_type === 'contract_call' && tx.contract_call) {
          contractId = tx.contract_call.contract_id;
          contractName = contractId.split('.')[1];
          functionName = tx.contract_call.function_name;
        }

        let amount = '0 STX';
        if (tx.tx_type === 'token_transfer') {
          amount = `${(Number(tx.token_transfer.amount || 0) / 1e6).toFixed(2)} STX`;
        } else if (tx.tx_type === 'contract_call') {
          // Check for FT transfers within contract call
          const ftTransfer = tx.ft_transfers?.[0];
          if (ftTransfer) {
            const assetId = ftTransfer.asset_identifier;
            const assetName = assetId.split('::')[1] || 'FT';
            const decimals = assetId.includes('token-alex') ? 8 : 6;
            amount = `${(Number(ftTransfer.amount || 0) / Math.pow(10, decimals)).toFixed(2)} ${assetName}`;
          } else if (tx.fee_rate && tx.sender_address === walletData?.stxAddress) {
            amount = 'Contract Call';
          }
        }

        return {
          tx_id: tx.tx_id,
          tx_type: tx.tx_type,
          amount,
          recipient_address:
            tx.token_transfer?.recipient_address || (contractId ? 'Contract' : 'N/A'),
          sender_address: tx.sender_address || 'N/A',
          timestamp: tx.burn_block_iso ? new Date(tx.burn_block_iso).getTime() : Date.now(),
          tx_status: tx.tx_status || 'pending',
          contract_name: contractName,
          contract_id: contractId,
          function_name: functionName,
        };
      });

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

    if (tx.tx_type === 'contract_call' && tx.contract_name) {
      const info = BTCFI_CONTRACTS[tx.contract_name];
      if (info) {
        return {
          icon: info.icon,
          label: info.label,
          subLabel: tx.function_name ? formatFunctionName(tx.function_name) : info.description,
        };
      }
      return {
        icon: Repeat,
        label: formatFunctionName(tx.contract_name),
        subLabel: tx.function_name ? formatFunctionName(tx.function_name) : 'Contract Interaction',
      };
    }

    switch (tx.tx_type) {
      case 'token_transfer':
        return { icon, label, subLabel: tx.recipient_address.slice(0, 10) + '...' };
      case 'contract_call':
        return { icon: Repeat, label: tx.contract_name || 'Swap', subLabel: tx.function_name };
      case 'coinbase':
        return { icon: Upload, label: 'Received', subLabel: 'Coinbase Reward' };
      default:
        return { icon, label, subLabel: tx.tx_id.slice(0, 10) + '...' };
    }
  };

  const groupTransactionsByDate = (txs: Transaction[]) => {
    const grouped = txs.reduce(
      (acc, tx) => {
        const date = new Date(tx.timestamp).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'long',
        });
        if (!acc[date]) acc[date] = [];
        acc[date].push(tx);
        return acc;
      },
      {} as { [key: string]: Transaction[] },
    );

    return Object.keys(grouped).map(date => ({
      title: date,
      data: grouped[date],
    }));
  };

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const { icon: IconComponent, label } = getTransactionDetails(item);
    const isExpanded = expandedTxId === item.tx_id;

    const shortenTxId = (txId: string) => `${txId.slice(0, 6)}...${txId.slice(-4)}`;

    return (
      <View className="w-full mb-2">
        <Pressable
          onPress={() => setExpandedTxId(isExpanded ? null : item.tx_id)}
          className={`flex-row justify-between items-center w-full bg-custom_complement rounded-lg border-2 border-custom_border ${
            isExpanded ? 'border-b-0 rounded-b-none' : ''
          } ${screenStyles.txContainer}`}
        >
          <View className="flex-row items-center">
            <IconComponent
              color="white"
              size={parseInt(screenStyles.txIconSize)}
              strokeWidth={1.5}
            />
            <View className="ml-2">
              <TextWithFont customStyle={`text-white ${screenStyles.txAmount}`}>
                {label}
              </TextWithFont>
              <TextWithFont customStyle={`text-gray-400 ${screenStyles.txAddress}`}>
                {getTransactionDetails(item).subLabel}
              </TextWithFont>
            </View>
          </View>
          <View className="flex-col items-end">
            <TextWithFont customStyle={`text-white ${screenStyles.txAmount}`}>
              {item.amount}
            </TextWithFont>
            <TextWithFont
              customStyle={`${screenStyles.txStatus} ${
                item.tx_status === 'success' ? 'text-green-500' : 'text-yellow-500'
              }`}
            >
              {item.tx_status}
            </TextWithFont>
          </View>
        </Pressable>

        {isExpanded && (
          <View
            className={`bg-custom_complement rounded-lg rounded-t-none border-t-0 border-2 border-custom_border ${screenStyles.expandedTx}`}
          >
            <View className="flex-row items-center justify-between">
              <TextWithFont customStyle="text-sm text-white">
                TXid: {shortenTxId(item.tx_id)}
              </TextWithFont>
              <Pressable onPress={() => copyToClipboard(item.tx_id)} className="p-1">
                <Copy color="white" size={parseInt(screenStyles.copyIconSize)} strokeWidth={1.5} />
              </Pressable>
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <TextWithFont customStyle={`${screenStyles.sectionTitle} font-semibold text-white`}>
      {section.title}
    </TextWithFont>
  );

  return (
    <Wrapper>
      <View className={'flex-1 w-full h-full'}>
        <View className="flex-row justify-between items-center mb-4 border-b-2 border-gray-500 ">
          <TextWithFont customStyle={`${screenStyles.headerTitle} font-bold text-white mb-2`}>
            History
          </TextWithFont>
          <Pressable
            onPress={refreshTransactions}
            className={`rounded-full ${globalStyles.refreshIconSize}`}
          >
            <RefreshCw
              color="#FF4800"
              size={parseInt(globalStyles.refreshIconSize)}
              className="mb-2"
            />
          </Pressable>
        </View>
        {isLoadingWalletData || isLoadingTransactions ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#FF4800" />
            <TextWithFont customStyle="text-white mt-2">Loading</TextWithFont>
          </View>
        ) : errorWalletData || errorTransactions ? (
          <View className="flex-1 justify-center items-center">
            <TextWithFont customStyle="text-red-500 text-center">
              {errorWalletData || errorTransactions}
            </TextWithFont>
            <Pressable
              onPress={refreshTransactions}
              className={`mt-4 rounded-lg ${screenStyles.retryButton}`}
            >
              <TextWithFont customStyle="text-white">Retry</TextWithFont>
            </Pressable>
          </View>
        ) : transactions.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <TextWithFont customStyle="text-gray-400 text-center">No transactions</TextWithFont>
          </View>
        ) : (
          <SectionList
            sections={groupTransactionsByDate(transactions)}
            renderItem={renderTransaction}
            renderSectionHeader={renderSectionHeader}
            keyExtractor={item => item.tx_id}
            contentContainerStyle={{
              paddingBottom: 20,
              paddingHorizontal: 4,
            }}
          />
        )}
      </View>
    </Wrapper>
  );
}
