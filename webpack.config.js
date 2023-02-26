import path from 'path'

const isProduction = process.env.NODE_ENV === 'production'
const ENTRY_POINTS_DIR = './client/js/entryPoints/'
const ENTRY_POINTS = ['game', 'login', 'newuser', 'oauthredirect']

export default {
  entry: makeEntryPoints(),
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
        test: /\.(eot|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },
      { test: /\.svg$/, loader: 'svg-inline-loader' }
    ],
  },
  devtool: 'inline-source-map',
  mode: isProduction ? 'production' : 'development'
}

function makeEntryPoints(){
  const points = {}
  ENTRY_POINTS.forEach(name => points[name] = ENTRY_POINTS_DIR + name + '.js')
  return points
}
