import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import mainTheme from './themes/mainTheme';
import './global.css';
import './index.css';
import { InstallPromptProvider } from './context/InstallPromptContext.jsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
