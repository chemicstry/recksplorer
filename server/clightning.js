// app/lightning.js
const grpc = require("grpc");
const fs = require("fs");
const LightningClient = require('lightning-client');


var lightning = {}

// expose the routes to our app with module.exports
module.exports = function (lightningPath) {

    lightning = new LightningClient(lightningPath, false);

    lightning.LookupInvoice = async function(input, callback){
        let resp = { };
        let err = 'Not implemented';
        callback(err, resp);
    };

    lightning.AddInvoice = async function(input, callback){
        var msatoshi = input.value;
        var label = Math.random().toString(36).slice(2);
        var description = input.memo;

        res = await lightning.invoice(msatoshi,label,description);
        var data = {
            payment_request : res.bolt11,
            r_hash : res.payment_hash
        };
        if (callback) {
            let resp = { data: data };
            let err;
            callback(err, resp);
        }
    };

    lightning.DescribeGraph = async function(input, callback){

        //console.log("--- listnodes ---");
        res = await lightning.listnodes();
        var nodes = [];
        res.nodes.forEach((n)=>{
            var addresses = [];
            n.addresses.forEach((a)=>{
                addresses.push({
                    network : '',
                    addr: a.address
                });
            });
            nodes.push({
                id : n.nodeid,
                pub_key : n.nodeid,
                color : "#"+n.color,
                alias : n.alias,
                last_update : Date.now(),
                addresses : addresses
            });
        });

        //console.log("--- listchannels ---");
        res = await lightning.listchannels();
        var edges = [];
        res.channels.forEach((c)=>{
            edges.push({
                node1_pub : c.source,
                node2_pub : c.destination
            });
        });

        //console.log("--- callback ---");
        if (callback) {
            let resp = { nodes: nodes , edges: edges };
            let err;
            callback(err, resp);
        }

	};

    return lightning;
};
