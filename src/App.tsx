import React from 'react';
import "./App.css";
import Home from './pages/Home';
import DefaultLayout from './layouts/DefaultLayout';
import "@twa-dev/sdk";

function App() {
  return (
    <DefaultLayout>
      <Home />
    </DefaultLayout>
  );
}

export default App;