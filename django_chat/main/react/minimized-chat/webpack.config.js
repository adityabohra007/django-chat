module.exports = {
    mode:'development',
  module: {
    rules: [
        { test: /\.css$/, use: 'css-loader',exclude:/node_modules/},
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
watch: true,
  watchOptions: {
    ignored: /node_modules/,
  },
output:{
    filename: '../../../static/minimized-chat/main.js',
        }
};
