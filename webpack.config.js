const path = require('path');
const webpack = require('webpack');
const postcssPresetEnv = require('postcss-preset-env');
const postcssReporter = require('postcss-reporter');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autopfrefixer = require('autoprefixer');

module.exports = function(options) {
  const webpackConfig = {
    mode: options.prod ? 'production' : 'development',
    context: path.resolve(__dirname, 'src'),
    entry: './index.js',
    output: {
      library: 'storeLocator',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
      filename: 'store-locator.js'
    },
    plugins: [
      new webpack.LoaderOptionsPlugin({
        options: {
          postcss: [postcssPresetEnv({stage: 0}), postcssReporter()]
        }
      }),
      new MiniCssExtractPlugin({
        filename: 'store-locator.css',
        allChunks: true
      }),
      new webpack.ProvidePlugin({
        h: ['preact', 'h']
      })
    ],
    module: {
      rules: [
        {
          exclude: /node_modules\/(?!(p-map)\/).*/,
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            sourceType: 'unambiguous',
            plugins: [
              '@babel/plugin-transform-runtime',
              '@babel/proposal-class-properties',
              '@babel/proposal-object-rest-spread',
              '@babel/plugin-proposal-optional-chaining',
              '@babel/plugin-proposal-nullish-coalescing-operator',
              [
                '@babel/plugin-transform-react-jsx',
                {
                  pragma: 'h',
                  pragmaFrag: 'Fragment'
                }
              ]
            ],
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'entry',
                  shippedProposals: true,
                  loose: true,
                  corejs: '3'
                }
              ]
            ]
          }
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: 'storeLocator-[local]'
                }
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                plugins: () => [autopfrefixer()]
              }
            }
          ]
        },
        {
          test: /\.inline\.svg$/,
          loader: 'react-svg-inline-loader'
        },
        {
          test: /\.svg$/,
          loader: 'url-loader',
          exclude: [/\.inline\.svg$/],
          options: {
            limit: 65000,
            mimetype: 'image/svg+xml'
          }
        },
        {
          test: /\.(png|jpg)$/,
          loader: 'url-loader',
          options: {
            limit: 65000
          }
        }
      ]
    },
    resolve: {
      modules: ['./src', 'node_modules'],
      extensions: ['.js']
    },
    devServer: {
      port: process.env.PORT || 3000,
      contentBase: './src'
    }
  };

  if (!options.prod) {
    webpackConfig.devtool = 'cheap-module-eval-source-map';
  }

  return webpackConfig;
};
