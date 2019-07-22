const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtactPlugin = require('mini-css-extract-plugin')

const devMode = process.env.NODE_ENV !== 'production'

// 定义多页面
const pages = [
  {
    title: '推广专区-列表页',
    pageName: 'index'
  },
  {
    title: '推广专区-详情页',
    pageName: 'detail'
  },
  {
    title: '推广专区-发布页',
    pageName: 'publish'
  },
  {
    title: '推广专区-成功页',
    pageName: 'success'
  },
  {
    title: '推广专区-个人中心',
    pageName: 'personalCenter'
  }
]

const HTMLS = pages.map(page => {
  return new HtmlWebpackPlugin({
    template: `./src/${page.pageName}.html`,
    title: page.title,
    filename: `${page.pageName}.html`,
    inject: true,
    hash: false,
    chunks: [page.pageName]
  })
})
module.exports = {
  entry: (_ => {
    return pages.reduce((acc, cur) => {
      acc[cur.pageName] = `./src/js/${cur.pageName}.js`
      return acc
    }, {})
  })(),
  output: {
    filename: 'js/[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  devServer: {
    host: '0.0.0.0',
    contentBase: './dist'
  },
  externals: {
    jquery: 'jQuery'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtactPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: [...HTMLS]
}
