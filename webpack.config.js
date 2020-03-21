var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

// 环境变量, dev, (test), online
var WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';

// webpack config
var config = {
	entry: {
		'app': ['./src/index.jsx']
	},
	externals: {
		'$': 'window.jQuery',
		'jquery': 'window.jQuery'
	},
	// path && publickPath
	output: {
		path: __dirname + '/dist',
		//publicPath: WEBPACK_ENV === 'online' ? '//s.tiancaikia.xyz/mmall_admin_fe/dist/' : '/dist/',
		publicPath: 'dev' === WEBPACK_ENV ? '/dist/' : '//s.tiancaikai.xyz/mmall_admin_fe/dist/',
		filename: 'js/[name].js'
	},
	resolve: {
		alias: {
			node_modules: path.join(__dirname, '/node_modules'),
			lib: path.join(__dirname, '/src/lib'),
			util: path.join(__dirname, '/src/util'),
			component: path.join(__dirname, '/src/component'),
			service: path.join(__dirname, '/src/service'),
			page: path.join(__dirname, '/src/page'),
		}
	},
	module: {
		rules: [{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					use: 'css-loader',
					fallback: 'style-loader'
				})
			},
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					use: 'css-loader!sass-loader',
					fallback: 'style-loader'
				})
			},
			{
				test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
				loader: 'url-loader?limit=20000&name=resource/[name].[ext]'
			},
			{
				test: /\.(string)$/,
				loader: 'html-loader',
				query: {
					// 需要压缩
					  minimize : true,
					  // 压缩的时候 不要删除引号
					  removeAttributeQuotes : false
				}
			},
			{
				test: /\.js?$/,
				exclude: /(node_modules)/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015']
				}
			},
			{
				test: /\.jsx?$/,
				exclude: /(node_modules)/,
				loader: 'babel-loader',
				query: {
					presets: ['react', 'es2015']
				}
			},
		]
	},
	plugins: [
		// 单独处理css
		new ExtractTextPlugin('css/[name].css'),
		// html 加载
		new HtmlWebpackPlugin({
			filename: 'view/index.html',
			title: 'MMall 后台管理系统',
			template: './src/index.html',
			favicon: './favicon.ico',
			inject: true,
			hash: true,
			chunks: ['vendors', 'app'],
			chunksSortMode: 'dependency'
		}),
	],
	//独立通用模块
	optimization: {
		splitChunks: {
			//只抽离属于动态引入的文件
			chunks: 'async',
			minSize: 30000,
			maxSize: 0,
			minChunks: 1,
			maxAsyncRequests: 5,
			maxInitialRequests: 3,
			automaticNameDelimiter: '~',
			automaticNameMaxLength: 30,
			name: true,
			cacheGroups: {
				commons: {
					name: "vendors",
					filename: "js/base.js",
					chunks: "initial",
					minChunks: 2,
					minSize: 0
				}
			}
		}
	}
};

// 开发环境下，使用devServer热加载
if (WEBPACK_ENV === 'dev') {
	config.entry.app.push('webpack-dev-server/client?http://localhost:8086');
}

module.exports = config;
