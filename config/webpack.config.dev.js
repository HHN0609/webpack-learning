const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const yaml = require('yaml')

module.exports = {
    entry: {
        index: path.join(__dirname, '../src/index.js'),
        another: path.join(__dirname, '../src/another-module.js')
    },
    output: {
        filename: 'scripts/[name].js',
        path: path.join(__dirname, '../dist'),
        clean: true,
        assetModuleFilename: 'images/[contenthash].[ext]',
    },
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html', 
            filename: 'app.html',
            inject: 'body'
        }),
        new MiniCssExtractPlugin({
            filename: 'style/[contenthash].css'
        })
    ],
    devServer: {
        static: './dist'
    },
    module: {
        rules: [
            {
                test: /\.png$/,
                type: 'asset/resource',
                generator: {
                    filename: 'images/test.png'
                }
            },
            {
                test: /\.svg$/,
                type: 'asset/inline'
            },
            {
                test: /\.txt$/,
                type: 'asset/source'
            },
            {
                test: /\.jpg$/,
                type: 'asset',
                parser:{
                    dataUrlCondition: {
                        maxSize: 4 * 1024 * 1024
                    }
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                type: 'asset/resource'
            },
            {
                test: /\.(css)$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.xml$/,
                use: 'xml-loader'
            },
            {
                test: /\.yaml$/,
                type: 'json',
                parser: {
                    parse: yaml.parse
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                            [
                                '@babel/plugin-transform-runtime'
                            ]
                        ]
                    }
                }
            }
        ]
    },
    optimization: {
        // 用webpack自带的代码split工具对代码进行抽离
        splitChunks: {
            // chunks: 'all'
            cacheGroups: {
                // 设置cacheGroups可以第三方的库打包进一个文件，进行缓存，因为这些库并不是要经常修改，就可以把这些第三方的库缓存到本地
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    }
}