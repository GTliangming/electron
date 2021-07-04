const path = require("path");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

const isDev = process.env.NODE_ENV !== "production";

module.exports = {
  entry: {
    main: path.resolve(__dirname, "./src"),
  },
  output: {
    path: path.resolve(__dirname, "./build"),
    publicPath: "/",
  },
  mode: isDev ? "development" : "production",
  devtool: isDev ? "inline-source-map" : "source-map",
  resolve: {
    extensions: [".webpack.js", ".js", ".jsx", ".tsx", ".ts"],
    modules: [
      path.resolve(__dirname, "src"),
      "node_modules"
    ]
  },
  target: "electron-renderer",
  node: {
    __dirname: false,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "thread",
            options: {
              workers: require("os").cpus().length - 1
            }
          },
          "babel"
        ]
      },
      {
        test: /\.css$/,
        use: ["style", "css", "postcss"]
      },
      {
        test: /\.scss$/,
        include: path.join(__dirname, "./src"),
        use: [
          "style",
          {
            loader: "css",
            options: {
              modules: {
                mode: 'local',
                localIdentName: "[local]_[hash:base64:5]",
              },
              importLoaders: 1
            }
          },
          "postcss"
        ]
      },
    ],
  },
  optimization: {
    minimizer: isDev ? [] : [new UglifyJSPlugin()]
  },
  resolveLoader: {
    moduleExtensions: ["-loader"]
  },
}