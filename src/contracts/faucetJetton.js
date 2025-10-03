import { beginCell, toNano, } from "ton-core";
export default class FaucetJetton {
    address;
    init;
    source = {
        initialCode: beginCell().endCell(),
        initialData: beginCell().endCell(),
        type: "FaucetJetton",
        workchain: 0,
        backup: () => "",
        describe: () => "Faucet Jetton Contract",
    };
    async sendMintFromFaucet(provider, via, receivingAddress) {
        const MINT = 21;
        const INTERNAL_TRANSFER = 0x178d4519;
        const mintTokensBody = beginCell()
            .storeUint(MINT, 32)
            .storeUint(0, 64) // queryid
            .storeAddress(receivingAddress)
            .storeCoins(toNano("0.02"))
            .storeRef(
        // internal transfer message
        beginCell()
            .storeUint(INTERNAL_TRANSFER, 32)
            .storeUint(0, 64)
            .storeCoins(toNano(150))
            .storeAddress(null)
            .storeAddress(receivingAddress) // So we get a notification
            .storeCoins(toNano("0.001"))
            .storeBit(false) // forward_payload in this slice, not separate cell
            .endCell())
            .endCell();
        await provider.internal(via, {
            value: toNano("0.05"),
            body: mintTokensBody,
        });
    }
    async getWalletAddress(provider, forAddress) {
        const { stack } = await provider.get("get_wallet_address", [
            { type: "slice", cell: beginCell().storeAddress(forAddress).endCell() },
        ]);
        return stack.readAddress().toString();
    }
    constructor(address, init) {
        this.address = address;
        this.init = init;
    }
}
