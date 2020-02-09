const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  watch: true,
  devtool: 'inline-source-map',
  mode: 'development',
  entry: './src/ts/jquery.range.ts',
  optimization: {
    minimizer: [
      new TerserPlugin({
        sourceMap: false,
        // exclude: path.resolve(__dirname, 'node_modules'),
      }),
    ],
  },
  output: {
    filename: 'jquery.range.js',
    path: path.resolve(__dirname, './docs'),
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
    contentBase: path.join(__dirname, './docs'),
    compress: true,
    hot: true,
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './node_modules/jquery/dist/jquery.min.js', to: './jquery.min.js' },
      { from: './src/demo/style.css', to: './style.css' },
      { from: './src/demo/favicons', to: './favicons' },
    ]),
    new HtmlWebpackPlugin({
      inject: true,
      template: './src/demo/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'jquery.range.css',
    }),
  ],

};
