const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const common = require('./webpack.common.js');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = merge(common, {
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].[chunkhash].js',
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				vendors: {
					test: /[\\/](node_modules|www[\\/]lib)[\\/].*\.js/,
					name: "vendors",
					chunks: "all"
				}
			}
		}
	},
	module: {
		rules: [{
			test: /\watch3D.js$/,
			exclude: /(node_modules|bower_components)/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['es2015']
				}
			}
		}]
	},
	mode: 'production',
	plugins: [
		new OptimizeCssAssetsPlugin()
	]
});