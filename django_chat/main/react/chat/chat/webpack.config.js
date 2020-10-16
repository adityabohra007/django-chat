const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    main: path.resolve(__dirname, 'src', 'index.js'),
  },
  output: {
    path: path.resolve(__dirname, '..', '..','..','static','chat'),
    //Chunk File
    chunkFilename: '[name].bundle.js',
    //Path to find in for browser
    // publicPath: './../../../static/frontend/',
    filename: '[name].js',
  },


  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
}





