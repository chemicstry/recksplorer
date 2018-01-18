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

app.get('/networkgraph', function(req, res) {
    // Allow CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    // Send data
    res.send(graphdata);
});

// Serve static content
app.use(express.static('public'));

// Start server
app.listen(80, () => console.log('Network explorer running on port 80!'))

