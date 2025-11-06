import { useState, useRef } from 'react';
import { View, Animated } from 'react-native';
import Wrapper from '../../../shared/components/Wrapper';
import TextWithFont from '../../../shared/components/TextWithFont';
import { useWalletScreenStyles } from '../../../shared/hooks/useWalletScreenStyle';
import { Button } from '../../../shared/components/Button';
import AccordionItem from '../components/AccordionItem';
import MiniTabButton from '../components/MiniTabButton';

export default function SettingsScreen() {
  const styles = useWalletScreenStyles();
  const globalStyles = styles.global;

  const [openId, setOpenId] = useState<string | null>(null);
  type AccordionId = 'display' | 'security' | 'networks' | 'help' | 'wallet';

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
      const target = (willOpen && key === id) ? (heights[key] || 180) : 0;
      Animated.timing(animatedValues[key], {
        toValue: target,
        duration: 350,
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
          <TextWithFont customStyle={`${globalStyles.title} font-bold text-white`}>
            Settings
          </TextWithFont>
        </View>
        <View className="mt-4 mb-2">
          <AccordionItem
            id="wallet"
            title="Wallets and accounts"
            subtitle="Add, configure and remove"
            iconName="User"
            isFirst
            direction='up'
            onToggle={() => {}}
            onLayoutHeight={() => {}}
            animatedHeight={animatedValues.wallet}
            
          />
        </View>
        <View className="border-t-2 border-gray-400 my-4" />
        <View className='max-h-[370px] overflow-hidden'>
         <Animated.View
            style={{
              transform: [
                {
                  translateY: Animated.add(
                    Animated.add(
                      animatedValues.security.interpolate({
                        inputRange: [0, 200],
                        outputRange: [0, -90],
                        extrapolate: 'clamp',
                      }),
                      animatedValues.networks.interpolate({
                        inputRange: [0, 100],
                        outputRange: [0, -200],
                        extrapolate: 'clamp',
                      })
                    ),
                    animatedValues.help.interpolate({
                      inputRange: [0, 100],
                      outputRange: [0, -300],
                      extrapolate: 'clamp',
                    })
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
              direction="down"
              animatedHeight={animatedValues.display}
              onLayoutHeight={(h) => setHeight('display', h)}
            >
              <View className="gap-4 py-3">
                <MiniTabButton title="Theme" value="Dark" iconName='Image' isFirst />
                <MiniTabButton title="Conversion unit" value="USD - $" iconName='image' />
                <MiniTabButton title="Account identifier" value="Native Segwit addresst" iconName='image' isLast />
              </View>
            </AccordionItem>

            <AccordionItem
              id="security"
              title="Security"
              subtitle="App protection"
              iconName="Security"
              isOpen={openId === 'security'}
              onToggle={() => toggle('security')}
              direction="down"
              animatedHeight={animatedValues.security}
              onLayoutHeight={(h) => setHeight('security', h)}
            >
              <View className="gap-4 py-3">
                <MiniTabButton title="Linked apps" value="Web3 interactions" iconName="" />
                <MiniTabButton title="App authentification" value="Disabled" iconName=''/>
                <MiniTabButton title="Seed phrase" value="Keep it safe" iconName="Help" />
                <MiniTabButton title="Password" value="Change password" iconName="password" />
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
              onLayoutHeight={(h) => setHeight('networks', h)}
            >
              <View className="gap-4 py-3">
                
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
              onLayoutHeight={(h) => setHeight('help', h)}
            >
              <View className="gap-4 py-3">
                <MiniTabButton title="Contact us" value="Get support or provide feedback" isFirst iconName=''/>
                <MiniTabButton title="Guides" value="Dive into feature details" iconName=''/>
                <MiniTabButton title="Learn" value="Expand your Bitcoin knowledge" iconName=''/>
                <MiniTabButton title="Official links" value="Sunflower Wallet official links" iconName='' isLast />
              </View>
            </AccordionItem>
          </Animated.View>
        </View>

        <View className="border-t-2 border-gray-400 pt-6 mt-auto">
          <View className="mb-4">
            <TextWithFont customStyle="text-white">Version</TextWithFont>
            <TextWithFont customStyle="text-gray-400">0.1.0 / 04.11.2025</TextWithFont>
          </View>
          <View className="mb-6">
            <TextWithFont customStyle="text-white">Device ID</TextWithFont>
            <TextWithFont customStyle="text-gray-400">KJEHB_#WEJMKLJKJE-JK#EOEJ</TextWithFont>
          </View>
          <View className="items-center">
            <Button text="Lock app" customStyle="w-2/3 rounded-2xl" onPress={() => {}} />
          </View>
        </View>
      </View>
    </Wrapper>
  );
}