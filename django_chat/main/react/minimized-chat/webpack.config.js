module.exports = {
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

output:{
    filename: '../../../greeninfra/static/minimizedChat/main.js',
        }
};
