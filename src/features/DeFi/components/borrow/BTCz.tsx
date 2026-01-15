import { useState, useEffect } from 'react';
import { View, TextInput, ActivityIndicator, Alert, Pressable } from 'react-native';
import {
    makeContractCall,
    broadcastTransaction,
    uintCV,
    bufferCV,
    contractPrincipalCV,
    PostConditionMode,
    Pc,
} from '@stacks/transactions';

import { Button } from '../../../WalletHome/components/Button';
import TextWithFont from '../../../../shared/components/TextWithFont';
import { useWalletPrivateData, useWalletData } from '../../../../shared/hooks/useWalletData';
import useWalletTokens from '../../../WalletHome/hooks/useWalletTokens';

type BTCzCardProps = {
    walletName: string;
};

// Zest Protocol BTCz Contracts (Need verification of mainnet addresses)
const BTCZ_CONTRACT_ADDRESS = 'SP2VCQYTC9SYVQ37Y3G6T08C6TYPPCQ086K3P6MB';
const BTCZ_CONTRACT_NAME = 'btcz-token';
const BTCZ_CORE_CONTRACT = 'pool-0-reserve';

export default function BTCzCard({ walletName }: BTCzCardProps) {
    const [btczAmount, setBtczAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [btczBalance, setBtczBalance] = useState('0.00');
    const [isWithdrawMode, setIsWithdrawMode] = useState(false);

    const { privateData } = useWalletPrivateData(walletName);
    const { walletData } = useWalletData(walletName);
    const { tokens } = useWalletTokens(null, walletData?.stxAddress || null, null);

    useEffect(() => {
        // Find BTCz in tokens
        const token = tokens.find(t => t.symbol === 'BTCz' || (t.key && t.key.includes('btcz')));
        if (token) {
            setBtczBalance(token.balance);
        }
    }, [tokens]);

    const stringToUint8Array = (str: string) => {
        const arr = new Uint8Array(str.length);
        for (let i = 0; i < str.length; i++) {
            arr[i] = str.charCodeAt(i);
        }
        return arr;
    };

    const handleWithdraw = async () => {
        if (!btczAmount || isNaN(Number(btczAmount))) {
            Alert.alert('Invalid Amount', 'Please enter a valid amount');
            return;
        }

        if (Number(btczAmount) > Number(btczBalance)) {
            Alert.alert('Insufficient Balance', 'You do not have enough BTCz');
            return;
        }

        if (!privateData?.stxPrivateKey || !walletData?.stxAddress) {
            Alert.alert('Error', 'Wallet data not found');
            return;
        }

        setIsSubmitting(true);
        try {
            const amountMicro = BigInt(Math.floor(Number(btczAmount) * 100_000_000)); // BTCz has 8 decimals

            // BTC Address for withdrawal (placeholder)
            const btcAddress = 'bc1q...placeholder';

            const txOptions = {
                contractAddress: BTCZ_CONTRACT_ADDRESS,
                contractName: BTCZ_CONTRACT_NAME,
                functionName: 'init-withdraw',
                functionArgs: [
                    bufferCV(stringToUint8Array(btcAddress)),
                    uintCV(amountMicro),
                ],
                senderKey: privateData.stxPrivateKey,
                validateWithAbi: true,
                network: 'mainnet',
                anchorMode: 1,
                postConditionMode: PostConditionMode.Allow,
            };

            const transaction = await makeContractCall(txOptions as any);
            const broadcastResponse = await broadcastTransaction({ transaction, network: 'mainnet' });

            if ('error' in broadcastResponse) {
                throw new Error(`${broadcastResponse.error} ${broadcastResponse.reason || ''}`);
            }

            Alert.alert('Success', `Withdrawal initiated: ${broadcastResponse.txid}`);
            setBtczAmount('');
        } catch (error) {
            console.error('BTCz Withdraw error:', error);
            Alert.alert('Transaction Failed', error instanceof Error ? error.message : String(error));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View className="bg-custom_complement p-4 rounded-xl border border-custom_border mt-4">
            <View className="mb-4">
                <TextWithFont customStyle="text-white text-sm">Protocol</TextWithFont>
                <TextWithFont customStyle="text-custom_accent text-lg font-bold">Zest BTCz</TextWithFont>
            </View>

            <View className="flex-row mb-6 bg-custom_background rounded-lg border border-custom_border overflow-hidden">
                <Pressable
                    onPress={() => setIsWithdrawMode(false)}
                    className={`flex-1 py-2 items-center ${!isWithdrawMode ? 'bg-custom_accent' : ''}`}
                >
                    <TextWithFont customStyle={`${!isWithdrawMode ? 'text-black font-bold' : 'text-white'}`}>Stake BTC</TextWithFont>
                </Pressable>
                <Pressable
                    onPress={() => setIsWithdrawMode(true)}
                    className={`flex-1 py-2 items-center ${isWithdrawMode ? 'bg-custom_accent' : ''}`}
                >
                    <TextWithFont customStyle={`${isWithdrawMode ? 'text-black font-bold' : 'text-white'}`}>Withdraw</TextWithFont>
                </Pressable>
            </View>

            {!isWithdrawMode ? (
                <View>
                    <TextWithFont customStyle="text-gray-400 text-xs mb-4">
                        To mint BTCz, you need to send native Bitcoin to the Zest Protocol peg-in address.
                    </TextWithFont>
                    <Button
                        text="Deposit BTC"
                        onPress={() => Alert.alert('Deposit', 'Direct BTC deposit not yet implemented in UI. Use Zest Protocol web app.')}
                        accent
                        iconName="Upload"
                    />
                </View>
            ) : (
                <View className="space-y-4">
                    <View>
                        <View className="flex-row justify-between mb-2">
                            <TextWithFont customStyle="text-white">Amount (BTCz)</TextWithFont>
                            <TextWithFont customStyle="text-gray-400 text-xs">Bal: {btczBalance}</TextWithFont>
                        </View>
                        <View className="flex-row items-center space-x-2">
                            <TextInput
                                className="flex-1 bg-custom_background text-white p-3 rounded-lg border border-custom_border"
                                placeholder="0.0"
                                placeholderTextColor="#666"
                                keyboardType="numeric"
                                value={btczAmount}
                                onChangeText={setBtczAmount}
                            />
                            <Button text="MAX" onPress={() => setBtczAmount(btczBalance)} customStyle="w-12 h-12" iconName="PlusCircle" />
                        </View>
                    </View>

                    <View className="mt-6">
                        {isSubmitting ? (
                            <ActivityIndicator color="#FF5500" />
                        ) : (
                            <Button text="Withdraw to BTC" onPress={handleWithdraw} accent iconName="RefreshCw" />
                        )}
                    </View>
                </View>
            )}

            <TextWithFont customStyle="text-gray-400 text-[10px] mt-4 text-center">
                BTCz is yield-bearing Bitcoin on Stacks. Values grow over time.
            </TextWithFont>
        </View>
    );
}