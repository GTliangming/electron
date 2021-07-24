const autoprefixer = require("autoprefixer");
const postcssSimpleVars = require("postcss-simple-vars");
const postcssNested = require("postcss-nested");

module.exports = {
	sourceMap: true,
	plugins: [
		autoprefixer(),
		postcssSimpleVars,
		postcssNested({
			bubble: ["phone"]
		})
	]
};
