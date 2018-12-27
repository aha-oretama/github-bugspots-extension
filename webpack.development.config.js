const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: ['@babel/polyfill', path.resolve(__dirname, 'src/bundle/content.js')],
  mode: 'development',
  output: {
    filename: 'content.bundle.js',
    path: path.resolve(__dirname, 'dev/igrigorik/bugspots')
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'dev/igrigorik/bugspots'),
    index: 'test.html',
    publicPath: 'http://localhost:8080/igrigorik/bugspots/',
    openPage: 'igrigorik/bugspots/test.html'
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
      from: path.resolve(__dirname, 'test/support/test.html')
    }])
  ],
};
