const commandLineArgs = require('command-line-args');
const optionDefinitions = require('./options.js');
const getUsage = require('command-line-usage');
const express = require('express');
const moment = require('moment');
const path = require('path');
const fs = require('fs');
const app = express();

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

// Create log dir if it does not exist
if (!fs.existsSync(options.logDir)){
    fs.mkdirSync(options.logDir);
}

// setup lightning client
const lndHost = "localhost:10009";
const lndCertPath = "lnd.cert";
const macaroonPath = "admin.macaroon";
const lightning = require("./lightning")("rpc.proto", lndHost, lndCertPath, macaroonPath);

var graphdata;

function UpdateNetworkGraph()
{
    lightning.DescribeGraph({}, function(err, resp) {
        if (!err)
        {
            graphdata = resp;
            console.log("Updated network graph");
        }
        else
            console.log(err);
    });
}

UpdateNetworkGraph();
setInterval(UpdateNetworkGraph, options.updateInterval);

// Saves network graph to file
function SaveGraph()
{
    var filepath = path.join(options.logDir, 'networkgraph_' + moment().format('YYYY-MM-DD_HH-mm') + '.json');
    fs.writeFile(filepath, JSON.stringify(graphdata), function (err) {
        if (err)
            console.log(err);
        else
            console.log("Saved network graph to " + filepath);
    });
}
setInterval(SaveGraph, options.graphLogInterval);

//FORCE SSL
app.use(function(req, res, next) {
    if (req.headers['x-forwarded-proto'] === 'http') {
      return res.redirect('https://' + req.headers.host + req.url);
    }
    next();
});

// CORS endpoint for network graph
app.get('/networkgraph', function(req, res) {
    // Allow CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    // Send data
    res.send(graphdata);
});

// Create payment invoice
app.get('/getinvoice', function(req, res) {
    var value = parseInt(req.query.value);

    if (!value || isNaN(value) || value < 1)
        return res.status(500).send('Malformed tip value');

    if (value > 4294967)
        return res.status(500).send('Whoah, thanks for generosity but tips under uint32 limit will do! (4,294,967,295 msat to be precise)');

    lightning.AddInvoice({
        memo: "LN Explorer Tips",
        value: value
    }, function(err, resp) {
        if (!err)
            res.send(resp);
        else
        {
            console.log(err);
            res.status(500).send('Error generating invoice');
        }
    });
});

function isHexString(str)
{
    var re = /[0-9A-Fa-f]{6}/g;
    return re.test(str);
}

// Reply with invoice status
app.get('/invoicestatus', function(req, res) {
    var rhash = req.query.rhash;

    if (!isHexString(rhash) || rhash.length != 64)
        return res.status(500).send('Malformed rhash');

    lightning.LookupInvoice({
        r_hash_str: rhash
    }, function(err, resp) {
        if (!err)
            res.send(resp.settled);
        else
            res.status(500).send('Error checking invoice status');
    });
});

// Serve static content
app.use(express.static('public'));

// Start server
app.listen(options.port, () => console.log('Network explorer running on port 80!'))

