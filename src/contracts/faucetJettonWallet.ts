import { fromNano as _fromNano } from "ton";
import {
  Contract,
  ContractProvider,
  Sender as _Sender,
  Address as _Address,
  Cell as _Cell,
  contractAddress as _contractAddress,
  beginCell as _beginCell,
  toNano as _toNano,
} from "ton-core";

export default class FaucetJettonWallet implements Contract {
  async getBalance(provider: ContractProvider) {
    const { stack } = await provider.get("get_wallet_data", []);
    return _fromNano(stack.readBigNumber());
  }

  constructor(
    readonly address: _Address,
    readonly init?: { code: _Cell; data: _Cell }
  ) {}
}
