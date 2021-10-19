module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-react-redux',
      options: {
        pathToCreateStoreModule: './src/state/createStore',
        pathToCreateProviders: './src/providers/index',
        cleanupOnClient: false,
        serialize: {
          isJSON: false,
        },
      },
    },
  ],
};
