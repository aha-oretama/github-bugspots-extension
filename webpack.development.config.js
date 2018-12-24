const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: ['@babel/polyfill', path.resolve(__dirname, 'src/bundle/content.js')],
  mode: 'development',
  output: {
    filename: 'content.bundle.js',
    path: path.resolve(__dirname, 'dev')
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'dev'),
    index: 'test.html'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dev']),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, 'src/origin')
    }, {
      from: path.resolve(__dirname, 'test/test.html')
    }])
  ],
};
