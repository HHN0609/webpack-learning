const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

module.exports = {
    output: {
        filename: 'scripts/[name].[contenthash].js',
        publicPath: 'http://localhost:8080/' 
    },
    mode: 'production',
    optimization: {
        minimizer: [
            new CssMinimizerWebpackPlugin(),
            new TerserWebpackPlugin() // 对js代码进行压缩, 只有production环境有用
        ]
    },
    performance: {
        hints: false
    }
}