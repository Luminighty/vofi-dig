const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const config = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),    
    filename: '[name].bundle.js',
  },
  devServer: {
    port: 8080,
    watchFiles: [
      'src/**/*',
      'assets/**/*'
    ],
    proxy: {
      '/assets': 'http://localhost:8081',
    },
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
        include: path.resolve("src/components/registry.js"),
        use: [
          {
            loader: path.resolve('utils/ComponentRegistryLoader.js'),
            options: {
              path: 'src/components',
              dir: __dirname,
            }
          }
        ]
      },
      {
        test: /\.ts(x)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
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
        test: /\.css$/i,
        use: ["css-loader"],
      },
      {
        test: /\.html$/i,
        use: ["html-loader"],
      },
    ]
  },
  resolve: {
    extensions: [
      '.tsx',
      '.ts',
      '.js'
    ],
  },
  plugins: [
    new Dotenv({
      path: webpack.mode
    }),
    new CopyPlugin({
      patterns: [
        { from: 'assets/**' },
      ],
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: "src/index.html"
    })
  ]
};

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";
  config.plugins.push(new Dotenv({
    path: isProduction ? ".env" : ".env.local"
  }));
  return config;
}