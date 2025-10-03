import Counter from "../contracts/counter";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonConnect } from "./useTonConnect";
import { Address } from "ton";
import { toNano, beginCell } from "ton-core";
import { useQuery } from "@tanstack/react-query";
import { CHAIN } from "@tonconnect/protocol";
export function useCounterContract() {
    const { client } = useTonClient();
    const { sender, network } = useTonConnect();
    const counterContract = useAsyncInitialize(async () => {
        if (!client)
            return;
        const contract = new Counter(Address.parseFriendly(network === CHAIN.MAINNET
            ? "EQBPEDbGdwaLv1DKntg9r6SjFIVplSaSJoJ-TVLe_2rqBOmH"
            : "EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb").address);
        return {
            address: contract.address,
            async getCounter() {
                // Convert ton-core Address to ton Address if needed
                const contractAddress = typeof contract.address.toString === "function"
                    ? contract.address.toString()
                    : contract.address;
                const state = await client.getContractState(contractAddress);
                return state.state === "active" ? state.balance.toString() || "0" : "0";
            },
            async sendIncrement(sender) {
                const message = beginCell()
                    .storeUint(1, 32) // op: increment
                    .endCell();
                const args = {
                    to: contract.address,
                    value: toNano("0.1"), // 0.1 TON
                    body: message,
                    bounce: true,
                    sendMode: 1,
                };
                await sender.send(args);
            },
        };
    }, [client]);
    const { data, isFetching } = useQuery({
        queryKey: ["counter"],
        queryFn: async () => {
            if (!counterContract)
                return null;
            return (await counterContract.getCounter()).toString();
        },
        refetchInterval: 3000,
    });
    return {
        value: isFetching ? null : data,
        address: counterContract?.address.toString(),
        sendIncrement: () => {
            return counterContract?.sendIncrement(sender);
        },
    };
}
