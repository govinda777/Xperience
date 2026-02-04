import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Solutions from "./pages/Solutions";
import Plans from "./pages/Plans";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Community from "./pages/Community";
import Dashboard from "./pages/Dashboard";
import Agents from "./pages/Agents";
import Nation from "./pages/Nation";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import LeadsManager from "./pages/LeadsManager";
import DefaultLayout from "./layouts/DefaultLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import "@twa-dev/sdk";

function App() {
  return (
    <BrowserRouter>
      <DefaultLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/community" element={<Community />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/leads" element={<LeadsManager />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agents"
            element={
              <ProtectedRoute>
                <Agents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nation"
            element={
              <ProtectedRoute>
                <Nation />
              </ProtectedRoute>
            }
          />
        </Routes>
      </DefaultLayout>
    </BrowserRouter>
  );
}

export default App;
