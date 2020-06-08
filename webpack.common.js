const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== 'production';
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
	entry: {
		'app': './www/main.js'
	},
	module: {
		rules: [{
				test: /\.(sa|sc|c)ss$/,
				use: [
					devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
					'css-loader',
				],
			}, {
				test: /\.(png|svg|jpg|gif)$/,
				use: [{
					loader: 'file-loader',
					options: {
						outputPath: 'img'
					}
				}]
			},
			{
				test: /\.html$/,
				use: ["html-loader"]
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: [{
					loader: 'file-loader',
					options: {
						outputPath: 'font'
					}
				}]
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin([
			{ from: './www/libs', to: 'libs'},
			{ from: './www/css', to: 'css'},
		]),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery'
		}),
		new HtmlWebpackPlugin({
			template: './www/index-webpack.html',
			inject: true,
			hash: true,
			showErrors: true,
			minify: false
		}),
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: devMode ? 'style.css' : 'style.[contenthash].css'
		})
	]
};