const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    babel: {
      dangerouslyAddModulePathsToTranspile: ['@expo/vector-icons']
    }
  }, argv);

  // Add proper MIME type for JavaScript files
  config.devServer = {
    ...config.devServer,
    headers: {
      'Content-Type': 'application/javascript',
      'Access-Control-Allow-Origin': '*'
    }
  };

  return config;
};
