const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtactPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const devMode = process.env.NODE_ENV !== 'production'

module.exports = merge(common, {
  mode: 'production',
  devtool: '',
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin([
      {
        from: 'src/pay.html',
        to: path.resolve(__dirname, 'dist')
      }
    ]),
    new MiniCssExtactPlugin({
      filename: devMode ? 'css/[name].css' : 'css/[name].[contentHash].css',
      chunkFilename: devMode ? 'css/[id].css' : 'css/[id].[contentHash].css'
    })
  ]
})
