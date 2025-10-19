import { View } from 'react-native';

interface StepIndicatorProps {
  totalSteps: number;
  currentStep: number;
}

export function StepIndicator({ totalSteps, currentStep }: StepIndicatorProps) {
  return (
    <View className="flex-row justify-center mt-6 space-x-2">
      {Array.from({ length: totalSteps }).map((_, indx) => {
        const isActive = indx + 1 === currentStep;
        return (
          <View
            key={indx}
            className={`w-3 h-3 rounded-full mx-1 ${
              isActive ? 'bg-white' : 'bg-gray-500 opacity-50'
            }`}
          />
        );
      })}
    </View>
  );
}
