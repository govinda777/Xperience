import { fromNano as _fromNano } from "ton";
import { beginCell as _beginCell, } from "ton-core";
export default class FaucetJettonWallet {
    address;
    init;
    source = {
        initialCode: _beginCell().endCell(),
        initialData: _beginCell().endCell(),
        type: "FaucetJettonWallet",
        workchain: 0,
        backup: () => "",
        describe: () => "Faucet Jetton Wallet Contract",
    };
    async getBalance(provider) {
        const { stack } = await provider.get("get_wallet_data", []);
        return _fromNano(stack.readBigNumber());
    }
    constructor(address, init) {
        this.address = address;
        this.init = init;
    }
}
