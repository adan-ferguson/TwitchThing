import path from 'path'

const isProduction = process.env.NODE_ENV === 'production'

export default {
  entry: {
    index: './client/js/index.js',
    login: './client/js/login.js'
  },
  output: {
    path: path.resolve('client_dist/scripts')
  },
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
    ],
  },
  devtool: 'inline-source-map',
  mode: isProduction ? 'production' : 'development'
}
