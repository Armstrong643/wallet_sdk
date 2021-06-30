import FusoSDK from "./fuso_sdk";
import type { POLKA_WALLET, ETH_WALLET } from "./wallets/";
import { utils } from "ethers";
interface Message {
  cmd: string;
  params: any;
}
let SDK: FusoSDK;
async function initApp() {
  SDK = new FusoSDK();
  await SDK.initWallet("BTC");
}

function FusoReceiver(message: string) {
  const messageObj: Message = JSON.parse(message);
  switch (messageObj.cmd) {
    case "transfer":
  }
}
initApp();
window.FusoReceiver = FusoReceiver;
