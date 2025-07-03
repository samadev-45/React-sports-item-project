import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'tailwindcss'
import App from './App'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/MyContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <App />
     <ToastContainer position="top-right" autoClose={3000} />
     </AuthProvider>
  </StrictMode>,
)
