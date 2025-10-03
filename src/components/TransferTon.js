import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Address, toNano } from "ton-core";
import { useTonConnect } from "../hooks/useTonConnect";
import { Card, FlexBoxCol, FlexBoxRow, Button, Input } from "./styled/styled";
export function TransferTon() {
    const { sender, connected } = useTonConnect();
    const [tonAmount, setTonAmount] = useState("0.01");
    const [tonRecipient, setTonRecipient] = useState("");
    return (_jsx(Card, { children: _jsxs(FlexBoxCol, { children: [_jsx("h3", { children: "Transfer TON" }), _jsxs(FlexBoxRow, { children: [_jsx("label", { children: "Amount " }), _jsx(Input, { style: { marginRight: 8 }, type: "number", value: tonAmount, onChange: (e) => setTonAmount(e.target.value) })] }), _jsxs(FlexBoxRow, { children: [_jsx("label", { children: "To " }), _jsx(Input, { style: { marginRight: 8 }, value: tonRecipient, onChange: (e) => setTonRecipient(e.target.value) })] }), _jsx(Button, { disabled: !connected, style: { marginTop: 18 }, onClick: async () => {
                        sender.send({
                            to: Address.parse(tonRecipient),
                            value: toNano(tonAmount),
                        });
                    }, children: "Transfer" })] }) }));
}
