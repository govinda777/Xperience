import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Solutions from "./pages/Solutions";
import Plans from "./pages/Plans";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Community from "./pages/Community";
import Dashboard from "./pages/Dashboard";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import DefaultLayout from "./layouts/DefaultLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import "@twa-dev/sdk";
function App() {
    return (_jsx(BrowserRouter, { children: _jsx(DefaultLayout, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/solutions", element: _jsx(Solutions, {}) }), _jsx(Route, { path: "/plans", element: _jsx(Plans, {}) }), _jsx(Route, { path: "/contact", element: _jsx(Contact, {}) }), _jsx(Route, { path: "/about", element: _jsx(About, {}) }), _jsx(Route, { path: "/community", element: _jsx(Community, {}) }), _jsx(Route, { path: "/cart", element: _jsx(Cart, {}) }), _jsx(Route, { path: "/checkout", element: _jsx(Checkout, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(ProtectedRoute, { children: _jsx(Dashboard, {}) }) })] }) }) }));
}
export default App;
