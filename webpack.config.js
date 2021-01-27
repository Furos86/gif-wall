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
  devtool: 'source-map',
  devServer: {
    open: true,
    host: 'localhost',
    port:3000,
    proxy:{
      '/upload': {
        target:'http://localhost:80'
      },
      '/image': {
        target:'http://localhost:80'
      }
    }
  }
}
