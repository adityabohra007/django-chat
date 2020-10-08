const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const dotenv = require('dotenv');
const webpack = require('webpack');
const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'production',
  entry: {
    main: path.resolve(__dirname, 'src', 'index.js'),
  },
  output: {
    path: path.resolve(__dirname, '..', '..','..','static', 'chat'),
    //Chunk File
    chunkFilename: '[name].bundle.js',
    //Path to find in for browser
    // publicPath: './../../../static/frontend/',
    filename: '[name].js',
  },

  plugins: [new BundleAnalyzerPlugin()],
  plugins: [
    new Dotenv({
      path: './.env.prod',
    }),
  ],

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

  watch: true,
  watchOptions: {
    ignored: /node_modules/,
  },
  /* optimization: {
     splitChunks: {
         cacheGroups :{
             commons:{
                 test : /[\\/]node_modules[\\/]/,
                 name(module,chunks){
                     const moduleFilename=module.identifier().split("/").reduceRight(item=>item);
                     const allChunksNames =chunks.map((item)=>item.name).join('~');
                        return `${allChunksNames}~${moduleFilename}`;
                 },
                 // chunks: 'all',
             }
         }

     },
   },*/
}
