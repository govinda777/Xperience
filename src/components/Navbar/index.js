import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import AuthButton from "../AuthButton";
import CartIcon from "../cart/CartIcon";
import CartSidebar from "../cart/CartSidebar";
const logo = new URL("/public/logo.svg", import.meta.url).href;
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { authenticated, user } = usePrivy(); // Obtém status de login e informações do usuário
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    const navItems = [
        { name: "Soluções", path: "/solutions" },
        { name: "Quem somos", path: "/about" },
        { name: "Contato", path: "/contact" },
        { name: "Comunidade", path: "/community" },
        { name: "Blog", path: "/blog" },
        { name: "Planos", path: "/plans" },
        {
            name: "IA do Empreendedor",
            path: "https://ai-entrepreneur-connect.replit.app",
            external: true,
        },
    ];
    return (_jsxs("header", { className: `w-full px-4 md:px-6 py-6 bg-white transition-all duration-300 ${isScrolled
            ? `fixed top-0 left-0 w-full z-50  ${isOpen ? "bg-white" : "bg-white/60"}`
            : "relative"}`, children: [_jsxs("div", { className: "max-w-7xl mx-auto flex items-center justify-between", children: [_jsx("div", { className: "flex items-center", children: _jsx(Link, { to: "/", children: _jsx("img", { src: logo, alt: "Xperience", className: "w-[100px] h-auto" }) }) }), _jsx("nav", { className: "hidden md:flex gap-8", children: navItems.map((item) => item.external ? (_jsxs("a", { href: item.path, target: "_blank", rel: "noopener noreferrer", className: "relative text-lg text-gray-900 hover:text-gray-900 whitespace-nowrap transition-colors duration-300 group", children: [item.name, _jsx("span", { className: "absolute -bottom-1 left-0 h-0.5 bg-black transition-all duration-300 w-0 group-hover:w-full" })] }, item.name)) : (_jsxs(Link, { to: item.path, className: `relative text-lg text-gray-900 hover:text-gray-900 whitespace-nowrap transition-colors duration-300 group ${location.pathname === item.path ? "font-medium" : ""}`, children: [item.name, _jsx("span", { className: `absolute -bottom-1 left-0 h-0.5 bg-black transition-all duration-300 ${location.pathname === item.path
                                        ? "w-full"
                                        : "w-0 group-hover:w-full"}` })] }, item.name))) }), _jsxs("div", { className: "hidden md:flex items-center gap-4", children: [_jsx(CartIcon, { onClick: () => setIsCartOpen(true), className: "text-gray-700 hover:text-gray-900 transition-colors" }), authenticated ? (_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(User, { className: "h-8 w-8 text-gray-700 cursor-pointer", onClick: () => navigate("/dashboard") }), _jsx(AuthButton, {})] })) : (_jsx(AuthButton, {}))] }), _jsx("button", { className: "md:hidden transition-transform duration-300 hover:scale-110", onClick: () => setIsOpen(!isOpen), children: isOpen ? _jsx(X, { className: "h-6 w-6" }) : _jsx(Menu, { className: "h-6 w-6" }) })] }), isOpen && (_jsx("div", { className: "md:hidden fixed inset-0 top-[72px] bg-[#FED7AA] z-50 mt-2", children: _jsxs("div", { className: "flex flex-col p-4 space-y-4", children: [_jsx("nav", { className: "flex flex-col space-y-4", children: navItems.map((item) => item.external ? (_jsxs("a", { href: item.path, target: "_blank", rel: "noopener noreferrer", className: "relative text-lg text-gray-900 hover:text-gray-900 transition-colors duration-300 group w-fit", onClick: () => setIsOpen(false), children: [item.name, _jsx("span", { className: "absolute -bottom-1 left-0 h-0.5 bg-black transition-all duration-300 w-0 group-hover:w-full" })] }, item.name)) : (_jsxs(Link, { to: item.path, className: `relative text-lg text-gray-900 hover:text-gray-900 transition-colors duration-300 group w-fit ${location.pathname === item.path ? "font-medium" : ""}`, onClick: () => setIsOpen(false), children: [item.name, _jsx("span", { className: `absolute -bottom-1 left-0 h-0.5 bg-black transition-all duration-300 ${location.pathname === item.path
                                            ? "w-full"
                                            : "w-0 group-hover:w-full"}` })] }, item.name))) }), _jsxs("div", { className: "flex flex-col space-y-4 pt-4", children: [_jsx("div", { className: "flex justify-center", children: _jsx(CartIcon, { onClick: () => {
                                            setIsCartOpen(true);
                                            setIsOpen(false);
                                        }, className: "text-gray-700 hover:text-gray-900 transition-colors" }) }), authenticated ? (_jsxs("div", { className: "flex flex-col items-center", children: [_jsx(User, { className: "h-6 w-6 text-gray-700 cursor-pointer", onClick: () => {
                                                navigate("/dashboard");
                                                setIsOpen(false);
                                            } }), _jsx("p", { className: "text-lg", children: user?.email?.address?.split("@")[0] ||
                                                user?.wallet?.address?.slice(0, 10) + "..." ||
                                                "Usuário" }), _jsx(AuthButton, {})] })) : (_jsx(AuthButton, {}))] })] }) })), _jsx(CartSidebar, { isOpen: isCartOpen, onClose: () => setIsCartOpen(false) })] }));
};
export default Navbar;
