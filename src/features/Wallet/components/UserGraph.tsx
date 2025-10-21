import { LineChart } from 'react-native-gifted-charts';
import { View } from 'react-native';

export default function UserGraph() {
  const lineData = [
    { value: 0 },
    { value: 20 },
    { value: 18 },
    { value: 40 },
    { value: 36 },
    { value: 60 },
    { value: 54 },
    { value: 85 },
    { value: 49 },
    { value: 60 },
    { value: 123 },
    { value: 123 },
  ]; // Mock values for graph

  return (
    <View className="bg-custom_complement rounded-xl p-0">
      <LineChart
        data={lineData}
        spacing={30}
        maxValue={300}
        thickness={3}
        curved={true}
        curvature={0.2}
        hideRules={true}
        hideYAxisText={true}
        hideAxesAndRules
        color="#FF5500"
        height={170}
        initialSpacing={0}
        endSpacing={0}
        dataPointsRadius={0}
      />
    </View>
  );
}
