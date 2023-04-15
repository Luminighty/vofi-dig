const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: './client/index.ts',
  output: {
    path: path.resolve(__dirname, 'public_html'),    
    filename: '[name].bundle.js',
  },
  externals: {
    pixijs: {
      commonjs: 'pixijs',
      commonjs2: 'pixijs',
      amd: 'pixijs',
      root: 'PIXI',
    },
  },
  module: {
    rules: [
      {
        test: /\.ts(x)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              mimetype: 'image/png'
            }
          }
        ]
      },
      {
        test: /\.xml$/i,
        use: ['xml-loader'],
      }
    ]
  },
  resolve: {
    extensions: [
      '.tsx',
      '.ts',
      '.js'
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'assets/**' }],
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: "client/index.html"
    })
  ]
};

module.exports = config;