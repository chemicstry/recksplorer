const spawn = require('threads').spawn;

module.exports = (data) => {
    return new Promise(resolve => {
        spawn('./server/workers/graphLayoutWorker.js')
        .send(data)
        .on('message', (res) => {
            resolve(res);
        });
    });
}
