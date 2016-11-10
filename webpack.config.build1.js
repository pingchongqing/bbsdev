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
    ],
    react:[
      'react',
      'react-dom',
      'redux',
      'redux-thunk',
      'react-router',
      'react-redux',
      'react-router-redux',
      'react-addons-transition-group',
      'react-addons-css-transition-group'],
    jquery:['jquery'],
    lodash:['lodash']
  },
  output: {
    path: './build/',
    filename: 'bundle.[hash].js',
    publicPath: '/build/',
    library: '[name]_[chunkhash]'
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
    /*new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./manifest.json'),
    })*/
    new webpack.optimize.CommonsChunkPlugin({
      names:['jquery','react','lodash'],
      filename:'[name].js',
      minChunks: Infinity
    })
  ],

  resolve: {
    extensions: ['', '.js', '.jsx'],
  }

};

module.exports = config;
