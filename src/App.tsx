// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./App.css";
import Home from './pages/Home';
import Solutions from './pages/Solutions';
import DefaultLayout from './layouts/DefaultLayout';
import "@twa-dev/sdk";

function App() {
  return (
    <BrowserRouter>
      <DefaultLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/solutions" element={<Solutions />} />
        </Routes>
      </DefaultLayout>
    </BrowserRouter>
  );
}

export default App;