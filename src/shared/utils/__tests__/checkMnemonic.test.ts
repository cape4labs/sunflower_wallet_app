import { checkMnemonic } from '../pasteMnemonicFromClipboard';

describe('normal cases', () => {
  it('12 words', () => {
    const length = 12;
    const mnemonic = new Array(length).fill('word');
    expect(checkMnemonic(mnemonic, length)).toBeUndefined();
  });

  it('24 words', () => {
    const length = 24;
    // TODO: why does the next line throw and error?
    // const mnemonic = new Array(length).fill('word');
    const mnemonic = `accuse spike congress home clown year expire air
       thumb invest rural staff chuckle sing sport vote
        ensure weekend accident primary barrel prevent cash expose`.split(/\s+/);
    expect(checkMnemonic(mnemonic, length)).toBeUndefined();
  });
});

describe('invalid length cases', () => {
  it('valid expected length, invalid mnemonic length', () => {
    const length = 13;
    const mnemonic = new Array(length).fill('word');
    expect(() => checkMnemonic(mnemonic, 12)).toThrow(/doesn\'t match expected length/);
  });

  it('invalid expected length, valid mnemonic length', () => {
    const mnemonic = new Array(13).fill('word');
    expect(() => checkMnemonic(mnemonic, 13)).toThrow(/expected mnemonic length/);
  });

  it('invalid expected length, invalid mnemonic length', () => {
    const mnemonic = new Array(13).fill('word');
    expect(() => checkMnemonic(mnemonic, 13)).toThrow(/expected mnemonic length/);
  });
});

describe('invalid mnemonic word', () => {
  it('not a word', () => {
    let mnemonic = new Array(11).fill('word');
    mnemonic.push('dskfjdfi');
    expect(() => checkMnemonic(mnemonic, 12)).toThrow(/unpermitted words/);
  });

  it('word not used for mnemonics', () => {
    let mnemonic = new Array(11).fill('word');
    mnemonic.push('russia');
    expect(() => checkMnemonic(mnemonic, 12)).toThrow(/unpermitted words/);
  });

  it('word with characters other than latin', () => {
    let mnemonic = new Array(11).fill('word');
    mnemonic.push('дурак');
    expect(() => checkMnemonic(mnemonic, 12)).toThrow(/unpermitted words/);
  });

  it('letters with accents', () => {
    let mnemonic = new Array(11).fill('word');
    mnemonic.push('wûrd');
    expect(() => checkMnemonic(mnemonic, 12)).toThrow(/unpermitted words/);
  });
});

describe('miscellaneous', () => {
  it('unconvential letter case', () => {
    const mnemonic = new Array(11).fill('word');
    mnemonic.push('WORD');
    expect(() => checkMnemonic(mnemonic, 12)).toThrow(/upper register/);
  });

  it('characters other than letters sticked to words', () => {
    for (let char of '!,.2_/') {
      let mnemonic = new Array(11).fill('word');
      mnemonic.push(`word ${char}`);
      expect(() => checkMnemonic(mnemonic, 12)).toThrow(/unpermitted words/);
    }
  });

  it('characters other than letters on their own', () => {
    for (let char of '!,.2_/') {
      let mnemonic = new Array(11).fill('word');
      mnemonic[11] = char;
      expect(() => checkMnemonic(mnemonic, 12)).toThrow(/unpermitted words/);
    }
  });
});
