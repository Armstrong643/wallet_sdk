import { POLKA_WALLET, ETH_WALLET, BTC_WALLET } from "./wallets/";

function getPhoneType() {
  const { userAgent } = navigator;
  const isAndroid =
    userAgent.indexOf("Android") > -1 || userAgent.indexOf("Adr") > -1;
  const isiOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  return isAndroid ? "android" : isiOS ? "ios" : "web";
}
const PHONE_TYPE = getPhoneType();
export default class FusoSDK {
  wallet: POLKA_WALLET | ETH_WALLET | BTC_WALLET | null = null;
  send(message: string) {
    if (PHONE_TYPE === "android") {
      window.android.FusoSDK(message);
    } else {
      window.webkit.messageHandlers.FusoSDK.postMessage(message);
    }
  }
  async initWallet(type: WALLET_TYPES = "ETH", options: WalletOptions = {}) {
    let wallet;
    switch (type) {
      case "ETH":
        wallet = new ETH_WALLET();
        await wallet.generate_wallet({
          privateKey:
            "b5fd8674dfe310454154bb620ec09211c7e561448bf9d83881c0663f5c6a4924",
        });
        this.wallet = wallet;
        break;
      case "FUSOTAO":
        wallet = new POLKA_WALLET();
        await wallet.generate_wallet(options);
        this.wallet = wallet;
        break;
      case "BTC":
        wallet = new BTC_WALLET();
        wallet.generate_wallet();
        this.wallet = wallet;
    }
  }
}
