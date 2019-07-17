const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtactPlugin = require('mini-css-extract-plugin')
const devMode = process.env.NODE_ENV !== 'production'

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtactPlugin({
      filename: devMode ? 'css/[name].css' : 'css/[name].[contentHash].css',
      chunkFilename: devMode ? 'css/[id].css' : 'css/[id].[contentHash].css'
    })
  ]
})
