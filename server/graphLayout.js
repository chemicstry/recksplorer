const spawn = require('threads').spawn;

module.exports = (data) => {
    return new Promise(resolve => {
        var thread = spawn('./server/workers/graphLayoutWorker.js')
        .send(data)
        .on('message', (res) => resolve(res))
        .on('done', () => thread.kill());
    });
}
