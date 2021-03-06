'use strict';

var webpack = require('webpack'),
    path = require('path');

var isProdBuild = process.env.NODE_ENV === 'production';

var configGlobals = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse(!isProdBuild)),
    __PROD__: JSON.stringify(JSON.parse(isProdBuild)),
    'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }
});

var webpackConfig = {
    devtool: 'eval',
    entry: {
        main: [
            './src/main'
        ]
    },

    output: {
        path: path.resolve('./static/build'),
        filename: '[name].js',
        publicPath: '/static/build/'
    },

    resolve: {
        root: [path.resolve('./src'), path.resolve('./lib')],
        extensions: ['', '.js', '.jsx', '.json'],
        alias: {
            images: __dirname + '/static/images'
        }
    },

    plugins: [
        configGlobals
    ],

    module: {
        preLoaders: [
            {
                test: /\.js/,
                loader: "eslint",
                exclude: /node_modules/
            }
        ],

        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: ['babel'],
            },
            {
                test: /\.css$/,
                loaders: ['style', 'css']
            },
            {
                test: /\.scss$/,
                loaders: ["style", "css", "sass"]
            },
            {
                test: /\.svg$/,
                loader: 'raw'
            },
        ],
    }
};

module.exports = webpackConfig;
