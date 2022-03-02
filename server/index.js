const fs = require('fs');
const path = require('path');
const koa = require('koa');
const koaStatic = require('koa-static');
const { createBundleRenderer } = require('vue-server-renderer');
const serverBundle = require('../dist/server/vue-ssr-server-bundle.json');
const clientManifest = require('../dist/client/vue-ssr-client-manifest.json');
const app = new koa();

const renderer = createBundleRenderer(serverBundle, {
    runInNewContext: false,
    template: fs.readFileSync(path.resolve(__dirname, '../dist/client/index.template.html'), 'utf-8'),
    clientManifest
});

// 不加这句，静态资源会报{ code: 404 }
// 不加index: false会默认用index.html，坑死我了
app.use(koaStatic(path.resolve(__dirname, '../dist/client'), { index: false }));

app.use(async (ctx, next) => {
    const context = {
        url: ctx.url,
        title: 'vue ssr'
    };
    // 将 context 数据渲染为 HTML
    ctx.set('Content-Type', 'text/html');
    try {
        // 在 2.5.0+，如果没有传入回调函数，则会返回 Promise：
        const html = await renderer.renderToString(context);
        ctx.body = html;
    } catch (error) {
        ctx.body = error;
    }
});
const port = 3001;
app.listen(port, () => {
    console.log(`server started at localhost:${port}`);
});
