import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { NotFoundPage } from './not-found.tsx'

/**
 * Lightweight path-based routing — no react-router needed.
 * The portfolio lives at "/" (and "/#section" anchors).
 * Any other pathname (e.g. /foo, /projects/bar) renders the 404 page.
 */
const isKnownPath = window.location.pathname === '/';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isKnownPath ? <App /> : <NotFoundPage />}
  </StrictMode>,
)

