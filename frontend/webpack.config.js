//eslint-disable-next-line no-undef
const HtmlWebpackPlugin = require('html-webpack-plugin');
//eslint-disable-next-line no-undef
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//eslint-disable-next-line no-undef
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

//eslint-disable-next-line no-undef
module.exports = (env) => ({
	entry: './src/scripts/main.js',
	output: {
		filename: 'main.[contenthash].js',
		publicPath: '/',
	},
	module: {
		rules: [
			{
				test: /\.(?:js|mjs|cjs)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							['@babel/preset-env', { targets: 'defaults' }],
						],
					},
				},
			},
			{
				test: /\.scss$/i,
				use: [
					env.prod ? MiniCssExtractPlugin.loader : 'style-loader',
					'css-loader',
					'sass-loader',
				],
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif|woff|woff2)$/i,
				type: 'asset/resource',
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: 'main.[сontenthash].css',
		}),
	],
	devServer: {
		historyApiFallback: true,
		hot: true,
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
				pathRewrite: { '^/api': '' },
			},
		},
	},
	optimization: {
		minimizer: [
			'...',
			new ImageMinimizerPlugin({
				minimizer: {
					implementation: ImageMinimizerPlugin.svgoMinify,
					options: {
						encodeOptions: {
							multipass: true,
							plugins: ['preset-default'],
						},
					},
				},
			}),
		],
	},
});
