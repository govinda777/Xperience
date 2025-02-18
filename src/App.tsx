// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./App.css";
import Home from './pages/Home';
import Solutions from './pages/Solutions';
import Plans from './pages/Plans';
import Contact from './pages/Contact';
import About from './pages/About';
import DefaultLayout from './layouts/DefaultLayout';
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
        </Routes>
      </DefaultLayout>
    </BrowserRouter>
  );
}

export default App;