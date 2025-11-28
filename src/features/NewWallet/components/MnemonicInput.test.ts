import { render } from '@testing-library/react-native';

import { MnemonicInput } from './MnemonicInput';

it('MnemonicInput snapshot', () => {
  const tree = render(MnemonicInput({ idx: 0, onChange: () => {}, value: 'test' })).toJSON();
  expect(tree).toMatchSnapshot();
});
