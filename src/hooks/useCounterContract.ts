import Counter from "../contracts/counter";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonConnect } from "./useTonConnect";
import {
  Address as TonCoreAddress,
  OpenedContract,
  ContractProvider,
  Sender,
  Contract as TonCoreContract,
  Cell,
  beginCell,
} from "ton-core";
import { Address, Contract } from "ton";
import { useQuery } from "@tanstack/react-query";
import { CHAIN } from "@tonconnect/protocol";

export function useCounterContract() {
  const { client } = useTonClient();
  const { sender, network } = useTonConnect();

  const counterContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new Counter(
      Address.parseFriendly(
        network === CHAIN.MAINNET
          ? "EQBPEDbGdwaLv1DKntg9r6SjFIVplSaSJoJ-TVLe_2rqBOmH"
          : "EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb",
      ).address,
    );

    return {
      address: contract.address,
      async getCounter() {
        const state = await client.getContractState(contract.address);
        return state.state === "active" ? state.balance.toString() || "0" : "0";
      },
      async sendIncrement(via: Sender) {
        const message = beginCell()
          .storeUint(1, 32) // op: increment
          .endCell();
        await client.sendExternalMessage(contract, {
          body: message as unknown as TonCoreCell,
          bounce: true,
        });
      },
    } as Contract & OpenedContract<Counter>;
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
