const path = require('path');
const os = require('os');

module.exports = [
    {
        name: 'port',
        alias: 'p',
        type: Number,
        defaultValue: 80,
        description: 'Port number for http server'
    },
    {
        name: 'host',
        alias: 'h',
        type: String,
        defaultValue: '::',
        description: 'Host (IP) for http server'
    },
    {
        name: 'updateInterval',
        type: Number,
        defaultValue: 60*1000,
        description: 'Interval between LND describegraph fetches (in milliseconds)'
    },
    {
        name: 'logDir',
        type: String,
        defaultValue: 'logs',
        description: 'Location to save log files'
    },
    {
        name: 'graphLogInterval',
        type: Number,
        defaultValue: 60*60*1000,
        description: 'Interval between network graph logging to file (in milliseconds)'
    },
    {
        name: 'dummyDataPath',
        type: String,
        description: 'Provide a file with dummy data to use instead of LND API'
    },
    {
        name: 'daemon',
        type: String,
        defaultValue: 'lnd',
        description: 'Daemon used: lnd, clightning.'
    },
    {
        name: 'lndDir',
        type: String,
        defaultValue: path.join(os.homedir(), '.lnd'),
        description: 'LND daemon config directory. Must contain admin.macaroon and tls.cert'
    },
    {
        name: 'lndHost',
        type: String,
        defaultValue: 'localhost:10009',
        description: 'LND daemon hostname'
    },
    {
        name: 'clightningDir',
        type: String,
        defaultValue: path.join(os.homedir(), '.lightning'),
        description: 'clightning daemon config directory'
    },
    {
        name: 'help',
        type: Boolean,
        description: 'Prints usage information'
    }
];
