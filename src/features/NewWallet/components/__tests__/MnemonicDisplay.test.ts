import { render } from '@testing-library/react-native';
import { MnemonicDisplay } from '../MnemonicDisplay';

it('MnemonicDisplay snapshot', () => {
  const mnemonic = 'word word word word word word word word word word word word';
  const tree = render(MnemonicDisplay({ mnemonic: mnemonic, className: '' })!).toJSON();
  expect(tree).toMatchSnapshot();
});
