const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        main: './src/app.js'
    },
    target: 'node',
    node: {
        __dirname: false
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        sourceMapFilename: '[name].js.map',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: [/(node_modules)/],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([{
            from: 'src/pages/*',
            to: 'pages/',
            flatten: true
        },
        {
            from: 'src/resources',
            to: 'resources',
            toType: 'dir',
            ignore: [ '*.js' ] 
        }
        ])
    ]

};