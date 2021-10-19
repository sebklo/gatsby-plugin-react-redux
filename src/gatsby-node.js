import fs from 'fs';
import path from 'path';
import os from 'os';
import util from 'util';

const mkdirAsync = util.promisify(fs.mkdir);
const writeFileAsync = util.promisify(fs.writeFile);

export const onPreBootstrap = (
  { store },
  { pathToCreateStoreModule, pathToCreateProviders } = {},
) => {
  if (!pathToCreateStoreModule) {
    throw new Error(
      '[gatsby-plugin-react-redux]: missing required option "pathToCreateStoreModule"',
    );
  }
  if (!pathToCreateProviders) {
    throw new Error(
      '[gatsby-plugin-react-redux]: missing required option "pathToCreateProviders"',
    );
  }

  const { program } = store.getState();
  // Create proxy file that imports user's `createStore` module
  // We need it to have static require on the client
  let module = `module.exports = require("${
    path.isAbsolute(pathToCreateStoreModule)
      ? pathToCreateStoreModule
      : path.join(program.directory, pathToCreateStoreModule)
  }")`;
  let module2 = `module.exports = require("${
    path.isAbsolute(pathToCreateProviders)
      ? pathToCreateProviders
      : path.join(program.directory, pathToCreateProviders)
  }")`;

  if (os.platform() === 'win32') {
    module = module.split('\\').join('\\\\');
    module2 = module2.split('\\').join('\\\\');
  }

  const dir = `${__dirname}/.tmp`;

  let promise = Promise.resolve(null);
  if (!fs.existsSync(dir)) {
    promise = promise.then(() => mkdirAsync(dir));
  }

  return promise.then(async () => {
    await writeFileAsync(`${dir}/createStore.js`, module);
    await writeFileAsync(`${dir}/index.js`, module2);
  });
};
