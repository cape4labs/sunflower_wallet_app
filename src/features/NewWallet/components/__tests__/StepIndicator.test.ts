import { render } from '@testing-library/react-native';
import { StepIndicator } from '../StepIndicator';

it('StepIndicator snapshot', () => {
  const tree = render(StepIndicator({ totalSteps: 5, currentStep: 3 })).toJSON();
  expect(tree).toMatchSnapshot();
});
