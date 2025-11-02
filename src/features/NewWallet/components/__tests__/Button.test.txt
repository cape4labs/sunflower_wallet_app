import { render } from '@testing-library/react-native';
import { Button } from '../Button.tsx';

it('Button snapshot', () => {
  const tree = render(Button({ onPress: () => {}, text: 'test' })).toJSON();
  expect(tree).toMatchSnapshot();
});
