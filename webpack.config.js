'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    entry: ['webpack-hot-middleware/client?reload=true',
    path.join(__dirname, 'client/main.js')],
    output: {
        path: path.join(__dirname, '/dist/'),
        filename: '[name].js',
        publicPath: '/'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'client/index.tpl.html',
            inject: 'body',
            filename: 'index.html'
        }),
        new FaviconsWebpackPlugin({
            // Your source logo
            logo: './client/favicon.png',
            // The prefix for all image files (might be a folder or a name)
            prefix: 'icons-[hash]/',
            // Emit all stats of the generated icons
            emitStats: false,
            // The name of the json containing all favicon information
            statsFilename: 'iconstats-[hash].json',
            // Generate a cache file with control hashes and
            // don't rebuild the favicons until those hashes change
            persistentCache: true,
            // Inject the html into the html-webpack-plugin
            inject: true,
            // favicon background color (see https://github.com/haydenbleasel/favicons#usage)
            background: '#fff',
            // favicon app title (see https://github.com/haydenbleasel/favicons#usage)
            title: '#recksplorer',
        
            // which icons should be generated (see https://github.com/haydenbleasel/favicons#usage)
            icons: {
              android: true,
              appleIcon: true,
              appleStartup: true,
              coast: false,
              favicons: true,
              firefox: true,
              opengraph: false,
              twitter: false,
              yandex: false,
              windows: false
            }
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
    ],
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    "presets": [
                        ["env", {"modules": false}],
                        "stage-1",
                        "react",
                        "react-hmre"
                    ],
                    "plugins": [
                        "transform-runtime",
                        "transform-decorators-legacy"
                    ]
                }
            },
            {
                test: /\.json?$/,
                loader: 'json'
            },
            {
                test: /\font-awesome.css$/,
                loader: 'css-loader',
                query: {
                    modules: false
                }
            },
            {
                test: /\.css$/,
                loaders: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        query: {
                            modules: true,
                            localIdentName: '[name]__[local]___[hash:base64:5]'
                        }
                    }, 
                    {
                        loader: 'resolve-url-loader'
                    }
                ],
            },
            { 
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
                loader: "url-loader?limit=10000&mimetype=application/font-woff" 
            },
            { 
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
                loader: "file-loader" 
            },
        ]
    }
};
