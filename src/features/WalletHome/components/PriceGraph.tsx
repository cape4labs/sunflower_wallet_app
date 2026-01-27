import { useWindowDimensions, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

type PriceGraphType = {
  lineData?: { value: number }[];
};

export default function PriceGraph({ lineData }: PriceGraphType) {
  const { height } = useWindowDimensions();
  const chartHeight = height >= 800 ? 150 : 100;

  return (
    <View className="bg-custom_complement rounded-xl p-0 mb-1">
      <LineChart
        data={lineData}
        spacing={1.85}
        maxValue={100}
        thickness={3}
        curved={true}
        curvature={0.2}
        hideRules={true}
        hideYAxisText={true}
        hideAxesAndRules
        color="#FF5500"
        initialSpacing={0}
        height={chartHeight}
        endSpacing={0}
        dataPointsRadius={0}
      />
    </View>
  );
}
