import { View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

type PriceGraphType = {
  lineData?: { value: number }[];
};

export default function PriceGraph({ lineData }: PriceGraphType) {
  return (
    <View className="bg-custom_complement rounded-xl p-0">
      <LineChart
        data={lineData}
        spacing={1.85}
        maxValue={150}
        thickness={3}
        curved={true}
        curvature={0.2}
        hideRules={true}
        hideYAxisText={true}
        hideAxesAndRules
        color="#FF5500"
        height={130}
        initialSpacing={0}
        endSpacing={0}
        dataPointsRadius={0}
      />
    </View>
  );
}
