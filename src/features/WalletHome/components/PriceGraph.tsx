import { LineChart } from 'react-native-gifted-charts';
import { View } from 'react-native';
import { useWalletScreenStyles } from '../../../shared/hooks/useWalletScreenStyle';

type PriceGraphType = {
  lineData: { value: number }[] | null;
};

export default function PriceGraph({ lineData }: PriceGraphType) {
  // Default graph
  if (!lineData) {
    lineData = [
      { value: 50 },
      { value: 50 },
      { value: 50 },
      { value: 50 },
      { value: 50 },
      { value: 50 },
      { value: 50 },
      { value: 50 },
      { value: 50 },
      { value: 50 },
      { value: 50 },
      { value: 50 },
    ];
  }

  const styles = useWalletScreenStyles();

  return (
    <View className="bg-custom_complement rounded-xl p-0">
      <LineChart
        data={lineData}
        spacing={30}
        maxValue={100}
        thickness={3}
        curved={true}
        curvature={0.2}
        hideRules={true}
        hideYAxisText={true}
        hideAxesAndRules
        color="#FF5500"
        height={parseInt(styles.userGraph.height.replace(/[^\d]/g, ''))}
        initialSpacing={0}
        endSpacing={0}
        dataPointsRadius={0}
      />
    </View>
  );
}
