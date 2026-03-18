import { render } from '@testing-library/react-native';

import MnemonicDisplayInput from './MnemonicDisplayInput';

it('MnemonicDisplayInput snapshot', () => {
  const mnemonic = Array.from({ length: 12 }).map((_, __) => {
    return 'word';
  });
  const tree = render(MnemonicDisplayInput({ mnemonic: mnemonic, setMnemonic: () => {} }));
  expect(tree).toMatchSnapshot();
});
