import * as Clipboard from '@react-native-clipboard/clipboard';

export function copyTextToClipboard(data: string | null): void {
  if (!data) {
    return;
  }

  Clipboard.default.setString(data);
}

export async function pasteTextFromClipboard(): Promise<string | void> {
  const clipboardText = await Clipboard.default.getString();
  if (!clipboardText) {
    // TODO: show a warning to user that there's no text in the clipboard
    return;
  }

  return clipboardText;
}
