# gatsby-plugin-react-redux-providers

> A [Gatsby](https://github.com/gatsbyjs/gatsby) plugin for
> [react-redux](https://github.com/reduxjs/react-redux) with
> built-in server-side rendering support, redux persistance store and adding more providers to existing ones.

## Install

`npm install --save gatsby-plugin-react-redux-providers react-redux redux-persist redux`

## How to use

`./src/state/createStore.js` // same path you provided in gatsby-config
`./src/providers/index.js` // same path you provided in gatsby-config

```javascript
import { combineReducers, configureStore, StateFromReducersMapObject } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import sessionStorage from 'redux-persist/es/storage/session';

const reducers = {
  ...
};

const persistConfig = {
  key: 'root',
  storage: sessionStorage,
};

const persistedReducer = persistReducer(persistConfig, combineReducers(reducers));
const store = configureStore({
  reducer: persistedReducer,
  preloadedState: {},
  devTools: process.env.NODE_ENV === 'development',
});

export type Dispatch = typeof store.dispatch;
export type IRootState = StateFromReducersMapObject<typeof reducers>;

export default () => {
  const persistor = persistStore(store);
  return { store, persistor };
};
```

`./gatsby-config.js`

```javascript
module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-react-redux-providers`,
      options: {
        // [required] - path to your createStore module
        pathToCreateStoreModule: './src/store/index',
        pathToCreateProviders: './src/providers/index',
        // [optional] - options passed to `serialize-javascript`
        // info: https://github.com/yahoo/serialize-javascript#options
        // will be merged with these defaults:
        serialize: {
          space: 0,
          // if `isJSON` is set to `false`, `eval` is used to deserialize redux state,
          // otherwise `JSON.parse` is used
          isJSON: true,
          unsafe: false,
          ignoreFunction: true,
        },
        // [optional] - if true will clean up after itself on the client, default:
        cleanupOnClient: true,
        // [optional] - name of key on `window` where serialized state will be stored, default:
        windowKey: '__PRELOADED_STATE__',
      },
    },
  ],
};
```

## Thanks

Thanks to [Leonid Nikiforenko](https://github.com/le0nik/) for original [plugin](https://github.com/le0nik/gatsby-plugin-react-redux/)
and [Andrea Valla](https://github.com/avalla/) for improving it with her version of [plugin](https://github.com/avalla/gatsby-plugin-react-redux-persist/) adding redux-persist package.

## License

MIT
