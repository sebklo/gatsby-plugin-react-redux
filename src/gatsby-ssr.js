import React from 'react';
import { Provider } from 'react-redux';
import serializeJavascript from 'serialize-javascript';
import createStore from './.tmp/createStore';
import { PersistGate } from 'redux-persist/integration/react';
import { DEFAULT_OPTIONS, SCRIPT_ELEMENT_ID } from './constants';
import Providers from './.tmp/index';

const pageStores = new Map();

export const wrapRootElement = ({ element, pathname }) => {
  const { store, persistor } = createStore();
  pageStores.set(pathname, store);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Providers>{element}</Providers>
      </PersistGate>
    </Provider>
  );
};

export const onRenderBody = (
  { setHeadComponents, pathname },
  pluginOptions = {},
) => {
  const pageStore = pageStores.get(pathname);

  if (!pageStore) return;

  pageStores.delete(pathname);

  const options = {
    ...DEFAULT_OPTIONS,
    ...pluginOptions,
    serialize: {
      ...DEFAULT_OPTIONS.serialize,
      ...pluginOptions.serialize,
    },
  };

  const serializedState = serializeJavascript(
    pageStore.getState(),
    options.serialize,
  ).replace(/'/g, "\\'"); // escape single quotes inside because we wrap it in them

  const { isJSON } = options.serialize;

  setHeadComponents([
    <script
      key="redux-state"
      id={SCRIPT_ELEMENT_ID}
      dangerouslySetInnerHTML={{
        __html: `window['${options.windowKey}'] = ${
          isJSON
            ? `JSON.parse('${serializedState}')`
            : `eval('(${serializedState})')`
        }`,
      }}
    />,
  ]);
};
