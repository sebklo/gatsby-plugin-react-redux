import React from 'react';
import { Provider } from 'react-redux';
import createStore from './.tmp/createStore';
import { PersistGate } from 'redux-persist/integration/react';
import { DEFAULT_OPTIONS, SCRIPT_ELEMENT_ID } from './constants';
import Providers from './.tmp/index';

export const wrapRootElement = ({ element }, pluginOptions = {}) => {
  const preloadedState =
    window[pluginOptions.windowKey ?? DEFAULT_OPTIONS.windowKey];
  const { store, persistor } = createStore(preloadedState);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Providers>{element}</Providers>
      </PersistGate>
    </Provider>
  );
};

export const onInitialClientRender = (_, pluginOptions = {}) => {
  const shouldCleanup = Boolean(
    pluginOptions.cleanupOnClient ?? DEFAULT_OPTIONS.cleanupOnClient,
  );
  if (shouldCleanup) {
    const windowKey = pluginOptions.windowKey ?? DEFAULT_OPTIONS.windowKey;
    delete window[windowKey];

    const preloadedStateEl = document.getElementById(SCRIPT_ELEMENT_ID);
    if (preloadedStateEl) {
      preloadedStateEl.parentNode.removeChild(preloadedStateEl);
    }
  }
};
