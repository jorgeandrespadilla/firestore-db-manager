const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    optimization: {
        minimize: false
    },
    entry: './src/index.ts',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        projectReferences: true
                    }
                },
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    target: 'node',
    externals: [
        nodeExternals()
    ],
    // externals: [
    //     nodeExternals({ 
    //         allowlist: ['lodash', 'chalk', 'cli-spinner', 'prompt-sync', 'firebase-admin'] 
    //     })
    // ],
    plugins: [
        new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true }),
        new CleanWebpackPlugin(),
    ]
}