const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const yaml = require('yaml')

module.exports = (env) =>{
    console.log("env is:", env)
    return {
        // 单一入口
        // entry: path.join(__dirname, './src/index.js'),
    
        // 多入口配置，并抽离共同依赖的包
        // entry: {
        //     index: {
        //         import: path.join(__dirname, './src/index.js'),
        //         dependOn: 'shared'
        //     },
        //     another: {
        //         import: path.join(__dirname, './src/another-module.js'),
        //         dependOn: 'shared'
        //     },
        //     // 把两个模块的共同的模块抽离出来
        //     shared: 'lodash'
        // },
        entry: {
            index: path.join(__dirname, './src/index.js'),
            another: path.join(__dirname, './src/another-module.js')
        },
        output: {
            // 多入口文件要对出口的文件进行命名设置，这个[name]就指的是原来的文件的名字
            // filename: '[name].bundle.js',
            // 为了使得文件内部被修改后（但是打包后文件名字不变），浏览器能够不去读取本地缓存，而是获取最新的文件
            // 就要每次打包的文件名进行hash处理，使得每次打包后的文件名不一样
            filename: 'scripts/[name].[contenthash].js',
            path: path.join(__dirname, './dist'),
            // 输出的时候清理dist文件夹里面的内容
            clean: true,
            // 指定资源模块输出的位置，以及名字，这里的位置是相对于path来说的
            assetModuleFilename: 'images/[contenthash].[ext]',
            // 配置资源的公共路径
            publicPath: 'http://localhost:8080/' 
        },
        mode: env.production ? 'production' : 'development',
        // 配置sourc-map可以让浏览器的报错的信息锁定到**打包前**代码的具体位置
        devtool: 'inline-source-map',
        plugins: [
            new HtmlWebpackPlugin({
                // 指定模板
                template: './index.html', 
                // 输出文件的名字
                filename: 'app.html',
                // <script>标签注入到那个地方
                inject: 'body'
            }),
            new MiniCssExtractPlugin()
        ],
        // 配置建议的本地服务器，用于实时刷新
        devServer: {
            // 指定要开启服务的文件夹位置，也就是server的根目录
            // 开启服务后，webpack会把打包的文件放到内存里，并不是dist文件夹里
            static: './dist'
        },
        // 使用内置资源模块，对图片等资源进行打包，这是webpack5新增的
        module: {
            rules: [
                {
                    test: /\.png$/,
                    // 这个资源类型和file-loader类似，是一个url + （外部）资源
                    type: 'asset/resource',
                    generator: {
                        // 指定资源模块输出的位置，以及名字，优先级高于assetModuleFilename！
                        filename: 'images/test.png'
                    }
                },
                {
                    test: /\.svg$/,
                    // 类似与url-loader, 对资源进行base64编码，并内联到html里面，不额外输出资源
                    type: 'asset/inline'
                },
                {
                    // 导出资源的源代码，之前用raw-loader实现
                    test: /\.txt$/,
                    type: 'asset/source'
                },
                {
                    // 会在asset/resource 和 asset/inline 之间做选择， webpack的默认临界值是8k
                    test: /\.jpg$/,
                    type: 'asset',
                    parser:{
                        dataUrlCondition: {
                            maxSize: 4 * 1024 * 1024
                        }
                    }
                },
                {
                    // 从css中引入字体，注意类型
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    type: 'asset/resource'
                },
                {
                    test: /\.(css)$/,
                    // 之前的style-loader的作用是把css内联到<style>标签里，这里对css进行抽离，就不用这个loader了
                    use: [MiniCssExtractPlugin.loader, 'css-loader']
                },
                {
                    test: /\.xml$/,
                    use: 'xml-loader'
                },
                {
                    //通过自定义的parser代替特定的webpack loader，可以将toml,yaml,json5等文件作为JSON模块导入
                    // parser是要用require引入的，loader不用
                    // 本质就是把yaml等类型的文件转化成json类型
                    test: /\.yaml$/,
                    type: 'json',
                    parser: {
                        parse: yaml.parse
                    }
                },
                {
                    // 用babel来和webpack配合，让代码适配低版本浏览器
                    // 涉及到的package:
                    // "@babel/core"
                    // "@babel/plugin-transform-runtime"
                    // "@babel/preset-env"
                    // "@babel/runtime"
                    // "babel-loader"
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
            minimizer: [
                new CssMinimizerWebpackPlugin(),
                new TerserWebpackPlugin() // 对js代码进行压缩, 只有production环境有用
            ],
    
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
} 