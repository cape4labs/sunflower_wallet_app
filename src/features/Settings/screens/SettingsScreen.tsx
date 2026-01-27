import { useRef, useState } from 'react';
import { Animated, View } from 'react-native';

import { Button } from '../../../shared/components/Button';
import Wrapper from '../../../shared/components/Wrapper';
import TextWithFont from '../../../shared/components/TextWithFont';
import AccordionItem from '../components/AccordionItem';
import MiniTabButton from '../components/MiniTabButton';
import NetworkToggleRow from '../components/NetworkToggleRow';

export default function SettingsScreen() {
  const [openId, setOpenId] = useState<string | null>(null);
  type AccordionId = 'display' | 'security' | 'networks' | 'help' | 'wallet';

  const [activeNetwork, setActiveNetwork] = useState<'mainnet' | 'testnet' | 'signet'>('mainnet');

  const handleNetworkToggle = (network: 'mainnet' | 'testnet' | 'signet') => {
    setActiveNetwork(network);
    console.log('Switched to:', network);
  };

  const heights = useRef<Record<AccordionId, number>>({
    display: 0,
    security: 0,
    networks: 0,
    help: 0,
    wallet: 0,
  }).current;

  const animatedValues = useRef<Record<AccordionId, Animated.Value>>({
    display: new Animated.Value(0),
    security: new Animated.Value(0),
    networks: new Animated.Value(0),
    help: new Animated.Value(0),
    wallet: new Animated.Value(0),
  }).current;

  const toggle = (id: AccordionId) => {
    const willOpen = openId !== id;
    setOpenId(willOpen ? id : null);

    (Object.keys(animatedValues) as AccordionId[]).forEach(key => {
      const target = willOpen && key === id ? heights[key] || 180 : 0;
      Animated.timing(animatedValues[key], {
        toValue: target,
        duration: 250,
        useNativeDriver: false,
      }).start();
    });
  };

  const setHeight = (id: AccordionId, height: number) => {
    heights[id] = height;
  };

  return (
    <Wrapper>
      <View className="flex-1 w-full">
        <View className="flex-row justify-between items-center pb-4 border-b-2 border-gray-500">
          <TextWithFont customStyle={`text-xl md:text-3xl font-bold text-white`}>
            Settings
          </TextWithFont>
        </View>
        <View className="md:mt-4 md:mb-2">
          <AccordionItem
            id="wallet"
            title="Wallets and accounts"
            subtitle="Add, configure and remove"
            iconName="User"
            direction="rigth"
            onToggle={() => { }}
            onLayoutHeight={() => { }}
            animatedHeight={animatedValues.wallet}
          />
        </View>
        <View className="border-t-2 border-gray-400 md:my-4" />
        <View className="max-h-[370px] overflow-hidden">
          <Animated.View
            style={{
              transform: [
                {
                  translateY: Animated.add(
                    Animated.add(
                      animatedValues.security.interpolate({
                        inputRange: [0, 250],
                        outputRange: [0, -80],
                        extrapolate: 'clamp',
                      }),
                      animatedValues.networks.interpolate({
                        inputRange: [0, 300],
                        outputRange: [0, -200],
                        extrapolate: 'clamp',
                      }),
                    ),
                    animatedValues.help.interpolate({
                      inputRange: [0, 300],
                      outputRange: [0, -300],
                      extrapolate: 'clamp',
                    }),
                  ),
                },
              ],
            }}
          >
            <AccordionItem
              id="display"
              title="Display"
              subtitle="Add, configure and remove"
              iconName="Display"
              isOpen={openId === 'display'}
              onToggle={() => toggle('display')}
              direction="left"
              animatedHeight={animatedValues.display}
              onLayoutHeight={h => setHeight('display', h)}
            >
              <View className="gap-4 py-3">
                <MiniTabButton title="Theme" value="Dark" iconName="Image" />
                <MiniTabButton title="Conversion unit" value="USD - $" iconName="Image" />
                <MiniTabButton
                  title="Account identifier"
                  value="Native Segwit addresst"
                  iconName="Image"
                />
              </View>
            </AccordionItem>

            <AccordionItem
              id="security"
              title="Security"
              subtitle="App protection"
              iconName="Security"
              isOpen={openId === 'security'}
              onToggle={() => toggle('security')}
              direction="left"
              animatedHeight={animatedValues.security}
              onLayoutHeight={h => setHeight('security', h)}
            >
              <View className="gap-4 py-3">
                <MiniTabButton title="Linked apps" value="Web3 interactions" iconName="Apps" />
                <MiniTabButton title="App authentification" value="Disabled" iconName="Lock" />
                <MiniTabButton title="Seed phrase" value="Keep it safe" iconName="Help" />
                <MiniTabButton title="Password" value="Change password" iconName="Pen" />
              </View>
            </AccordionItem>

            <AccordionItem
              id="networks"
              title="Networks"
              subtitle="Mainnet, testnet or signet"
              iconName="Globe"
              isOpen={openId === 'networks'}
              onToggle={() => toggle('networks')}
              direction="up"
              animatedHeight={animatedValues.networks}
              onLayoutHeight={h => setHeight('networks', h)}
            >
              <View className="gap-3 py-3">
                <NetworkToggleRow
                  title="Mainnet"
                  value={activeNetwork === 'mainnet' ? 'Enabled' : 'Disabled'}
                  iconName="Globe"
                  isEnabled={true}
                  isActive={activeNetwork === 'mainnet'}
                  onToggle={() => handleNetworkToggle('mainnet')}
                />
                <NetworkToggleRow
                  title="Testnet"
                  value={activeNetwork === 'testnet' ? 'Enabled' : 'Disabled'}
                  iconName="TestTube"
                  isEnabled={true}
                  isActive={activeNetwork === 'testnet'}
                  onToggle={() => handleNetworkToggle('testnet')}
                />
              </View>
            </AccordionItem>

            <AccordionItem
              id="help"
              title="Help"
              subtitle="Get support or provide feedback"
              iconName="Help"
              isOpen={openId === 'help'}
              onToggle={() => toggle('help')}
              direction="up"
              animatedHeight={animatedValues.help}
              onLayoutHeight={h => setHeight('help', h)}
            >
              <View className="gap-4 py-3">
                <MiniTabButton
                  title="Contact us"
                  value="Get support or provide feedback"
                  iconName="AtSign"
                />
                <MiniTabButton title="Guides" value="Dive into feature details" iconName="Plane" />
                <MiniTabButton
                  title="Learn"
                  value="Expand your Bitcoin knowledge"
                  iconName="Learn"
                />
                <MiniTabButton
                  title="Official links"
                  value="Sunflower Wallet official links"
                  iconName="Link"
                />
              </View>
            </AccordionItem>
          </Animated.View>
        </View>

        <View className="border-b-2 border-gray-400 md:pt-4 mt-auto pb-1 md:pb-4">
          <View className="mb-4">
            <TextWithFont customStyle="text-white text-sm md:text-base">Version</TextWithFont>
            <TextWithFont customStyle="text-gray-400 text-xs md:text-sm">
              0.2.0 / 16.01.2026
            </TextWithFont>
          </View>
          <View className="mb-6">
            <TextWithFont customStyle="text-white text-sm md:text-base">Device ID</TextWithFont>
            <TextWithFont customStyle="text-gray-400 text-xs md:text-sm">
              KJEHB_#WEJMKLJKJE-JK#EOEJ
            </TextWithFont>
          </View>
        </View>
        <View className="mt-4">
          <View className="items-center">
            <Button
              text="Lock app"
              customStyle="w-2/3 rounded-2xl md:p-3"
              onPress={() => { }}
            />
          </View>
        </View>
      </View>
    </Wrapper>
  );
}
