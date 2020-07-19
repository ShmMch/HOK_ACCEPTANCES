const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
module.exports = {
    entry: {
        finishedReport_bundle: './src/finishedReport.js',
        collectionReport_bundle: './src/collectionReport.js',
        reports_bundle: './src/reports.js',

    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        sourceMapFilename: '[name].js.map'
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: [/(node_modules)/],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['transform-vue-jsx', 'babel-plugin-jsx-event-modifiers', 'babel-plugin-jsx-v-model']
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader", // creates style nodes from JS strings
                    "css-loader", // translates CSS into CommonJS
                    "sass-loader" // compiles Sass to CSS, using Node Sass by default
                ]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            }
        ]
    },
    devtool: 'eval-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'finishedReport.html',
            inlineSource: '.(js|css)$',
            chunks: ['finishedReport_bundle'],
            title: `הו"ק דוחות - דוח מסיימים`
        }), new HtmlWebpackPlugin({
            filename: 'collectionReport.html',
            inlineSource: '.(js|css)$',
            chunks: ['collectionReport_bundle'],
            title: `הו"ק דוחות - דוח גביה`
        })
        , new HtmlWebpackPlugin({
            filename: 'reports.html',
            inlineSource: '.(js|css)$',
            chunks: ['reports_bundle'],
            title: `הו"ק דוחות`
        }),
        new HtmlWebpackInlineSourcePlugin()
    ]
};