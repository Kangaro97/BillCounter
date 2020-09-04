const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const devMode = process.env.NODE_ENV !== 'production';
module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    app: './index.js'
  },
  output: {
    filename: devMode ? '[name].js' : '[name].[hash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    minimizer: devMode ? [] : [new TerserPlugin(), new OptimizeCssAssetsPlugin()]
  },
  devtool: 'source-map',
  devServer: {
    port: 4200,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: !devMode //удаляет табуляцию в режиме production
      }
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css'
    }),
    new CopyWebpackPlugin({
      patterns: [{
        from: path.resolve(__dirname, 'src/favicon.ico'),
        to: path.resolve(__dirname, 'dist')
      }]
    })
  ],
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'eslint-loader',
      options: {
        env: {
          browser: true,
          es2020: true
        },
        plugins: ["@babel"],
        extends: "eslint:recommended",
        parserOptions: {
          ecmaVersion: 11,
          sourceType: "module"
        },
        parser: "@babel/eslint-parser",
      }
    },
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: {
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env'
          ],
          plugins: [
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-proposal-private-methods'
          ]
        }
      }
    }, {
      test: /\.css$/,
      exclude: /node_modules/,
      use: [{
        loader: MiniCssExtractPlugin.loader,
        options: {
          hmr: devMode,
          reloadAll: true
        }
      }, 'css-loader']
    }, {
      test: /\.(png|jpg|gif|svg)$/,
      exclude: /node_modules/,
      loader: ['file-loader']
    }, {
      test: /\.(ttf|woff|woff2|eot)$/,
      exclude: /node_modules/,
      loader: ['file-loader']
    }]
  }
};