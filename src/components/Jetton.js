import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTonConnect } from "../hooks/useTonConnect";
import { useFaucetJettonContract } from "../hooks/useFaucetJettonContract";
import { Card, FlexBoxCol, FlexBoxRow, Button, Ellipsis, } from "./styled/styled";
export function Jetton() {
    const { connected } = useTonConnect();
    const { mint, jettonWalletAddress, balance } = useFaucetJettonContract();
    return (_jsx(Card, { title: "Jetton", children: _jsxs(FlexBoxCol, { children: [_jsx("h3", { children: "Faucet Jetton : ----" }), _jsxs(FlexBoxRow, { children: ["Wallet :", _jsx(Ellipsis, { children: jettonWalletAddress })] }), _jsxs(FlexBoxRow, { children: ["Balance:", _jsx("div", { children: balance ?? "Loading..." })] }), _jsx(Button, { disabled: !connected, onClick: async () => {
                        mint();
                    }, children: "Get jettons from faucet." })] }) }));
}
