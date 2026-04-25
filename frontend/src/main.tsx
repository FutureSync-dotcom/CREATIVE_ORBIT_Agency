import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')

if (apiBaseUrl) {
  const nativeFetch = window.fetch.bind(window)
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    if (typeof input === 'string' && input.startsWith('/api')) {
      return nativeFetch(`${apiBaseUrl}${input}`, init)
    }

    if (input instanceof URL && input.pathname.startsWith('/api')) {
      return nativeFetch(new URL(`${apiBaseUrl}${input.pathname}${input.search}`), init)
    }

    return nativeFetch(input, init)
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
