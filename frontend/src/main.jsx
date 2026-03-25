import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import axios from 'axios'

// Set base URL for API requests. 
// In dev, this falls back to '', which lets Vite's proxy handle '/api'
// In prod, set VITE_API_URL in Vercel to your Render backend URL (e.g. https://your-backend.onrender.com)
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <CartProvider>
                <App />
            </CartProvider>
        </AuthProvider>
    </StrictMode>,
)
