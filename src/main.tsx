import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.tsx'
import { Toaster } from 'sonner'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'
import ReactLenis from 'lenis/react'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Toaster />
      <ReactLenis root>
        <App />
      </ReactLenis>
    </Provider>
  </StrictMode>
)
