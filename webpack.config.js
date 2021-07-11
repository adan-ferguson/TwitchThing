const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'

const HTML_FILES = ['index', 'loginredirect', 'channelauthredirect']
const htmlPlugins = []
HTML_FILES.forEach((file) => {
  htmlPlugins.push(
    new HtmlWebpackPlugin({
      filename: `${file}.html`,
      template: `client/html/${file}.html`,
      chunks: [file.replace(/-(\w)/g, (match, c) => c.toUpperCase())]
    })
  )
})

const config = {
  entry: './client/js/index.js',
  output: {
    path: path.resolve(__dirname, 'client_dist'),
  },
  plugins: [...htmlPlugins],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: 'babel-loader',
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  devtool: 'inline-source-map'
}

module.exports = () => {
  if (isProduction) {
    config.mode = 'production'
  } else {
    config.mode = 'development'
  }
  return config
}
