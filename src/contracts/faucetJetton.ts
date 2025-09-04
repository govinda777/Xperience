import {
  Contract as TonCoreContract,
  ContractProvider,
  Sender,
  Address as TonCoreAddress,
  Cell as TonCoreCell,
  beginCell,
  toNano,
} from "ton-core";
import { Contract, ContractSource, Address, Cell } from "ton";

export default class FaucetJetton implements Contract, TonCoreContract {
  readonly source: ContractSource = {
    initialCode: new TonCoreCell(),
    initialData: new TonCoreCell(),
    type: "FaucetJetton",
  };
  async sendMintFromFaucet(
    provider: ContractProvider,
    via: Sender,
    receivingAddress: Address,
  ) {
    const MINT = 21;
    const INTERNAL_TRANSFER = 0x178d4519;

    const mintTokensBody = beginCell()
      .storeUint(MINT, 32)
      .storeUint(0, 64) // queryid
      .storeAddress(receivingAddress as unknown as TonCoreAddress)
      .storeCoins(toNano("0.02"))
      .storeRef(
        // internal transfer message
        beginCell()
          .storeUint(INTERNAL_TRANSFER, 32)
          .storeUint(0, 64)
          .storeCoins(toNano(150))
          .storeAddress(null)
          .storeAddress(receivingAddress as unknown as TonCoreAddress) // So we get a notification
          .storeCoins(toNano("0.001"))
          .storeBit(false) // forward_payload in this slice, not separate cell
          .endCell(),
      )
      .endCell();

    await provider.internal(via, {
      value: toNano("0.05"),
      body: mintTokensBody,
    });
  }

  async getWalletAddress(provider: ContractProvider, forAddress: Address) {
    const { stack } = await provider.get("get_wallet_address", [
      { type: "slice", cell: beginCell().storeAddress(forAddress as unknown as TonCoreAddress).endCell() },
    ]);

    return stack.readAddress().toString();
  }

  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}
}
