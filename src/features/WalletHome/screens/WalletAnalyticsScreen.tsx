import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

import TextWithFont from '../../../shared/components/TextWithFont';
import Wrapper from '../../../shared/components/Wrapper';
import { useWalletData } from '../../../shared/hooks/useWalletData';
import { Token } from '../../../shared/types/Token';
import shortenAddress from '../../../shared/utils/shortAddress';
import { getWalletList } from '../../../shared/walletPersitance';
import usePriceHistory from '../hooks/usePriceHistory';
import useWalletTokens from '../hooks/useWalletTokens';

// Orange-vibe color palette for tokens
const TOKEN_COLORS: Record<string, string> = {
    BTC: '#FF5500',
    STX: '#FF8C42',
    sBTC: '#F7931A',
    ALEX: '#FF6B35',
    ststx: '#E85D04',
    default: '#DC5A00',
};

const getTokenColor = (symbol: string, index: number): string => {
    if (TOKEN_COLORS[symbol]) return TOKEN_COLORS[symbol];
    // Fallback: generate orange-ish color based on index
    const hue = 20 + (index * 15) % 40; // 20-60 range (orange to yellow-orange)
    return `hsl(${hue}, 90%, 50%)`;
};

export default function WalletAnalyticsScreen() {
    const navigation = useNavigation();
    const [walletList, setWalletList] = useState<string[]>([]);
    const [expandedWallet, setExpandedWallet] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [walletBalances, setWalletBalances] = useState<Record<string, number>>({});

    useEffect(() => {
        const loadWallets = async () => {
            try {
                const list = await getWalletList();
                setWalletList(list);
            } catch (err) {
                console.error('Failed to load wallets:', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadWallets();
    }, []);

    const toggleWallet = (walletName: string) => {
        setExpandedWallet(expandedWallet === walletName ? null : walletName);
    };

    const updateWalletBalance = useCallback((walletName: string, balance: number) => {
        setWalletBalances(prev => {
            if (prev[walletName] === balance) return prev;
            return { ...prev, [walletName]: balance };
        });
    }, []);

    const portfolioTotal = Object.values(walletBalances).reduce((sum, b) => sum + b, 0);

    if (isLoading) {
        return (
            <Wrapper>
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#FF5500" />
                </View>
            </Wrapper>
        );
    }

    return (
        <Wrapper>
            <View className="flex-1 w-full">
                {/* Header */}
                <View className="flex-row items-center justify-between pb-4 border-b-2 border-gray-500">
                    <Pressable onPress={() => navigation.goBack()}>
                        <ArrowLeft color="#FF5500" size={24} />
                    </Pressable>
                    <TextWithFont customStyle="text-xl md:text-3xl text-white">
                        Wallets
                    </TextWithFont>
                    <View className="w-6" />
                </View>

                {/* Portfolio Total */}
                <View className="mt-4 md:mt-6 mb-4">
                    <TextWithFont customStyle="text-gray-400 text-sm md:text-base">Portfolio</TextWithFont>
                    <TextWithFont customStyle="text-white text-2xl md:text-4xl font-bold">
                        ${portfolioTotal.toFixed(2)}
                    </TextWithFont>
                </View>

                {/* Wallets List */}
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {walletList.map(walletName => (
                        <WalletCardContainer
                            key={walletName}
                            walletName={walletName}
                            isExpanded={expandedWallet === walletName}
                            onToggle={() => toggleWallet(walletName)}
                            onBalanceLoaded={(balance) => updateWalletBalance(walletName, balance)}
                        />
                    ))}
                </ScrollView>
            </View>
        </Wrapper>
    );
}

interface WalletCardContainerProps {
    walletName: string;
    isExpanded: boolean;
    onToggle: () => void;
    onBalanceLoaded: (balance: number) => void;
}

function WalletCardContainer({ walletName, isExpanded, onToggle, onBalanceLoaded }: WalletCardContainerProps) {
    const { walletData, isLoadingWalletData } = useWalletData(walletName);
    const priceHistory = usePriceHistory();
    const { tokens, walletBalance, tokenLoading } = useWalletTokens(
        priceHistory.data || null,
        walletData?.stxAddress,
        walletData?.btcAddress,
    );
    const reportedBalance = useRef<number | null>(null);

    // Report balance to parent when loaded (only once per value change)
    useEffect(() => {
        const balance = Number(walletBalance);
        if (!tokenLoading && walletBalance && reportedBalance.current !== balance) {
            reportedBalance.current = balance;
            onBalanceLoaded(balance);
        }
    }, [walletBalance, tokenLoading]);

    if (isLoadingWalletData || tokenLoading) {
        return (
            <View className="mb-3 md:mb-4">
                <TextWithFont customStyle="text-white text-base md:text-lg font-semibold mb-2">
                    {walletName}
                </TextWithFont>
                <View className="bg-custom_complement rounded-2xl p-4 border-2 border-custom_border items-center">
                    <ActivityIndicator size="small" color="#FF5500" />
                </View>
            </View>
        );
    }

    // Transform tokens for display with colors and percentages
    const totalUsd = tokens.reduce((sum, t) => sum + Number(t.balanceUsd || 0), 0);

    const displayTokens = tokens
        .filter(t => !t.isDeFi && Number(t.balanceUsd) > 0)
        .map((token, index) => ({
            symbol: token.symbol,
            name: token.name,
            percentage: totalUsd > 0 ? Math.round((Number(token.balanceUsd) / totalUsd) * 100) : 0,
            amount: Number(token.balanceUsd),
            color: getTokenColor(token.symbol, index),
        }));

    return (
        <WalletCard
            name={walletName}
            address={walletData?.stxAddress || ''}
            total={Number(walletBalance)}
            tokens={displayTokens}
            isExpanded={isExpanded}
            onToggle={onToggle}
        />
    );
}

interface WalletCardProps {
    name: string;
    address: string;
    total: number;
    tokens: Array<{
        symbol: string;
        name: string;
        percentage: number;
        amount: number;
        color: string;
    }>;
    isExpanded: boolean;
    onToggle: () => void;
}

function WalletCard({ name, address, total, tokens, isExpanded, onToggle }: WalletCardProps) {
    const pieData = tokens.map(token => ({
        value: token.percentage || 1,
        color: token.color,
    }));

    const ArrowIcon = isExpanded ? ChevronUp : ChevronDown;

    return (
        <View className="mb-3 md:mb-4">
            {/* Wallet Header */}
            <Pressable onPress={onToggle} className="flex-row items-center justify-between mb-2">
                <TextWithFont customStyle="text-white text-base md:text-lg font-semibold">
                    {name}
                </TextWithFont>
                <ArrowIcon color="#fff" size={20} />
            </Pressable>

            {/* Wallet Content Card */}
            <View className="bg-[#202020] rounded-2xl p-3 md:p-4 border-2 border-white">
                <View className="flex-row items-center">
                    {/* Pie Chart */}
                    <View className="mr-3 md:mr-4">
                        {pieData.length > 0 ? (
                            <PieChart
                                data={pieData}
                                donut
                                radius={isExpanded ? 50 : 22}
                                innerRadius={isExpanded ? 32 : 12}
                                innerCircleColor="#3E3632"
                                strokeColor="#3E3632"
                                strokeWidth={2}
                            />
                        ) : (
                            <View
                                className="rounded-full bg-gray-600"
                                style={{ width: isExpanded ? 100 : 34, height: isExpanded ? 100 : 34 }}
                            />
                        )}
                    </View>

                    {/* Token Info */}
                    <View className="flex-1">
                        {isExpanded ? (
                            // Expanded: Show full details
                            <>
                                {tokens.map((token, index) => (
                                    <View key={index} className="flex-row items-center mb-1.5">
                                        <View
                                            className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full mr-2"
                                            style={{ backgroundColor: token.color }}
                                        />
                                        <TextWithFont customStyle="text-white text-xs md:text-sm flex-1">
                                            {token.name}
                                        </TextWithFont>
                                        <TextWithFont customStyle="text-white text-xs md:text-sm mr-3">
                                            {token.percentage}%
                                        </TextWithFont>
                                        <TextWithFont customStyle="text-white text-xs md:text-sm">
                                            ${token.amount.toFixed(0)}
                                        </TextWithFont>
                                    </View>
                                ))}
                            </>
                        ) : (
                            // Collapsed: Show only amounts
                            <View className="flex-row items-center flex-wrap gap-2">
                                {tokens.map((token, index) => (
                                    <View key={index} className="flex-row items-center">
                                        <View
                                            className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full mr-1"
                                            style={{ backgroundColor: token.color }}
                                        />
                                        <TextWithFont customStyle="text-white text-xs md:text-sm">
                                            ${token.amount.toFixed(0)}
                                        </TextWithFont>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Right Side: Address + Total */}
                    <View className="items-end ml-3">
                        <TextWithFont customStyle="text-white text-[10px] md:text-xs mb-1">
                            {shortenAddress(address)}
                        </TextWithFont>
                        <TextWithFont customStyle="text-white text-sm md:text-base font-semibold">
                            ${total.toFixed(2)}
                        </TextWithFont>
                    </View>
                </View>
            </View>
        </View>
    );
}