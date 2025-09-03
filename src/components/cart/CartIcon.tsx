import React from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../contexts/CartContext";

interface CartIconProps {
  className?: string;
  showCount?: boolean;
  onClick?: () => void;
}

const CartIcon: React.FC<CartIconProps> = ({
  className = "",
  showCount = true,
  onClick,
}) => {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <div className={`relative cursor-pointer ${className}`} onClick={onClick}>
      <ShoppingCart className="w-6 h-6" />
      {showCount && itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </div>
  );
};

export default CartIcon;
