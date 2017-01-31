'use strict';

var webpack = require('webpack'),
    CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin"),
    path = require('path');

var isProdBuild = process.env.NODE_ENV === 'production';

var configGlobals = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse(!isProdBuild)),
    __PROD__: JSON.stringify(JSON.parse(isProdBuild)),
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
        configGlobals,
        new CommonsChunkPlugin("commons.chunk.js"),
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
