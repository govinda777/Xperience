import React from 'react'; // Adicione esta linha
import { toNano as _toNano, Address as _Address, Cell as _Cell, fromNano as _fromNano } from "ton";
import { useTonConnect } from "../hooks/useTonConnect";
import { useFaucetJettonContract } from "../hooks/useFaucetJettonContract";
import {
  Card,
  FlexBoxCol,
  FlexBoxRow,
  Button,
  Ellipsis,
} from "./styled/styled";

export function Jetton() {
  const { connected } = useTonConnect();
  const { mint, jettonWalletAddress, balance } = useFaucetJettonContract();

  return (
    <Card title="Jetton">
      <FlexBoxCol>
        <h3>Faucet Jetton : ----</h3>
        <FlexBoxRow>
          Wallet :
          <Ellipsis>{jettonWalletAddress}</Ellipsis>
        </FlexBoxRow>
        <FlexBoxRow>
          Balance:
          <div>{balance ?? "Loading..."}</div>
        </FlexBoxRow>
        <Button
          disabled={!connected}
          onClick={async () => {
            mint();
          }}
        >
          Get jettons from faucet.
        </Button>
      </FlexBoxCol>
    </Card>
  );
}
