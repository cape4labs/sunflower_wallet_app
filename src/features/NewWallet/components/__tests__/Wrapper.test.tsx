import { render } from '@testing-library/react-native';
import { Wrapper } from '../Wrapper';
import { Text } from 'react-native';

it('Wrapper snapshot', () => {
  const tree = render(Wrapper({ children: <Text /> })).toJSON();
  expect(tree).toMatchSnapshot();
});
