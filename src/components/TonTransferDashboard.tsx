// src/components/TonTransferDashboard.tsx
import React from 'react';
import { TonConnectButton } from "@tonconnect/ui-react";
import { Counter } from "./Counter";
import { Jetton } from "./Jetton";
import { TransferTon } from "./TransferTon";
import { Button, FlexBoxCol, FlexBoxRow } from "./styled/styled";
import { useTonConnect } from "../hooks/useTonConnect";
import { CHAIN } from "@tonconnect/protocol";

const TonTransferDashboard: React.FC = () => {
  const { network } = useTonConnect();

  return (
    <FlexBoxCol>
      <FlexBoxRow>
        <TonConnectButton />
        <Button>
          {network
            ? network === CHAIN.MAINNET
              ? "mainnet"
              : "testnet"
            : "N/A"}
        </Button>
      </FlexBoxRow>
      <Counter />
      <TransferTon />
      <Jetton />
    </FlexBoxCol>
  );
};

export default TonTransferDashboard;