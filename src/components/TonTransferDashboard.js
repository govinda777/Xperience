import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TonConnectButton } from "@tonconnect/ui-react";
import { Counter } from "./Counter";
import { Jetton } from "./Jetton";
import { TransferTon } from "./TransferTon";
import { Button, FlexBoxCol, FlexBoxRow } from "./styled/styled";
import { useTonConnect } from "../hooks/useTonConnect";
import { CHAIN } from "@tonconnect/protocol";
const TonTransferDashboard = () => {
    const { network } = useTonConnect();
    return (_jsxs(FlexBoxCol, { children: [_jsxs(FlexBoxRow, { children: [_jsx(TonConnectButton, {}), _jsx(Button, { children: network
                            ? network === CHAIN.MAINNET
                                ? "mainnet"
                                : "testnet"
                            : "N/A" })] }), _jsx(Counter, {}), _jsx(TransferTon, {}), _jsx(Jetton, {})] }));
};
export default TonTransferDashboard;
