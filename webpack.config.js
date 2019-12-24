const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  watch: true,
  devtool: 'inline-source-map',
  mode: 'development',
  entry: [
    './src/ts/plugin.ts',
    './src/ts/demo.ts',
    './src/scss/jquery.range.scss',
  ],
  output: {
    filename: 'jquery.range.js',
    path: path.resolve(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devServer: {
    contentBase: path.join(__dirname, './dist'),
    compress: true,
    hot: true,
  },
  plugins: [
    new htmlWebpackPlugin({
      inject: true,
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'jquery.range.css',
    }),
  ],

};
