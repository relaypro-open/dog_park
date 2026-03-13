import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StylesThemeProvider } from '@mui/styles';
import './index.css';
import App from './App';
import configureStore from './store/configureStore';
import { dogTheme } from './styles/muiTheme';

export const store = configureStore({});

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ThemeProvider theme={dogTheme}>
      <StylesThemeProvider theme={dogTheme}>
        <Router>
          <App />
        </Router>
      </StylesThemeProvider>
    </ThemeProvider>
  </Provider>
);
