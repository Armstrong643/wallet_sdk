import type FusoSDK from "./fuso_sdk";
import type { KeyringOptions } from "@polkadot/keyring/types";
declare module coininfo {}
declare module coinkey {}
declare global {
  type WALLET_TYPES = "FUSOTAO" | "ETH" | "BTC";
  interface WalletOptions {
    mnemonic?: string;
    privateKey?: string;
    keyringOptions?: KeyringOptions;
  }
  interface Window {
    FusoSDK: FusoSDK;
    android: {
      FusoSDK: (message: string) => void;
    };
    webkit: {
      messageHandlers: {
        FusoSDK: {
          postMessage: (message: string) => void;
        };
      };
    };
    FusoReceiver: (message: string) => void;
  }
}
