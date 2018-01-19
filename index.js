const express = require('express')
const app = express()

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
setInterval(UpdateNetworkGraph, 5000);

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

    if (!value || isNaN(value))
        return res.status(500).send('Malformed tip value');

    if (value > 100000000)
        return res.status(500).send('Whoah, thanks for generosity but tips under 10 BTC will do!');

    lightning.AddInvoice({
        memo: "LN Explorer Tips",
        value: value
    }, function(err, resp) {
        if (!err)
            res.send(resp);
        else
            res.status(500).send('Error generating invoice');
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
app.listen(80, () => console.log('Network explorer running on port 80!'))

