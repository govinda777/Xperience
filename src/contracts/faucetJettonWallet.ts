import { fromNano as _fromNano, Contract, ContractSource, Address, Cell } from "ton";
import {
  Contract as TonCoreContract,
  ContractProvider,
  Sender as _Sender,
  Address as TonCoreAddress,
  Cell as TonCoreCell,
  contractAddress as _contractAddress,
  beginCell as _beginCell,
  toNano as _toNano,
} from "ton-core";

export default class FaucetJettonWallet implements Contract, TonCoreContract {
  readonly source: ContractSource = {
    initialCode: new Cell(),
    initialData: new Cell(),
    type: "FaucetJettonWallet",
    compiler: "func",
  };
  async getBalance(provider: ContractProvider) {
    const { stack } = await provider.get("get_wallet_data", []);
    return _fromNano(stack.readBigNumber());
  }

  constructor(
    readonly address: Address,
    readonly init?: { code: _Cell; data: _Cell },
  ) {}
}
