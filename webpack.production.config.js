const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');

module.exports = {
  entry: ['@babel/polyfill', './src/bundle/content.js'],
  mode: 'production',
  output: {
    filename: 'content.bundle.js',
    path: path.resolve(__dirname, 'dist')
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
    new CleanWebpackPlugin(['dist', 'output']),
    new CopyWebpackPlugin([{
      from: 'src/origin'
    }]),
    new ZipPlugin({
      path: '../output',
      filename: 'github-bugspots-extension.zip',
    })
  ]
};
