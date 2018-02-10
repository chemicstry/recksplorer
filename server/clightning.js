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
        if (!callback){
            return callback("invalid callback", {});
        }
        if (!input){
            return callback("invalid input", {});
        }

        var msatoshi = input.value;
        var label = Math.random().toString(36).slice(2);
        var description = input.memo;

        res = await lightning.invoice(msatoshi,label,description);
        if (!res){
            return callback("invoice error", {});
        }
        var data = {
            payment_request : res.bolt11,
            r_hash : res.payment_hash
        };

        let resp = { data: data };
        let err;
        callback(err, resp);
    };

    lightning.DescribeGraph = async function(input, callback){
        if (!callback){
            return callback("invalid callback", {});
        }

        //console.log("--- listnodes ---");
        res = await lightning.listnodes();
        if (!res){
            return callback("listnodes error", {});
        }
        var nodes = [];
        res.nodes.forEach((n)=>{
            var addresses = [];
            if (n.addresses) {
                n.addresses.forEach((a) => {
                    addresses.push({
                        network: '',
                        addr: a.address
                    });
                });
            }
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
        if (!res){
            return callback("listchannels error", {});
        }
        var edges = [];
        res.channels.forEach((c)=>{
            edges.push({
                node1_pub : c.source,
                node2_pub : c.destination,
                channel_id : c.short_channel_id,
                chan_point : c.short_channel_id
            });
        });

        //console.log("--- callback ---");
        let resp = { nodes: nodes , edges: edges };
        let err;
        callback(err, resp);

	};

    return lightning;
};
