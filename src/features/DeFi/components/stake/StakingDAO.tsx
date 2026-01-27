import {
  Pc,
  PostConditionMode,
  broadcastTransaction,
  contractPrincipalCV,
  makeContractCall,
  noneCV,
  uintCV,
} from '@stacks/transactions';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, TextInput, View } from 'react-native';

import { Button } from '../../../../shared/components/Button';
import TextWithFont from '../../../../shared/components/TextWithFont';
import { useWalletData, useWalletPrivateData } from '../../../../shared/hooks/useWalletData';
import useWalletTokens from '../../../WalletHome/hooks/useWalletTokens';

type StackingDaoCardProps = {
  walletName: string;
};

// I think need to move this to config
const STACKING_DAO_ADDRESS = 'SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG';
const CORE_CONTRACT = 'stacking-dao-core-v6';

export default function StackingDaoCard({ walletName }: StackingDaoCardProps) {
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [stxBalance, setStxBalance] = useState('0.00');
  const [stStxBalance, setStStxBalance] = useState('0.00');
  const [exchangeRate, setExchangeRate] = useState('1.00'); // stSTX per STX
  const [isWithdrawMode, setIsWithdrawMode] = useState(false);

  // I don't know where this is coming from
  const [apy, setApy] = useState('~8.81%');

  const { privateData } = useWalletPrivateData(walletName);
  const { walletData } = useWalletData(walletName);

  const { tokens } = useWalletTokens(null, walletData?.stxAddress || null, null);

  // Get STX and stSTX balances from cached tokens
  useEffect(() => {
    const stx = tokens.find(t => t.symbol === 'STX');
    const stSTX = tokens.find(t => t.symbol === 'stSTX');
    if (stx) setStxBalance(stx.balance);
    if (stSTX) setStStxBalance(stSTX.balance);
  }, [tokens]);

  const handleStake = async () => {
    if (!amount || isNaN(Number(amount))) {
      Alert.alert('Invalid Amount', 'Please enter a valid STX amount');
      return;
    }
    if (Number(amount) > Number(stxBalance)) {
      Alert.alert('Insufficient Balance', 'You do not have enough STX');
      return;
    }
    if (!privateData?.stxPrivateKey || !walletData?.stxAddress) {
      Alert.alert('Error', 'Wallet data or private key not found');
      return;
    }

    setIsSubmitting(true);
    try {
      const amountMicroSTX = BigInt(Math.floor(Number(amount) * 1_000_000));
      const stxPostCondition = Pc.principal(walletData.stxAddress)
        .willSendEq(amountMicroSTX)
        .ustx();

      const txOptions = {
        contractAddress: STACKING_DAO_ADDRESS,
        contractName: CORE_CONTRACT,
        functionName: 'deposit',
        functionArgs: [
          contractPrincipalCV(STACKING_DAO_ADDRESS, 'reserve-v1'),
          contractPrincipalCV(STACKING_DAO_ADDRESS, 'commission-v2'),
          contractPrincipalCV(STACKING_DAO_ADDRESS, 'staking-v0'),
          contractPrincipalCV(STACKING_DAO_ADDRESS, 'direct-helpers-v4'),
          uintCV(amountMicroSTX),
          noneCV(), // referrer
          noneCV(), // pool
        ],
        senderKey: privateData.stxPrivateKey,
        validateWithAbi: true,
        network: 'mainnet' as 'mainnet',
        anchorMode: 1,
        postConditionMode: PostConditionMode.Allow,
        postConditions: [stxPostCondition],
      };

      const transaction = await makeContractCall(txOptions);
      const broadcastResponse = await broadcastTransaction({ transaction, network: 'mainnet' });

      if ('error' in broadcastResponse) {
        throw new Error(broadcastResponse.reason);
      }

      Alert.alert('Success', `Transaction broadcasted: ${broadcastResponse.txid}`);
      setAmount('');
    } catch (error) {
      console.error(error);
      Alert.alert('Transaction Failed', (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnstake = async () => {
    if (!amount || isNaN(Number(amount))) {
      Alert.alert('Invalid Amount', 'Please enter a valid stSTX amount');
      return;
    }
    if (Number(amount) > Number(stStxBalance)) {
      Alert.alert('Insufficient Balance', 'You do not have enough stSTX');
      return;
    }
    if (!privateData?.stxPrivateKey || !walletData?.stxAddress) {
      Alert.alert('Error', 'Wallet data or private key not found');
      return;
    }

    setIsSubmitting(true);
    try {
      const amountMicro = BigInt(Math.floor(Number(amount) * 1_000_000));
      const ststxFullId = `${STACKING_DAO_ADDRESS}.ststx-token`;

      const postConditions = [
        Pc.principal(walletData.stxAddress)
          .willSendEq(amountMicro)
          .ft(ststxFullId, 'ststx'),
      ];

      const txOptions = {
        contractAddress: STACKING_DAO_ADDRESS,
        contractName: CORE_CONTRACT,
        functionName: 'withdraw-idle',
        functionArgs: [
          contractPrincipalCV(STACKING_DAO_ADDRESS, 'reserve-v1'),
          contractPrincipalCV(STACKING_DAO_ADDRESS, 'direct-helpers-v4'),
          contractPrincipalCV(STACKING_DAO_ADDRESS, 'commission-v2'),
          contractPrincipalCV(STACKING_DAO_ADDRESS, 'staking-v0'),
          uintCV(amountMicro),
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
        throw new Error(broadcastResponse.reason);
      }

      Alert.alert('Success', `Instant withdrawal initiated: ${broadcastResponse.txid}`);
      setAmount('');
    } catch (error) {
      console.error(error);
      Alert.alert('Transaction Failed', (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="bg-custom_complement nd p-4 rounded-xl border border-custom_border mt-4">
      <View className="flex-row justify-between mb-4">
        <View>
          <TextWithFont customStyle="text-white text-sm">APY</TextWithFont>
          <TextWithFont customStyle="text-green-400 text-lg font-bold">{apy}</TextWithFont>
        </View>
        <View>
          <TextWithFont customStyle="text-white text-sm text-right">Holdings</TextWithFont>
          <TextWithFont customStyle="text-white text-lg font-bold text-right">
            {isLoadingData ? 'Loading...' : `${stStxBalance} stSTX`}
          </TextWithFont>
        </View>
      </View>

      <View className="flex-row mt-2 bg-custom_background rounded-lg border border-custom_border overflow-hidden mb-4">
        <Pressable
          onPress={() => { setIsWithdrawMode(false); setAmount(''); }}
          className={`flex-1 py-2 items-center ${!isWithdrawMode ? 'bg-custom_accent' : ''}`}
        >
          <TextWithFont customStyle={`${!isWithdrawMode ? 'text-black font-bold' : 'text-white'}`}>
            Stake
          </TextWithFont>
        </Pressable>
        <Pressable
          onPress={() => { setIsWithdrawMode(true); setAmount(''); }}
          className={`flex-1 py-2 items-center ${isWithdrawMode ? 'bg-custom_accent' : ''}`}
        >
          <TextWithFont customStyle={`${isWithdrawMode ? 'text-black font-bold' : 'text-white'}`}>
            Unstake
          </TextWithFont>
        </Pressable>
      </View>

      <TextWithFont customStyle="text-white mb-2">
        {isWithdrawMode ? 'Amount to Unstake (stSTX)' : 'Amount to Stake (STX)'}
      </TextWithFont>

      <View className="flex-row items-center space-x-2 mb-4">
        <TextInput
          className="flex-1 bg-custom_background text-white p-3 rounded-lg border border-custom_border"
          placeholder="0.0"
          placeholderTextColor="#666"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <Button
          text="MAX"
          onPress={() => setAmount(isWithdrawMode ? stStxBalance : stxBalance)}
          customStyle="w-12 h-12"
          iconName="PlusCircle"
        />
      </View>
      <TextWithFont customStyle="text-gray-400 text-xs mb-4 text-right">
        Balance: {isWithdrawMode ? `${stStxBalance} stSTX` : `${stxBalance} STX`}
      </TextWithFont>

      {isSubmitting ? (
        <ActivityIndicator color="#FF5500" />
      ) : (
        <Button
          text={isWithdrawMode ? "Unstake stSTX" : "Deposit STX"}
          onPress={isWithdrawMode ? handleUnstake : handleStake}
          accent
          iconName={isWithdrawMode ? "RefreshCw" : "DatabaseIcon"}
        />
      )}

      <TextWithFont customStyle="text-gray-400 text-xs mt-2 text-center">
        1 stSTX = {exchangeRate} STX
      </TextWithFont>
    </View>
  );
}
