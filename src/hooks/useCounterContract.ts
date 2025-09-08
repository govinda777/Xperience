import Counter from "../contracts/counter";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonConnect } from "./useTonConnect";
import { Address, Cell, beginCell, toNano } from "ton-core";
import { Sender, SenderArguments } from "ton-core";
import { Contract } from "ton-core";
import { useQuery } from "@tanstack/react-query";
import { CHAIN } from "@tonconnect/protocol";

export function useCounterContract() {
  const { client } = useTonClient();
  const { sender, network } = useTonConnect();

  const counterContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new Counter(
      Address.parse(
        network === CHAIN.MAINNET
          ? "EQBPEDbGdwaLv1DKntg9r6SjFIVplSaSJoJ-TVLe_2rqBOmH"
          : "EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb",
      ),
    );

    return {
      address: contract.address,
      async getCounter() {
        const state = await client.getContractState(contract.address);
        return state.state === "active" ? state.balance.toString() || "0" : "0";
      },
      async sendIncrement(sender: Sender) {
        const message = beginCell()
          .storeUint(1, 32) // op: increment
          .endCell();

        const args: SenderArguments = {
          to: contract.address,
          value: toNano("0.1"), // 0.1 TON
          body: message,
          bounce: true,
          sendMode: 1,
        };

        await sender.send(args);
      },
    } as unknown as {
      address: Address;
      getCounter: () => Promise<string>;
      sendIncrement: (sender: Sender) => Promise<void>;
    };
  }, [client]);

  const { data, isFetching } = useQuery({
    queryKey: ["counter"],
    queryFn: async () => {
      if (!counterContract) return null;
      return (await counterContract!.getCounter()).toString();
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
