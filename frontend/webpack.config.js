const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
    // Other rules...
    resolve: {
        fallback: {
          fs: false, // or require.resolve("path-browserify")
          path: false, // or require.resolve("path-browserify")
          os: false, // or require.resolve("os-browserify/browser")
        },
      },
    plugins: [
        new NodePolyfillPlugin()
    ]
    
}