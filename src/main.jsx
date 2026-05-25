import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Catalog from './pages/Catalog.jsx'
import ChatWidget from './components/ChatWidget'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/imoveis" element={<Catalog />} />
      </Routes>
      <ChatWidget />
    </BrowserRouter>
  </React.StrictMode>,
)
