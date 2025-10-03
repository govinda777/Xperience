import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
const CartIcon = ({ className = "", showCount = true, onClick, }) => {
    const { getItemCount } = useCart();
    const itemCount = getItemCount();
    return (_jsxs("div", { className: `relative cursor-pointer ${className}`, onClick: onClick, children: [_jsx(ShoppingCart, { className: "w-6 h-6" }), showCount && itemCount > 0 && (_jsx("span", { className: "absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold", children: itemCount > 99 ? "99+" : itemCount }))] }));
};
export default CartIcon;
