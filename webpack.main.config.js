const path = require("path");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
	entry: {
		index: path.resolve(__dirname, "./main-process/main"),
	},
	output: {
		path: path.resolve(__dirname, "./build"),
		publicPath: "/",
	},
	mode: "production",
	devtool: "source-map",
	resolve: {
		extensions: [".js", ".jsx"],
		modules: [
			path.resolve(__dirname, "main-process"),
			"node_modules"
		]
	},
	target: "electron-main",
	module: {
		rules: [
			{
				test: /\.js$/,
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
		],
	},
	node: {
		__dirname: false,
	},
	optimization: {
		minimizer: [new UglifyJSPlugin()]
	},
	resolveLoader: {
		moduleExtensions: ["-loader"]
	},
}