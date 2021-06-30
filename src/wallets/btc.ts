import { bip32, ECPair, payments, networks } from "bitcoinjs-lib";
import * as bip39 from "bip39";
// import CoinKey from "coinkey";
// import coinInfo from "coininfo";
// sure risk useful agree history term fine parrot topic man together garden
// 1K1vTfPa3jbJTn8EKJRYT2Kh5z3ehbb2Du
// 022b1bb74e9c6b9ed341875da76624ea266a7c69584eec7eb26b169572c5d3e8d8
// 93d099914ea6c19f4068c20df8cd6e0083410b8548810fd239c6eebc5630cf34
export class BTC_WALLET {
  async generate_wallet() {
    const mnemonic =
      /*bip39.generateMnemonic()*/ "sure risk useful agree history term fine parrot topic man together garden";
    const seed = await bip39.mnemonicToSeed(mnemonic);
    // bip32;
    const node = bip32.fromSeed(seed);
    // const key = node.derivePath("m/44'/0'/0'/0/0");
    console.log(
      payments.p2pkh({
        pubkey: node.publicKey,
        network: networks.bitcoin,
      }).address,
      node.publicKey.toString("hex"),
      node.privateKey?.toString("hex")
    );
  }
}
