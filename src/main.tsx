import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'
import { AutotrackerProvider } from './components/AutotrackerProvider.tsx'
import { SettingsProvider } from './components/SettingsProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <SettingsProvider>
        <AutotrackerProvider>
          <App />
        </AutotrackerProvider>
      </SettingsProvider>
    </Provider>
  </StrictMode>,
)
