const merge = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const paths = require('./paths');

const commonConfig = require('./webpack.common');

module.exports = merge(
  // these go first, because "react-hot-loader/patch" has to be the first entry
  {
    ...commonConfig,
    entry: {
      embed: [path.join(paths.embedSrc, 'library.js')],
    },
  },
  {
    mode: 'production',
    stats: 'verbose',
    devtool: 'source-map',
    output: {
      libraryTarget: 'commonjs',
      library: 'CodeSandboxEmbed',
    },
    externals: ['react', 'react-dom', 'styled-components'],
    optimization: {
      // splitChunks: {
      //   // include all types of chunks
      //   chunks: 'all',
      // },
      minimizer: [
        new UglifyJSPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
          uglifyOptions: {
            mangle: {
              safari10: true,
            },
            output: {
              comments: false,
            },
          },
        }),
      ],
      concatenateModules: true, // ModuleConcatenationPlugin
      namedModules: true, // NamedModulesPlugin()
      noEmitOnErrors: true, // NoEmitOnErrorsPlugin
    },
    plugins: [
      new webpack.NormalModuleReplacementPlugin(
        new RegExp('app/components/CodeEditor$'),
        'app/components/CodeEditor/CodeMirror'
      ),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
  }
);
