import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ProductCartProvider } from './context/ProductCartContext.jsx'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ProductCartProvider>
      <App />
    </ProductCartProvider>
  </StrictMode>
);
