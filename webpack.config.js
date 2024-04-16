const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: path.resolve(__dirname, './src/index'),
    resolve: {
        extensions: ['.js', '.json', '.jsx'], // 配置解析支持的文件扩展名，这样就不用在文件路径引入的时候,需要加 .jsx 后缀了
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.[s|c]ss/,
                exclude: /node_modules/,
                use: ['sass-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'aiden',
            template: path.resolve(__dirname, './index.html'),
        }),
    ],
    devServer: {
        static: './dist',
        hot: true,
    },
    mode: process.env.NODE_ENV,
}
