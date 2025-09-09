import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";
import FaucetJetton from "../contracts/faucetJetton";
import { TonClient } from "ton";
import {
  Cell,
  beginCell,
  toNano,
  Address,
  Sender,
  SenderArguments,
} from "ton-core";

// Type definitions for contract state and interfaces
import FaucetJettonWallet from "../contracts/faucetJettonWallet";
import { useQuery } from "@tanstack/react-query";

interface ContractState {
  state: string;
  balance: { toString: () => string };
  lastTransaction?: { lt: string };
  storageStat?: { used: { cells: string } };
}

interface JettonContract {
  address: Address;
  getWalletAddress: (owner: Address) => Promise<string>;
  sendMintFromFaucet: (via: Sender, to: Address) => Promise<void>;
}

interface JettonWalletContract {
  address: Address;
  getBalance: () => Promise<string>;
  sendTransfer: (via: Sender, to: Address, amount: bigint) => Promise<void>;
}

export function useFaucetJettonContract() {
  const { wallet, sender } = useTonConnect();
  const { client } = useTonClient();

  const faucetJettonContract = useAsyncInitialize(async () => {
    if (!client || !wallet) return undefined;

    try {
      const contract = new FaucetJetton(
        Address.parse("EQB8StgTQXidy32a8xfu7j4HMoWYV0b0cFM8nXsP2cza_b7Y"),
      );

      return {
        address: contract.address,
        async getWalletAddress(owner: Address) {
          const state = (await client.getContractState(
            contract.address,
          )) as unknown as ContractState;
          return state.state === "active" ? state.balance.toString() || "" : "";
        },
        async sendMintFromFaucet(via: Sender, to: Address) {
          const message = beginCell()
            .storeUint(2, 32) // op: mint
            .storeAddress(to)
            .endCell();

          const args: SenderArguments = {
            to: contract.address,
            value: toNano("0.1"),
            body: message,
            bounce: true,
            sendMode: 1,
          };

          await via.send(args);
        },
      } as unknown as JettonContract;
    } catch (error) {
      console.error("Error initializing faucet jetton contract:", error);
      return undefined;
    }
  }, [client, wallet]);

  const jwContract = useAsyncInitialize(async () => {
    if (!faucetJettonContract || !client || !wallet) return undefined;

    try {
      const walletAddress = Address.parse(wallet);
      const jettonWalletAddress =
        await faucetJettonContract.getWalletAddress(walletAddress);

      if (!jettonWalletAddress) return undefined;

      const contract = new FaucetJettonWallet(
        Address.parse(jettonWalletAddress),
      );

      return {
        address: contract.address,
        async getBalance() {
          const state = (await client.getContractState(
            contract.address,
          )) as unknown as ContractState;
          return state.state === "active"
            ? state.balance.toString() || "0"
            : "0";
        },
        async sendTransfer(via: Sender, to: Address, amount: bigint) {
          const message = beginCell()
            .storeUint(0xf8a7ea5, 32) // op: transfer
            .storeUint(0, 64) // query id
            .storeCoins(amount)
            .storeAddress(to)
            .storeAddress(Address.parse(wallet)) // response address
            .storeUint(0, 1) // custom payload
            .storeCoins(toNano("0.1")) // forward amount
            .endCell();

          const args: SenderArguments = {
            to: contract.address,
            value: toNano("0.2"),
            body: message,
            bounce: true,
            sendMode: 1,
          };

          await via.send(args);
        },
      } as unknown as JettonWalletContract;
    } catch (error) {
      console.error("Error initializing jetton wallet contract:", error);
      return undefined;
    }
  }, [faucetJettonContract, client, wallet]);

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
