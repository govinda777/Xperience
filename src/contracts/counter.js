import { contractAddress, beginCell, } from "ton-core";
export default class Counter {
    address;
    init;
    source = {
        initialCode: beginCell().endCell(),
        initialData: beginCell().endCell(),
        type: "Counter",
        workchain: 0,
        backup: () => "",
        describe: () => "Counter Contract",
    };
    static createForDeploy(code, initialCounterValue) {
        const data = beginCell().storeUint(initialCounterValue, 64).endCell();
        const workchain = 0; // deploy to workchain 0
        const address = contractAddress(workchain, { code: code, data: data });
        return new Counter(address, { code: code, data: data });
    }
    async sendDeploy(provider, via) {
        await provider.internal(via, {
            value: "0.01", // send 0.01 TON to contract for rent
            bounce: false,
        });
    }
    async getCounter(provider) {
        const { stack } = await provider.get("counter", []);
        return stack.readBigNumber();
    }
    async sendIncrement(provider, via) {
        const messageBody = beginCell()
            .storeUint(1, 32) // op (op #1 = increment)
            .storeUint(0, 64) // query id
            .endCell();
        await provider.internal(via, {
            value: "0.002", // send 0.002 TON for gas
            body: messageBody,
        });
    }
    constructor(address, init) {
        this.address = address;
        this.init = init;
    }
}
