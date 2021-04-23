'use strict'

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const devMode = process.env.NODE_ENV !== 'production'

const plugins = [
  new HtmlWebpackPlugin({
    title: 'Development',
    template: path.resolve(__dirname, 'assets', 'bundle', 'index.html'),
  }),
  new webpack.DefinePlugin({
    __DEV__: JSON.stringify(true),
    __API_HOST__: JSON.stringify('http://localhost/my-app/'),
  }),
]

if (!devMode) {
  // enable in production only
  plugins.push(new MiniCssExtractPlugin())
}

let config = {
  entry: {
    main: ['./_devapp/app.js', './_devapp/css/app.scss'],
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './assets',
    host: '0.0.0.0',
  },
  output: {
    path: path.resolve(__dirname, 'assets', 'bundle'),
    filename: '[name].bundle.js',
    clean: true,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|tsx|ts)$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
            plugins: [
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              '@babel/plugin-syntax-dynamic-import',
              ['@babel/plugin-proposal-class-properties', { loose: true }],
            ],
          },
        },
      },
      {
        test: /\.(sc|c)ss$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /.(png|woff(2)?|eot|ttf|svg|gif)(\?[a-z0-9=\.]+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '../css/[hash].[ext]',
            },
          },
        ],
      },
    ],
  },
  externals: {
    myApp: 'myApp',
  },
}

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        sequences: true,
        conditionals: true,
        booleans: true,
        if_return: true,
        join_vars: true,
        drop_console: true,
      },
      output: {
        comments: false,
      },
      minimize: true,
    })
  )
}

module.exports = config
