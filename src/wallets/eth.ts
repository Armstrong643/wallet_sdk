import { Wallet, providers, utils } from "ethers";
export class ETH_WALLET {
  _wallet: Wallet | null = null;
  provider: providers.WebSocketProvider | providers.JsonRpcProvider | null =
    null;
  async generate_wallet(options: WalletOptions) {
    await this.initProvider();
    let { privateKey, mnemonic } = options;
    let wallet: Wallet;
    if (this.provider) {
      if (privateKey) {
        wallet = new Wallet(privateKey, this.provider);
      } else if (mnemonic) {
        wallet = Wallet.fromMnemonic(mnemonic);
        wallet.connect(this.provider);
      } else {
        wallet = Wallet.createRandom();
        wallet.connect(this.provider);
      }
      this._wallet = wallet;
      return wallet;
    }
  }
  async sign(message: string = "message"): Promise<string> {
    return new Promise((resolve) => {
      this._wallet?.signMessage(message).then((res) => {
        resolve(res);
      });
    });
  }
  async sendTx(to: string, value: string) {
    const tx = {
      to,
      value: utils.parseEther(value),
    };
    await this._wallet?.signTransaction(tx);
    await this._wallet?.sendTransaction(tx);
  }
  async initProvider(
    url: string = "wss://rinkeby.infura.io/ws/v3/9012a15547064447b91fd0069e8370a8"
  ) {
    if (this.provider instanceof providers.WebSocketProvider) {
      this.provider.destroy();
    }
    if (url.includes("wss")) {
      this.provider = new providers.WebSocketProvider(url);
    } else {
      this.provider = new providers.JsonRpcProvider(url);
    }
  }
}
