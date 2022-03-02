module.exports = {
    output: {
        filename: 'scripts/[name].js'
    },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        static: './dist'
    }
}