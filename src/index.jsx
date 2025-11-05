import React from 'react';
import { BrowserRouter } from 'react-router-dom';

// assets
import 'assets/scss/style.scss';
import { PersistGate } from "redux-persist/integration/react";
import ReactDOM from 'react-dom/client'; // Correct import for React 18

// third party
import { Provider } from 'react-redux';
import { persistStore } from "redux-persist"; // Ensure you import persistStore
import { store } from './store/store';
// project import
import App from 'layout/App';
import { ConfigProvider } from 'context/ConfigContext';
import CustomCursor from 'CustomCursor';

const persistor = persistStore(store); // Initialize persistor

const rootElement = document.getElementById('root'); // Ensure this matches your HTML file
const root = ReactDOM.createRoot(rootElement); // Modern rendering

// ==============================|| MAIN - REACT DOM RENDER  ||==============

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <ConfigProvider>
          <App />

        </ConfigProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>,
);
