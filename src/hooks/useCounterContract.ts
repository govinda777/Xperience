import Counter from "../contracts/counter";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonConnect } from "./useTonConnect";
import { TonClient, Address, Cell, Contract } from "ton";
import { toNano } from "ton-core";

// Define Sender and SenderArguments interfaces since they're not exported from 'ton'
interface Sender {
  send: (args: SenderArguments) => Promise<void>;
}

interface SenderArguments {
  to: Address;
  value: bigint;
  body?: Cell;
  bounce?: boolean;
  sendMode?: number;
}

// Helper function to convert between Address types if needed
const toTonAddress = (address: string | Address): Address => {
  if (typeof address === "string") {
    return Address.parse(address);
  }
  return address;
};
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
        // Convert ton-core Address to ton Address if needed
        const contractAddress =
          typeof contract.address.toString === "function"
            ? contract.address.toString()
            : contract.address;
        const state = await client.getContractState(contractAddress);
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
