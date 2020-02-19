const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';

const config = {
  entry: {
    'jquery.range': './src/ts/jquery.range.ts',
  },
  output: {
    filename: devMode ? '[name].js' : '[name].[hash].js',
    path: path.resolve(__dirname, './docs'),
  },
  devServer: {
    open: true,
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
              hmr: devMode,
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
      filename: devMode ? '[name].css' : '[name].[hash].css',
    }),
  ],
};

module.exports = config;
