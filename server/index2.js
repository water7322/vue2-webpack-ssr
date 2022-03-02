const fs = require('fs');
const path = require('path');
const express = require('express');
const { createBundleRenderer } = require('vue-server-renderer');
const serverBundle = require('../dist/server/vue-ssr-server-bundle.json');
const clientManifest = require('../dist/client/vue-ssr-client-manifest.json');
const app = express();

const renderer = createBundleRenderer(serverBundle, {
    runInNewContext: false,
    template: fs.readFileSync(path.resolve(__dirname, '../dist/client/index.template.html'), 'utf-8'),
    clientManifest
});

// 设置静态文件
app.use(express.static(path.resolve(__dirname, '../dist/client'), { index: false }));
app.get('*', async (req, res) => {
    const context = {
        url: req.url,
        title: 'vue ssr'
    };
    // 将 context 数据渲染为 HTML
    res.setHeader('Content-Type', 'text/html');

    try {
        // 在 2.5.0+，如果没有传入回调函数，则会返回 Promise：
        const html = await renderer.renderToString(context);
        res.end(html);
    } catch (error) {
        if (error.url) {
            res.redirect(error.url);
        } else if (error.code === 404) {
            res.status(404).send('404 | Page Not Found');
        } else {
            // Render Error Page or Redirect
            res.status(500).send('500 | Internal Server Error');
            console.error(`error during render : ${req.url}`);
            console.error(error.stack);
        }
    }
});
const port = 3002;
app.listen(port, () => {
    console.log(`server started at localhost:${port}`);
});
