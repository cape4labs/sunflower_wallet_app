import {
  Pc,
  PostConditionMode,
  broadcastTransaction,
  contractPrincipalCV,
  makeContractCall,
  uintCV,
} from '@stacks/transactions';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, TextInput, View } from 'react-native';

import TextWithFont from '../../../../shared/components/TextWithFont';
import { useWalletData, useWalletPrivateData } from '../../../../shared/hooks/useWalletData';
import { Button } from '../../../WalletHome/components/Button';
import useWalletTokens from '../../../WalletHome/hooks/useWalletTokens';

type BitflowPoolCardProps = {
  walletName: string;
};

// Bitflow Mainnet Contracts
const CORE_CONTRACT_ADDRESS = 'SM1793C4R5PZ4NS4VQ4WMP7SKKYVH8JZEWSZ9HCCR';
const CORE_CONTRACT_NAME = 'stableswap-core-v-1-4';
const POOL_CONTRACT_NAME = 'stableswap-pool-stx-ststx-v-1-4';
const TOKEN_X_NAME = 'token-stx-v-1-2'; // STX Wrapper
const TOKEN_Y_ADDRESS = 'SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG';
const TOKEN_Y_NAME = 'ststx-token';

const BITFLOW_API_TICKER = 'https://bitflow-sdk-api-gateway-7owjsmt8.uc.gateway.dev/ticker';

interface PoolStats {
  tvl: number;
  volume24h: number;
  stxPrice: number;
}

export default function BitflowPoolCard({ walletName }: BitflowPoolCardProps) {
  const [stxAmount, setStxAmount] = useState('');
  const [ststxAmount, setStstxAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stxBalance, setStxBalance] = useState('0.00');
  const [ststxBalance, setStstxBalance] = useState('0.00');
  const [lpBalance, setLpBalance] = useState('0.00');
  const [lpAmount, setLpAmount] = useState('');
  const [stats, setStats] = useState<PoolStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isWithdrawMode, setIsWithdrawMode] = useState(false);

  const { privateData } = useWalletPrivateData(walletName);
  const { walletData } = useWalletData(walletName);
  const { tokens } = useWalletTokens(null, walletData?.stxAddress || null, null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(BITFLOW_API_TICKER);
        const data = await res.json();

        // Find STX-stSTX pool (v-1-4)
        const poolData = data.find(
          (p: any) => p.pool_id === `${CORE_CONTRACT_ADDRESS}.${POOL_CONTRACT_NAME}`,
        );

        if (poolData) {
          setStats({
            tvl: poolData.liquidity_in_usd,
            volume24h: poolData.base_volume, // base_volume is in STX? ticker data shows last_price too
            stxPrice: 1.0, // We assume STX as base for now or fetch elsewhere if needed
          });
        }
      } catch (error) {
        console.error('Error fetching Bitflow pool data:', error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();

    const stx = tokens.find(t => t.symbol === 'STX');
    const ststx = tokens.find(t => t.symbol === 'stSTX');
    const lpToken = tokens.find(
      t =>
        t.key === `${CORE_CONTRACT_ADDRESS}.${POOL_CONTRACT_NAME}::pool-token` ||
        t.symbol === 'STX-stSTX-LP',
    );

    if (stx) setStxBalance(stx.balance);
    if (ststx) setStstxBalance(ststx.balance);
    if (lpToken) setLpBalance(lpToken.balance);
  }, [tokens]);

  const handleStxAmountChange = (val: string) => {
    setStxAmount(val);
    if (stats && stats.stxPrice > 0) {
      const num = Number(val.replace(',', '.'));
      if (!isNaN(num) && num > 0) {
        // ticker last_price is target/base. base=STX, target=stSTX.
        // so 1 STX = stats.stxPrice stSTX
        const needed = num * stats.stxPrice;
        setStstxAmount(needed.toFixed(6));
      }
    } else {
      setStstxAmount(val);
    }
  };

  const handleStstxAmountChange = (val: string) => {
    setStstxAmount(val);
    if (stats && stats.stxPrice > 0) {
      const num = Number(val.replace(',', '.'));
      if (!isNaN(num) && num > 0) {
        // 1 STX = price stSTX => 1 stSTX = 1/price STX
        const needed = num / stats.stxPrice;
        setStxAmount(needed.toFixed(6));
      }
    } else {
      setStxAmount(val);
    }
  };

  const safeLog = (message: string, obj?: any) => {
    try {
      if (obj) {
        const sanitized = JSON.parse(
          JSON.stringify(obj, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value,
          ),
        );
        console.log(message, sanitized);
      } else {
        console.log(message);
      }
    } catch (e) {
      console.log(message, '[Unserializable Object]');
    }
  };

  const handleAddLiquidity = async () => {
    if (!stxAmount || isNaN(Number(stxAmount)) || !ststxAmount || isNaN(Number(ststxAmount))) {
      Alert.alert('Invalid Amount', 'Please enter valid STX and stSTX amounts');
      return;
    }

    if (Number(stxAmount) > Number(stxBalance) || Number(ststxAmount) > Number(ststxBalance)) {
      Alert.alert('Insufficient Balance', 'You do not have enough tokens');
      return;
    }

    if (!privateData?.stxPrivateKey || !walletData?.stxAddress) {
      Alert.alert('Error', 'Wallet data not found');
      return;
    }

    setIsSubmitting(true);
    safeLog('Starting Bitflow Add Liquidity transaction...');
    try {
      const xAmountMicro = BigInt(Math.floor(Number(stxAmount) * 1_000_000));
      const yAmountMicro = BigInt(Math.floor(Number(ststxAmount) * 1_000_000));

      // Increase slippage to 10% for safety (0.9)
      const minDlp = ((xAmountMicro + yAmountMicro) * BigInt(90)) / BigInt(100);

      const ststxFullId = `${TOKEN_Y_ADDRESS}.${TOKEN_Y_NAME}`;

      const postConditions = [
        Pc.principal(walletData.stxAddress).willSendLte(xAmountMicro).ustx(),
        Pc.principal(walletData.stxAddress).willSendLte(yAmountMicro).ft(ststxFullId, 'ststx'),
      ];

      const txOptions = {
        contractAddress: CORE_CONTRACT_ADDRESS,
        contractName: CORE_CONTRACT_NAME,
        functionName: 'add-liquidity',
        functionArgs: [
          contractPrincipalCV(CORE_CONTRACT_ADDRESS, POOL_CONTRACT_NAME),
          contractPrincipalCV(CORE_CONTRACT_ADDRESS, TOKEN_X_NAME),
          contractPrincipalCV(TOKEN_Y_ADDRESS, TOKEN_Y_NAME),
          uintCV(xAmountMicro),
          uintCV(yAmountMicro),
          uintCV(minDlp),
        ],
        senderKey: privateData.stxPrivateKey,
        validateWithAbi: true,
        network: 'mainnet',
        anchorMode: 1,
        postConditionMode: PostConditionMode.Allow,
        postConditions,
      };

      const transaction = await makeContractCall(txOptions as any);
      const broadcastResponse = await broadcastTransaction({ transaction, network: 'mainnet' });

      if ('error' in broadcastResponse) {
        throw new Error(`${broadcastResponse.error} ${broadcastResponse.reason || ''}`);
      }

      Alert.alert('Success', `Transaction broadcasted: ${broadcastResponse.txid}`);
      setStxAmount('');
      setStstxAmount('');
    } catch (error) {
      safeLog('Error in handleAddLiquidity:', error);
      Alert.alert('Transaction Failed', error instanceof Error ? error.message : String(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWithdrawLiquidity = async () => {
    if (!lpAmount || isNaN(Number(lpAmount))) {
      Alert.alert('Invalid Amount', 'Please enter a valid LP amount');
      return;
    }

    if (Number(lpAmount) > Number(lpBalance)) {
      Alert.alert('Insufficient Balance', 'You do not have enough LP tokens');
      return;
    }

    if (!privateData?.stxPrivateKey || !walletData?.stxAddress) {
      Alert.alert('Error', 'Wallet data not found');
      return;
    }

    setIsSubmitting(true);
    safeLog('Starting Bitflow Withdraw Liquidity transaction...');
    try {
      const amountMicro = BigInt(Math.floor(Number(lpAmount) * 1_000_000));

      // Estimate min-x and min-y with high slippage for safety (10%)
      // Since it's stableswap 50/50, it's ~ amount / 2
      const minX = ((amountMicro / BigInt(2)) * BigInt(90)) / BigInt(100);
      const minY = ((amountMicro / BigInt(2)) * BigInt(90)) / BigInt(100);

      const lpFullId = `${CORE_CONTRACT_ADDRESS}.${POOL_CONTRACT_NAME}::pool-token`;
      const ststxFullId = `${TOKEN_Y_ADDRESS}.${TOKEN_Y_NAME}`;

      const postConditions = [
        Pc.principal(walletData.stxAddress).willSendEq(amountMicro).ft(lpFullId, 'pool-token'),
      ];

      const txOptions = {
        contractAddress: CORE_CONTRACT_ADDRESS,
        contractName: CORE_CONTRACT_NAME,
        functionName: 'withdraw-proportional-liquidity',
        functionArgs: [
          contractPrincipalCV(CORE_CONTRACT_ADDRESS, POOL_CONTRACT_NAME),
          contractPrincipalCV(CORE_CONTRACT_ADDRESS, TOKEN_X_NAME),
          contractPrincipalCV(TOKEN_Y_ADDRESS, TOKEN_Y_NAME),
          uintCV(amountMicro),
          uintCV(minX),
          uintCV(minY),
        ],
        senderKey: privateData.stxPrivateKey,
        validateWithAbi: true,
        network: 'mainnet',
        anchorMode: 1,
        postConditionMode: PostConditionMode.Allow,
        postConditions,
      };

      const transaction = await makeContractCall(txOptions as any);
      const broadcastResponse = await broadcastTransaction({ transaction, network: 'mainnet' });

      if ('error' in broadcastResponse) {
        throw new Error(`${broadcastResponse.error} ${broadcastResponse.reason || ''}`);
      }

      Alert.alert('Success', `Transaction broadcasted: ${broadcastResponse.txid}`);
      setLpAmount('');
    } catch (error) {
      safeLog('Error in handleWithdrawLiquidity:', error);
      Alert.alert('Transaction Failed', error instanceof Error ? error.message : String(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="bg-custom_complement p-4 rounded-xl border border-custom_border mt-4">
      <View className="mb-4 flex-row justify-between items-start">
        <View>
          <TextWithFont customStyle="text-white text-sm">Pool Type</TextWithFont>
          <TextWithFont customStyle="text-custom_accent text-lg font-bold">
            Bitflow STX-stSTX
          </TextWithFont>
        </View>
        <View className="items-end">
          {isLoadingStats ? (
            <ActivityIndicator size="small" color="#FF5500" />
          ) : stats ? (
            <View className="items-end">
              <TextWithFont customStyle="text-green-400 text-sm font-bold">
                Proportional
              </TextWithFont>
              <TextWithFont customStyle="text-gray-400 text-xs">
                TVL: ${stats.tvl.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </TextWithFont>
            </View>
          ) : null}
        </View>
      </View>

      <View className="flex-row mt-4 bg-custom_background rounded-lg border border-custom_border overflow-hidden">
        <Pressable
          onPress={() => setIsWithdrawMode(false)}
          className={`flex-1 py-2 items-center ${!isWithdrawMode ? 'bg-custom_accent' : ''}`}
        >
          <TextWithFont customStyle={`${!isWithdrawMode ? 'text-black font-bold' : 'text-white'}`}>
            Deposit
          </TextWithFont>
        </Pressable>
        <Pressable
          onPress={() => setIsWithdrawMode(true)}
          className={`flex-1 py-2 items-center ${isWithdrawMode ? 'bg-custom_accent' : ''}`}
        >
          <TextWithFont customStyle={`${isWithdrawMode ? 'text-black font-bold' : 'text-white'}`}>
            Withdraw
          </TextWithFont>
        </Pressable>
      </View>

      {!isWithdrawMode ? (
        <View className="space-y-4 mt-4">
          <View>
            <View className="flex-row justify-between mb-2">
              <TextWithFont customStyle="text-white">Amount (STX)</TextWithFont>
              <TextWithFont customStyle="text-gray-400 text-xs">Bal: {stxBalance}</TextWithFont>
            </View>
            <View className="flex-row items-center space-x-2">
              <TextInput
                className="flex-1 bg-custom_background text-white p-3 rounded-lg border border-custom_border"
                placeholder="0.0"
                placeholderTextColor="#666"
                keyboardType="numeric"
                value={stxAmount}
                onChangeText={handleStxAmountChange}
              />
              <Button
                text="MAX"
                onPress={() => handleStxAmountChange(stxBalance)}
                customStyle="w-12 h-12"
                iconName="PlusCircle"
              />
            </View>
          </View>

          <View className="mt-4">
            <View className="flex-row justify-between mb-2">
              <TextWithFont customStyle="text-white">Amount (stSTX)</TextWithFont>
              <TextWithFont customStyle="text-gray-400 text-xs">Bal: {ststxBalance}</TextWithFont>
            </View>
            <View className="flex-row items-center space-x-2">
              <TextInput
                className="flex-1 bg-custom_background text-white p-3 rounded-lg border border-custom_border"
                placeholder="0.0"
                placeholderTextColor="#666"
                keyboardType="numeric"
                value={ststxAmount}
                onChangeText={handleStstxAmountChange}
              />
              <Button
                text="MAX"
                onPress={() => handleStstxAmountChange(ststxBalance)}
                customStyle="w-12 h-12"
                iconName="PlusCircle"
              />
            </View>
          </View>

          <View className="mt-6">
            {isSubmitting ? (
              <ActivityIndicator color="#FF5500" />
            ) : (
              <Button
                text="Add Liquidity"
                onPress={handleAddLiquidity}
                accent
                iconName="DatabaseIcon"
              />
            )}
          </View>
        </View>
      ) : (
        <View className="space-y-4 mt-4">
          <View>
            <View className="flex-row justify-between mb-2">
              <TextWithFont customStyle="text-white">LP Tokens to Withdraw</TextWithFont>
              <TextWithFont customStyle="text-gray-400 text-xs">Bal: {lpBalance}</TextWithFont>
            </View>
            <View className="flex-row items-center space-x-2">
              <TextInput
                className="flex-1 bg-custom_background text-white p-3 rounded-lg border border-custom_border"
                placeholder="0.0"
                placeholderTextColor="#666"
                keyboardType="numeric"
                value={lpAmount}
                onChangeText={setLpAmount}
              />
              <Button
                text="MAX"
                onPress={() => setLpAmount(lpBalance)}
                customStyle="w-12 h-12"
                iconName="PlusCircle"
              />
            </View>
            <TextWithFont customStyle="text-gray-400 text-[10px] mt-2">
              You will receive ~{(Number(lpAmount || 0) / 2).toFixed(4)} STX and ~
              {(Number(lpAmount || 0) / 2).toFixed(4)} stSTX
            </TextWithFont>
          </View>

          <View className="mt-6">
            {isSubmitting ? (
              <ActivityIndicator color="#FF5500" />
            ) : (
              <Button
                text="Withdraw Liquidity"
                onPress={handleWithdrawLiquidity}
                accent
                iconName="RefreshCw"
              />
            )}
          </View>
        </View>
      )}

      <TextWithFont customStyle="text-gray-400 text-xs mt-4 text-center">
        Bitflow Stableswap Pool • Low Slippage
      </TextWithFont>
    </View>
  );
}
