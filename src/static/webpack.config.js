const webpack = require('webpack');

const config = {
    entry: __dirname + '/js/index.jsx',
    output: {
	path: __dirname + '/dist',
	filename: 'bundle.js',
    },
    resolve: {
	extensions: ['.js', '.jsx', '.css']
    },
    module: {
	rules: [
	    {
		test: /\.jsx?/,
		exclude: /node_modules/,
		use: 'babel-loader'
	    }
	]
    },
    plugins: [
	new webpack.DefinePlugin({
	    'GITHUB_CLIENT': '2b4ff89d2dd91e089b98'})
    ]
    
};

module.exports = config;
