const { defineConfig } = require('@vue/cli-service');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const SSR_ENV = process.env.SSR_ENV;
const isServer = SSR_ENV === 'server';

module.exports = defineConfig({
    // transpileDependencies: true,
    // publicPath: "./",
    // css: {
    //   extract: false, //关闭提取css,不关闭 node渲染会报错
    // },
    outputDir: './dist/' + SSR_ENV,
    // ERROR  Invalid options in vue.config.js: "entry" is not allowed
    configureWebpack: {
        node: isServer ? undefined : false,
        entry: `./src/entry-${SSR_ENV}.ts`,
        // 这允许 webpack 以 Node 适用方式(Node-appropriate fashion)处理动态导入(dynamic import)，
        // 并且还会在编译 Vue 组件时，
        // 告知 `vue-loader` 输送面向服务器代码(server-oriented code)。
        target: isServer ? 'node' : 'web',
        // 对 bundle renderer 提供 source map 支持
        devtool: 'source-map',
        // 此处告知 server bundle 使用 Node 风格导出模块(Node-style exports)
        output: {
            libraryTarget: isServer ? 'commonjs2' : undefined
        },
        // https://webpack.js.org/configuration/externals/#function
        // https://github.com/liady/webpack-node-externals
        // 外置化应用程序依赖模块。可以使服务器构建速度更快，
        // 并生成较小的 bundle 文件。
        externals: isServer
            ? nodeExternals({
                  // 不要外置化 webpack 需要处理的依赖模块。
                  // 你可以在这里添加更多的文件类型。例如，未处理 *.vue 原始文件，
                  // 你还应该将修改 `global`（例如 polyfill）的依赖模块列入白名单
                  allowlist: /\.(css|vue)$/ //  ERROR  Error: [webpack-node-externals] : Option 'whitelist' is not supported. Did you mean 'allowlist'?
              })
            : undefined,
        optimization: { splitChunks: isServer ? false : undefined }, // Error: Server-side bundle should have one single entry file. Avoid using CommonsChunkPlugin in the server config.
        // 这是将服务器的整个输出
        // 构建为单个 JSON 文件的插件。
        // 默认文件名为 `vue-ssr-server-bundle.json`
        // 默认文件名为 `vue-ssr-client-manifest.json`
        plugins: [isServer ? new VueSSRServerPlugin() : new VueSSRClientPlugin()]
    },
    chainWebpack: (config) => {
        // config.entry("app").clear().add(`./src/entry-${SSR_ENV}.ts`);

        // 不加这个，路由动态导入异步组件会找不到js
        config.plugin('limit').use(
            new webpack.optimize.LimitChunkCountPlugin({
                maxChunks: 1
            })
        );
    }
});
