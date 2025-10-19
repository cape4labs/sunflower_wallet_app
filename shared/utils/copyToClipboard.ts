import Clipboard from '@react-native-clipboard/clipboard';

export const CopyToClipboard = (data: string | null) => {
  if (!data) {
    return null;
  }
  Clipboard.setString(data);
};
