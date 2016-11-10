var webpack = require("webpack");
var path = require("path");
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var ExtractTextPlugin = require('extract-text-webpack-plugin'); //css单独打包


var ExtractLess = new ExtractTextPlugin('./[name].css');

var config = {
  entry:{
    app:[
      './js/index.js'
    ]
  },
  output: {
    path: './build/',
    filename: 'bundle.js',
    publicPath: '/build/',
    chunkFilename: "[id].bundle.js"
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, "js")
        ],
        exclude: [
          path.resolve(__dirname, "build"),
          path.resolve(__dirname, "node_modules")
        ],
        loader: 'babel-loader'
      } ,
      {
        test: /\.jsx$/,
        include: [
          path.resolve(__dirname, "js")
        ],
        exclude: [
          path.resolve(__dirname, "build"),
          path.resolve(__dirname, "node_modules")
        ],
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        exclude: /^node_modules$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader')
      }, {
        test: /\.less/,
        exclude: /^node_modules$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!less-loader')
      }, {
        test: /\.(eot|woff|svg|ttf|woff2|gif|appcache)(\?|$)/,
        exclude: /^node_modules$/,
        loader: 'file-loader?name=[name].[ext]'
      }, {
        test: /\.(png|jpg)$/,
        exclude: /^node_modules$/,
        loader: 'url?limit=20000&name=[name].[ext]' //注意后面那个limit的参数，当你图片大小小于这个限制的时候，会自动启用base64编码图片
      }
    ]
  },
  postcss: function() {
    return [precss, autoprefixer];
  },
  plugins: [
    ExtractLess,
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./manifest.json'),
    }),
    new webpack.DefinePlugin({ //编译成生产版本
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ],

  resolve: {
    extensions: ['', '.js', '.jsx'],
  }

};

module.exports = config;
