#!/usr/bin/env node

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

var webpackConfig = require('./webpack.config.js');
webpackConfig.devtool = 'sourcemap';
webpackConfig.entry.main.unshift(
    'webpack-dev-server/client?http://0.0.0.0:3010',
    'webpack/hot/only-dev-server'
);
webpackConfig.output.publicPath = 'http://0.0.0.0:3010/static/build/';
webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
webpackConfig.plugins.push(new webpack.NoErrorsPlugin());

new WebpackDevServer(webpack(webpackConfig), {
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    historyApiFallback: true,
    headers: { "Access-Control-Allow-Origin": "*" }
}).listen(3010, '0.0.0.0', function (err, result) {
    if (err) {
        return console.log(err);
    }

    console.log('Listening at http://0.0.0.0:' + 3010);
});
