import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { ThemeProvider } from 'next-themes' // <-- importar ThemeProvider

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" enableSystem defaultTheme="system">
    <App />
  </ThemeProvider>
);
