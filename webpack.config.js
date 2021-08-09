const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    optimization: {
        minimize: false
    },
    entry: './src/index.ts',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    target: 'node',
    externals: [
        nodeExternals({ 
            allowlist: ['lodash', 'chalk', 'cli-spinner', 'prompt-sync', 'firebase-admin'] 
        })
    ]
}