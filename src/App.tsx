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
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import LeadsManager from "./pages/LeadsManager";
import Transparencia from "./pages/Transparencia";
import HealthDashboard from "./pages/Health";
import TestSessionPage from "./pages/TestSession";
import TrailList from "./pages/Trails/TrailList";
import TrailRunnerPage from "./pages/Trails/TrailRunnerPage";
import DefaultLayout from "./layouts/DefaultLayout";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { HelmetProvider } from "react-helmet-async";
import { AnalyticsProvider } from "./contexts/AnalyticsContext";
import "@twa-dev/sdk";

function App() {
  return (
    <HelmetProvider>
      <AnalyticsProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes with DefaultLayout */}
            <Route element={<DefaultLayout><Home /></DefaultLayout>} path="/" />
            <Route element={<DefaultLayout><Solutions /></DefaultLayout>} path="/solutions" />
            <Route element={<DefaultLayout><Plans /></DefaultLayout>} path="/plans" />
            <Route element={<DefaultLayout><Contact /></DefaultLayout>} path="/contact" />
            <Route element={<DefaultLayout><About /></DefaultLayout>} path="/about" />
            <Route element={<DefaultLayout><Community /></DefaultLayout>} path="/community" />
            <Route element={<DefaultLayout><Cart /></DefaultLayout>} path="/cart" />
            <Route element={<DefaultLayout><Checkout /></DefaultLayout>} path="/checkout" />
            <Route element={<DefaultLayout><LeadsManager /></DefaultLayout>} path="/leads" />
            <Route element={<DefaultLayout><Transparencia /></DefaultLayout>} path="/transparencia" />
            <Route element={<DefaultLayout><TestSessionPage /></DefaultLayout>} path="/test-session" />

            {/* App Routes with AppLayout and ProtectedRoute */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/agents"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Agents />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/health"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <HealthDashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/trails"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <TrailList />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/trails/:trailId"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <TrailRunnerPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AnalyticsProvider>
    </HelmetProvider>
  );
}

export default App;
