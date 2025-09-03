import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";
import FaucetJetton from "../contracts/faucetJetton";
import {
  Address,
  OpenedContract,
  ContractProvider,
  Sender,
  Contract,
  Cell,
  beginCell,
} from "ton-core";
import FaucetJettonWallet from "../contracts/faucetJettonWallet";
import { useQuery } from "@tanstack/react-query";

export function useFaucetJettonContract() {
  const { wallet, sender } = useTonConnect();
  const { client } = useTonClient();

  const faucetJettonContract = useAsyncInitialize(async () => {
    if (!client || !wallet) return;
    const contract = new FaucetJetton(
      Address.parse("EQB8StgTQXidy32a8xfu7j4HMoWYV0b0cFM8nXsP2cza_b7Y"),
    );

    return {
      address: contract.address,
      async getWalletAddress(owner: Address) {
        const state = await client.getContractState(contract.address);
        return state.state === "active" ? state.balance.toString() || "" : "";
      },
      async sendMintFromFaucet(via: Sender, to: Address) {
        const message = beginCell()
          .storeUint(2, 32) // op: mint
          .storeAddress(to)
          .endCell();
        await client.sendExternalMessage(contract, {
          body: message,
          bounce: true,
        });
      },
    } as unknown as OpenedContract<FaucetJetton>;
  }, [client, wallet]);

  const jwContract = useAsyncInitialize(async () => {
    if (!faucetJettonContract || !client) return;
    const jettonWalletAddress = await faucetJettonContract!.getWalletAddress(
      Address.parse(wallet!),
    );
    const contract = new FaucetJettonWallet(Address.parse(jettonWalletAddress));

    return {
      address: contract.address,
      async getBalance() {
        const state = await client.getContractState(contract.address);
        return state.state === "active" ? state.balance.toString() || "0" : "0";
      },
    } as unknown as OpenedContract<FaucetJettonWallet>;
  }, [faucetJettonContract, client]);

  const { data, isFetching } = useQuery({
    queryKey: ["jetton"],
    queryFn: async () => {
      if (!jwContract) return null;
      return (await jwContract.getBalance()).toString();
    },
    refetchInterval: 3000,
  });

  return {
    mint: () => {
      faucetJettonContract?.sendMintFromFaucet(sender, Address.parse(wallet!));
    },
    jettonWalletAddress: jwContract?.address.toString(),
    balance: isFetching ? null : data,
  };
}
