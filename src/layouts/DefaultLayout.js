import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HelmetProvider } from "react-helmet-async";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AnalyticsProvider } from "../contexts/AnalyticsContext";
const DefaultLayout = ({ children }) => {
    return (_jsx(HelmetProvider, { children: _jsxs(AnalyticsProvider, { children: [_jsxs("div", { className: "min-h-screen w-full bg-[#FD9526]", children: [_jsx(Navbar, {}), _jsx("main", { children: children })] }), _jsx(Footer, {})] }) }));
};
export default DefaultLayout;
