import React from 'react';
import { TonConnectButton } from "@tonconnect/ui-react";
import { useCounterContract } from "../hooks/useCounterContract";
import { useTonConnect } from "../hooks/useTonConnect";

import { Card, FlexBoxCol, FlexBoxRow, Ellipsis, Button } from "./styled/styled";

interface CounterProps {
  connected?: boolean;
  value?: number | null;
  address?: string;
  sendIncrement?: () => void;
}

export function Counter({
  connected: propConnected,
  value: propValue,
  address: propAddress,
  sendIncrement: propSendIncrement,
}: CounterProps) {
  const { connected: hookConnected } = useTonConnect();
  const { value: hookValue, address: hookAddress, sendIncrement: hookSendIncrement } = useCounterContract();

  const connected = propConnected ?? hookConnected;
  const value = propValue ?? hookValue;
  const address = propAddress ?? hookAddress;
  const sendIncrement = propSendIncrement ?? hookSendIncrement;

  const handleIncrement = () => {
    if (connected) {
      sendIncrement();
    }
  };

  const renderValue = () => (value !== null ? value : "Loading...");

  return (
    <div className="Container">
      <TonConnectButton />
      <Card>
        <FlexBoxCol>
          <h3>Counter : -----</h3>
          <FlexBoxRow>
            <b>Address :</b>
            <Ellipsis>{address}</Ellipsis>
          </FlexBoxRow>
          <FlexBoxRow>
            <b>Value :</b>
            <div>{renderValue()}</div>
          </FlexBoxRow>
          <Button
            disabled={!connected}
            className={`Button ${connected ? "Active" : "Disabled"}`}
            onClick={handleIncrement}
          >
            Increment
          </Button>
        </FlexBoxCol>
      </Card>
    </div>
  );
}
