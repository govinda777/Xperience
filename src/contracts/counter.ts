import {
  Contract as TonCoreContract,
  ContractProvider,
  Sender,
  Address as TonCoreAddress,
  Cell as TonCoreCell,
  contractAddress,
  beginCell,
} from "ton-core";
import { Contract, ContractSource, Address, Cell } from "ton";

export default class Counter implements Contract, TonCoreContract {
  readonly source: ContractSource = {
    initialCode: beginCell().endCell() as unknown as Cell,
    initialData: beginCell().endCell() as unknown as Cell,
    type: "Counter",
    workchain: 0,
    backup: () => "",
    describe: () => "Counter Contract",
  };
  static createForDeploy(code: Cell, initialCounterValue: number): Counter {
    const data = beginCell().storeUint(initialCounterValue, 64).endCell();
    const workchain = 0; // deploy to workchain 0
    const address = contractAddress(workchain, { code: code as unknown as Cell, data: data as unknown as Cell });
    return new Counter(address as unknown as Address, { code: code as unknown as Cell, data: data as unknown as Cell });
  }

  async sendDeploy(provider: ContractProvider, via: Sender) {
    await provider.internal(via, {
      value: "0.01", // send 0.01 TON to contract for rent
      bounce: false,
    });
  }

  async getCounter(provider: ContractProvider) {
    const { stack } = await provider.get("counter", []);
    return stack.readBigNumber();
  }

  async sendIncrement(provider: ContractProvider, via: Sender) {
    const messageBody = beginCell()
      .storeUint(1, 32) // op (op #1 = increment)
      .storeUint(0, 64) // query id
      .endCell();
    await provider.internal(via, {
      value: "0.002", // send 0.002 TON for gas
      body: messageBody,
    });
  }

  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}
}
