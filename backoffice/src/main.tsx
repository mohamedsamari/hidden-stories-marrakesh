import { KindeProvider } from '@kinde-oss/kinde-auth-react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <KindeProvider
      domain={import.meta.env.VITE_KINDE_DOMAIN}
      clientId={import.meta.env.VITE_KINDE_CLIENT_ID}
      audience={import.meta.env.VITE_KINDE_AUDIENCE}
      redirectUri={import.meta.env.VITE_KINDE_REDIRECT_URI}
      logoutUri={import.meta.env.VITE_KINDE_REDIRECT_URI}
    >
      <App />
    </KindeProvider>
  </StrictMode>,
)
