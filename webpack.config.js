import webpack from 'webpack';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default options => {
  const webpackConfig = {
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
          postcss: [
            require('postcss-cssnext')({
              browsers: ['>0.25%', 'not op_mini all', 'ie 11']
            }),
            require('postcss-reporter')()
          ]
        }
      }),
      new ExtractTextPlugin({
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
            plugins: [
              'transform-class-properties',
              'transform-object-rest-spread',
              ['transform-react-jsx', {pragma: 'h'}]
            ],
            presets: [
              [
                'env',
                {
                  targets: {
                    browsers: ['>0.25%', 'not op_mini all', 'ie 11']
                  },
                  modules: false,
                  loose: true
                }
              ]
            ]
          }
        },
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                query: {
                  modules: true,
                  importLoaders: 1,
                  localIdentName: 'storeLocator-[local]'
                }
              },
              'postcss-loader'
            ]
          })
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
      contentBase: './src',
      open: true
    }
  };

  if (options.dev) {
    webpackConfig.devtool = 'cheap-module-eval-source-map';
  }

  if (options.prod) {
    webpackConfig.plugins.push(
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': 'production'
      }),
      new webpack.optimize.AggressiveMergingPlugin(),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        cache: true,
        sourceMap: true
      })
    );
  }

  return webpackConfig;
};
