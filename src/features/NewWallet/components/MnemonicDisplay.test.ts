import { render } from '@testing-library/react-native';

import { MnemonicDisplay, MnemonicWord } from './MnemonicDisplay';

it('MnemonicDisplay snapshot', () => {
  // TODO replace it with Array.from
  const mnemonic = Array.from({ length: 12 })
    .map((_, __) => {
      return 'word';
    })
    .join(' ');
  const tree = render(MnemonicDisplay({ mnemonic: mnemonic, className: '' })!).toJSON();
  expect(tree).toMatchSnapshot();
});

it('MnemonicWord snapshot', () => {
  const tree = render(MnemonicWord({ idx: 1, word: 'word' })).toJSON();
  expect(tree).toMatchSnapshot();
});
