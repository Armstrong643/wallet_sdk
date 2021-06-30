const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
module.exports = {
  mode: "development",
  // watch: true,
  devServer: {
    contentBase: path.join(__dirname, "./dist"),
    // compress: true,
    port: 9000,
    host: "0.0.0.0",
  },
  devtool: "inline-source-map",
  entry: "./src/main.ts",
  output: {
    path: path.join(__dirname, "./dist"),
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".json"],
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      buffer: require.resolve("buffer/"),
      stream: require.resolve("stream-browserify"),
      buffer: require.resolve("buffer/"),
    },
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimization: {
    minimize: false,
    splitChunks: {
      chunks: "all",
      minSize: 0,
      minChunks: 4,
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "FusoSDK",
    }),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
        },
      },
    ],
  },
};
