const path = require('path')
module.exports = {
    output: {
        filename: 'scripts/[name].js'
    },
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        static: path.join(__dirname ,'../dist'),
        compress: true, // 在网络传输过程中对代码进行压缩，requestHead中的Accept-Encoding: gzip, 对应的响应头也会有Content-Encoding: gzip
        port: 3000,
        // 添加响应头
        headers: {
            'X-Access-Token': 'abc123'
        },
        proxy: {
            '/api/hello': 'http://localhost:3000'
        },
        // https: true
        historyApiFallback: true //防止路由报错，也可以设置重定向
    },

    // 引入外部的模块，不用在本地安装，从cdn获取，并自动在html文件里加上<script>标签
    externalsType: 'script',
    externals: {
        jquery: ['https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js', '$']
    }
}