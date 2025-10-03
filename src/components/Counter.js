import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useCounterContract } from "../hooks/useCounterContract";
import { useTonConnect } from "../hooks/useTonConnect";
import { Card, FlexBoxCol, FlexBoxRow, Ellipsis, Button, } from "./styled/styled";
export function Counter({ connected: propConnected, value: propValue, address: propAddress, sendIncrement: propSendIncrement, }) {
    const { connected: hookConnected } = useTonConnect();
    const { value: hookValue, address: hookAddress, sendIncrement: hookSendIncrement, } = useCounterContract();
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
    return (_jsxs("div", { className: "Container", children: [_jsx(TonConnectButton, {}), _jsx(Card, { children: _jsxs(FlexBoxCol, { children: [_jsx("h3", { children: "Counter : -----" }), _jsxs(FlexBoxRow, { children: [_jsx("b", { children: "Address :" }), _jsx(Ellipsis, { children: address })] }), _jsxs(FlexBoxRow, { children: [_jsx("b", { children: "Value :" }), _jsx("div", { children: renderValue() })] }), _jsx(Button, { disabled: !connected, className: `Button ${connected ? "Active" : "Disabled"}`, onClick: handleIncrement, children: "Increment" })] }) })] }));
}
