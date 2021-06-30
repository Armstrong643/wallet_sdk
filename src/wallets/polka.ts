import { WsProvider, ApiPromise } from "@polkadot/api";
import { mnemonicGenerate } from "@polkadot/util-crypto";
import { Keyring } from "@polkadot/keyring";
import { stringToU8a, u8aToHex } from "@polkadot/util";
import { waitReady } from "@polkadot/wasm-crypto";
import walletTypes from "@/types";

import type { KeyringOptions, KeyringPair } from "@polkadot/keyring/types";

export class POLKA_WALLET {
  _wallet: ApiPromise | null = null;
  keyring: Keyring | null = null;
  pair: KeyringPair | null = null;
  async generate_wallet(options: WalletOptions) {
    await waitReady();
    let { mnemonic, privateKey, keyringOptions } = options;
    this.generate_keyring(keyringOptions);
    if (mnemonic) {
      this.generate_pair(mnemonic);
    } else {
      this.generate_pair(this.generate_mnemonic());
    }
    this.initApi();
  }
  generate_mnemonic() {
    const mnemonic = mnemonicGenerate();
    return mnemonic;
  }
  generate_keyring(
    options: KeyringOptions = { type: "sr25519", ss58Format: 2 }
  ) {
    const keyring = new Keyring(options);
    this.keyring = keyring;
    return keyring;
  }
  generate_pair(mnemonic: string) {
    if (this.keyring) {
      const pair = this.keyring.createFromUri(mnemonic);
      this.pair = pair;
      return pair;
    }
    return null;
  }

  async initApi(
    wsUrl: string = "wss://test-fuso.ngnexusccs.xyz",
    types: any = walletTypes
  ) {
    if (this._wallet) {
      this._wallet.disconnect();
    }
    return new Promise(async (resolve, reject) => {
      const provider = new WsProvider(wsUrl);
      const api = await ApiPromise.create({
        provider,
        types,
      });
      this._wallet = api;
      resolve(api);
    });
  }
  async getApi() {
    return new Promise(async (resolve) => {
      if (this._wallet) {
        resolve(this._wallet);
      } else {
        const api = await this.initApi();
        resolve(api);
      }
    });
  }
  async sign(message: string = "message"): Promise<string> {
    return new Promise((resolve) => {
      const u8a_message = stringToU8a(message);
      if (!this.pair) {
        return;
      }
      const signature = u8aToHex(this.pair.sign(u8a_message));
      resolve(signature);
    });
  }
  async transfer(to: string, balance: number) {
    if (!this.pair || !this._wallet) {
      return;
    }
    const transfer = this._wallet.tx.balances.transfer(to, balance);
    transfer.signAndSend(this.pair, {}, ({ events = [], status }) => {
      console.log("Transaction status:", status.type);
      if (status.isInBlock) {
        console.log("Included at block hash", status.asInBlock.toHex());
        console.log("Events:");
        events.forEach(({ event: { data, method, section }, phase }) => {
          console.log(
            "\t",
            phase.toString(),
            `: ${section}.${method}`,
            data.toString()
          );
        });
      } else if (status.isFinalized) {
        console.log("Finalized block hash", status.asFinalized.toHex());
      }
    });
  }
}
