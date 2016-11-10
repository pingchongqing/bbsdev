var webpack = require("webpack");

const vendors = [
  'react',
  'jquery',
  'lodash',
  'redux',
  'redux-thunk',
  'react-router',
  'react-redux',
  'react-router-redux',
  'react-addons-transition-group',
  'react-addons-css-transition-group'
];

var config = {
  entry:{
    vendor: vendors,
  },
  output: {
    path: './build/',
    filename: '[name].[chunkhash].js',
    library: '[name]_[chunkhash]',
  },

  plugins: [
    new webpack.DllPlugin({
        path: 'manifest.json',
        name: '[name]_[chunkhash]',
        context: __dirname,
      }),
    new webpack.DefinePlugin({ //编译成生产版本
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ]

};

module.exports = config;
