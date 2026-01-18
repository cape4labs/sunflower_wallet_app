import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

export type ScreenSize = 'small' | 'medium';

export const useScreenSize = (): ScreenSize => {
  const { height } = useWindowDimensions();
  return height < 900 ? 'small' : 'medium';
};

const getResponsiveClassName = (
  size: ScreenSize,
  classes: Record<string, string | undefined>,
): string => {
  return classes[size] ?? classes.default ?? '';
};

export const useWalletScreenStyles = () => {
  const size = useScreenSize();

  // Utils
  const padding = (s: number, m: number) =>
    getResponsiveClassName(size, { small: `p-${s}`, medium: `p-${m}` });

  const margin = (s: number, m: number) =>
    getResponsiveClassName(size, { small: `m-${s}`, medium: `m-${m}` });

  const textSize = (s: string, m: string) => getResponsiveClassName(size, { small: s, medium: m });

  const borderWidth = (s: number, m: number) =>
    getResponsiveClassName(size, {
      small: `border-[${s}px]`,
      medium: `border-[${m}px]`,
    });

  const gap = (s: number, m: number) =>
    getResponsiveClassName(size, { small: `gap-${s}`, medium: `gap-${m}` });

  const iconSize = (s: number, m: number) =>
    getResponsiveClassName(size, { small: `${s}`, medium: `${m}` });

  return useMemo(() => {
    const global = {
      containerPadding: padding(4, 5),
      title: textSize('text-xl', 'text-2xl'),
      subtitle: textSize('text-sm', 'text-lg'),
      border: borderWidth(2, 2),
      buttonMargin: margin(1, 2),
      infoText: textSize('text-xs', 'text-sm'),
      arrowSize: iconSize(25, 30),
      refreshIconSize: iconSize(20, 25),
    };

    return {
      global,

      // === Screens ===
      mainWalletScreen: {
        containerPadding: padding(1, 1),
        headerGap: gap(4, 10),
        balanceText: textSize('text-3xl', 'text-4xl'),
        addressText: textSize('text-xs', 'text-sm'),
        addressCopyIcon: iconSize(12, 15),
        actionsHeight: getResponsiveClassName(size, {
          small: 'h-[64%]',
          medium: 'h-[65%]',
        }),
        sendReceiveButtonGap: getResponsiveClassName(size, {
          small: 'mt-0.5',
          medium: 'mt-1',
        }),
        tabsMargin: getResponsiveClassName(size, {
          small: 'mt-1',
          medium: 'mt-2',
        }),
      },

      historyScreen: {
        containerPadding: global.containerPadding,
        headerTitle: global.title,
        sectionTitle: textSize('text-base', 'text-lg'),
        txContainer: padding(3, 4),
        txAmount: textSize('text-lg', 'text-xl'),
        txAddress: textSize('text-xs', 'text-sm'),
        expandedTx: padding(2, 4),
        refreshIconSize: global.refreshIconSize,
        refreshButton: getResponsiveClassName(size, {
          small: 'p-1.5',
          medium: 'p-2',
        }),
        txIconSize: iconSize(12, 15),
        copyIconSize: iconSize(15, 17),
        retryButton: getResponsiveClassName(size, {
          small: 'p-1.5',
          medium: 'p-2',
        }),
        txStatus: textSize('text-xs', 'text-sm'),
      },

      chooseCoinScreen: {
        containerPadding: global.containerPadding,
        titleSize: global.title,
        tokenListMargin: getResponsiveClassName(size, {
          small: 'mt-6',
          medium: 'mt-10',
        }),
        arrowSize: global.arrowSize,
      },

      receiveScreen: {
        containerPadding: global.containerPadding,
        titleSize: global.title,
        dividerMargin: margin(4, 6),
        qrSize: iconSize(100, 200),
        addressText: textSize('text-xs', 'text-sm'),
        arrowSize: global.arrowSize,
        copyIconSize: iconSize(12, 15),
      },

      sendScreen: {
        containerPadding: global.containerPadding,
        titleSize: global.title,
        coinCard: getResponsiveClassName(size, {
          small: 'p-3 border-2',
          medium: 'p-5 border-2',
        }),
        amountInput: textSize('text-2xl', 'text-3xl'),
        recipientInput: textSize('text-base', 'text-lg'),
        usdText: textSize('text-sm', 'text-base'),
        maxButton: textSize('text-sm', 'text-base'),
        errorText: textSize('text-xs', 'text-sm'),
        arrowSize: global.arrowSize,
        coinsMargin: getResponsiveClassName(size, {
          small: 'mt-6',
          medium: 'mt-10',
        }),
      },

      sendInfoScreen: {
        containerPadding: global.containerPadding,
        titleSize: global.title,
        sectionMargin: margin(1, 2),
        dividerMargin: margin(3, 4),
        gasLabel: textSize('text-base', 'text-lg'),
        gasValue: textSize('text-sm', 'text-base'),
        totalLabel: textSize('text-base', 'text-lg'),
        totalValue: textSize('text-sm', 'text-base'),
        loadingText: textSize('text-xs', 'text-sm'),
        successText: textSize('text-xl', 'text-2xl'),
        txidText: textSize('text-xs', 'text-sm'),
        redirectText: textSize('text-xs', 'text-xs'),
        errorText: textSize('text-sm', 'text-xl'),
        recipientAvatar: iconSize(30, 35),
        recipientName: textSize('text-base', 'text-lg'),
        arrowSize: global.arrowSize,
      },

      newWalletScreens: {
        titleSize: global.title,
        subtitleSize: global.subtitle,
        buttonMargin: global.buttonMargin,
        infoGap: gap(2, 3),
        infoText: global.infoText,
      },

      createWallet: {
        titleGap: margin(1, 2),
        blurImageSize: getResponsiveClassName(size, {
          medium: 'h-auto',
        }),
        toggleGap: gap(3, 5),
        copyIconSize: getResponsiveClassName(size, {
          small: 'w-3 h-3',
          medium: 'w-4 h-4',
        }),
        bottomButtons: getResponsiveClassName(size, {
          medium: 'p-1 my-5',
        }),
        copyText: textSize('text-base', 'text-lg'),
      },

      nameWallet: {
        inputContainer: getResponsiveClassName(size, {
          small: 'border-2 px-3',
          medium: 'border-2 px-5',
        }),
        inputText: textSize('text-lg', 'text-xl'),
        loadingGap: margin(3, 5),
      },

      settingsScreen: {},

      // === Components ===
      button: {
        container: getResponsiveClassName(size, {
          small: 'py-2 px-8 border-2 gap-2 rounded-xl',
          medium: 'py-3 px-12 border-2 gap-3 rounded-2xl',
        }),
        text: textSize('text-base', 'text-lg'),
        icon: iconSize(12, 24),
      },

      buttonNewWallet: {
        container: getResponsiveClassName(size, {
          small: 'py-2 px-10 border-2 rounded-xl',
          medium: 'py-3 px-14 border-2 rounded-2xl',
        }),
        text: textSize('text-base', 'text-lg'),
      },

      textButton: {
        container: getResponsiveClassName(size, {
          small: 'py-2 px-6 border-b-2',
          medium: 'py-3 px-6 border-b-2',
        }),
        text: textSize('text-sm', 'text-lg'),
      },

      toggle: {
        container: getResponsiveClassName(size, {
          small: 'w-16 h-7',
          medium: 'w-20 h-9',
        }),
        thumb: getResponsiveClassName(size, {
          small: 'h-5 w-5',
          medium: 'h-6 w-6',
        }),
        border: getResponsiveClassName(size, {
          small: 'border-2',
          medium: 'border-2',
        }),
      },

      coin: {
        container: gap(2, 3),
        nameText: textSize('text-lg', 'text-xl'),
        usdText: textSize('text-sm', 'text-base'),
        balanceText: textSize('text-lg', 'text-xl'),
        costText: textSize('text-sm', 'text-base'),
        iconSize: getResponsiveClassName(size, {
          small: 'w-6 h-6',
          medium: 'w-8 h-8',
        }),
      },

      tokenList: {
        container: getResponsiveClassName(size, {
          small: 'p-3 border-2',
          medium: 'p-4 border-2',
        }),
        item: getResponsiveClassName(size, {
          small: 'm-1',
          medium: 'm-2',
        }),
      },

      mnemonic: {
        container: getResponsiveClassName(size, {
          small: 'border-2 rounded-lg my-3',
          medium: 'border-2 rounded-xl my-5',
        }),
        columnMargin: margin(1, 2),
      },

      selectWallet: {
        trigger: getResponsiveClassName(size, {
          small: 'py-1.5 px-3 mb-3 w-[130px] border-[4px]',
          medium: 'py-2 px-4 mb-4 w-[160px] border-[4px]',
        }),
        triggerText: getResponsiveClassName(size, {
          small: 'text-base',
          medium: 'text-lg',
        }),
        modal: getResponsiveClassName(size, {
          small: 'p-3 w-11/12 h-full',
          medium: 'p-4 w-3/4 h-full',
        }),
        item: getResponsiveClassName(size, {
          small: 'p-3 mb-2',
          medium: 'p-4 mb-2',
        }),
        itemText: getResponsiveClassName(size, {
          small: 'text-sm',
          medium: 'text-lg',
        }),
        actionButton: getResponsiveClassName(size, {
          small: 'p-1.5 mt-3',
          medium: 'p-2 mt-4',
        }),
        actionText: getResponsiveClassName(size, {
          small: 'text-base',
          medium: 'text-lg',
        }),
      },

      mnemonicWord: {
        container: getResponsiveClassName(size, {
          small: 'px-1 p-2 my-0.5',
          medium: 'px-2 p-2 my-1',
        }),
        text: textSize('text-base', 'text-lg'),
      },

      mnemonicInput: {
        container: getResponsiveClassName(size, {
          small: 'px-1 p-1.5 my-0.5',
          medium: 'px-2 p-2 my-1',
        }),
        input: textSize('text-base', 'text-lg'),
      },
    };
  }, [size]);
};
