const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const yaml = require('yaml')

module.exports = {
    entry: path.join(__dirname, './src/index.js'),
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, './dist'),
        // 输出的时候清理dist文件夹里面的内容
        clean: true,
        // 指定资源模块输出的位置，以及名字，这里的位置是相对于path来说的
        assetModuleFilename: 'images/[contenthash].[ext]'
    },
    mode: 'development',
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
            } 
        ]
    },
    optimization: {
        minimizer: [
            new CssMinimizerWebpackPlugin()
        ]
    }
}