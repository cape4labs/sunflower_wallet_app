import * as Clipboard from '@react-native-clipboard/clipboard';

// TODO: "null | void" looks ugly, refactor functions that use null
export function copyTextToClipboard(data: string | null): null | void {
  if (!data) {
    return null;
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
