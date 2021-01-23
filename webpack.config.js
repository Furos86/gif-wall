const path = require('path');
const webpack = require('webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');




module.exports = {
  mode: 'development',
  entry: './src/frontend/main.js',

  output: {
    path: path.resolve(__dirname, 'dist/front-end')
  },

  plugins: [
    new webpack.ProgressPlugin(),
    new MiniCssExtractPlugin({ filename:'main.[contenthash].css' }),
    new HtmlWebpackPlugin(),
  ],

  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      include: [path.resolve(__dirname, 'src/frontend')],
      loader: 'babel-loader'
    }, {
      test: /.css$/,

      use: [{
        loader: MiniCssExtractPlugin.loader
      }, {
        loader: "css-loader",

        options: {
          sourceMap: true
        }
      }]
    }]
  },

  devServer: {
    open: true,
    host: 'localhost',
    contentBase:'./src/frontend',
    port:3000,
    historyApiFallback: true
  }
}
