const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config.js');
const commandLineArgs = require('command-line-args');
const cacheControl = require('express-cache-controller');
const optionDefinitions = require('./options.js');
const getUsage = require('command-line-usage');
const main = require('./server/main');

// Usage
const sections = [
    {
        header: 'Lightning Network Explorer',
        content: 'Makes Bitcoin Great Again!'
    },
    {
        header: 'Options',
        optionList: optionDefinitions
    }
];
const usage = getUsage(sections);

// Options
const options = commandLineArgs(optionDefinitions);

// Print usage
if (options.help)
{
    console.log(usage);
    process.exit();
}

const isDeveloping = process.env.NODE_ENV !== 'production';
const app = express();

if (isDeveloping) {
    const compiler = webpack(config);
    const middleware = webpackMiddleware(compiler, {
        publicPath: config.output.publicPath,
        contentBase: 'src',
        stats: {
            colors: true,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false,
            modules: false
        }
    });

    app.use(middleware);
    app.use(webpackHotMiddleware(compiler));
    app.get('/', function response(req, res) {
        res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
        res.end();
    });
} else {
    app.use(express.static(__dirname + '/dist'));
    app.get('/', function response(req, res) {
        res.sendFile(path.join(__dirname, 'dist/index.html'));
    });

    // Setup cache
    app.use(cacheControl({
        public: true,
        maxAge: 60
    }));
}

// Start main app
main(app, options);

app.listen(options.port, options.host, function onStart(err) {
    if (err)
        console.log(err);

    console.info('==> 🌎 Listening on port %s. Open up http://%s:%s/ in your browser.', options.port, options.host, options.port);
});
