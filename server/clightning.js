// app/lightning.js
const grpc = require("grpc");
const fs = require("fs");
const LightningClient = require('lightning-client');


var lightning = {}

// expose the routes to our app with module.exports
module.exports = function (lightningPath) {

    lightning = new LightningClient(lightningPath, true);

    //lightning.DescribeGraph({}, (err, resp) => {});
    lightning.DescribeGraph = async function(input, callback){

        res = await lightning.listnodes();
        //console.log('listnodes',res);
        var nodes = [];
        res.nodes.forEach((n)=>{
            console.log(n);

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
        console.log('nodes',nodes);

        res = await lightning.listchannels();
       // console.log('listchannels',res);
        var edges = [];
        res.channels.forEach((c)=>{
            edges.push({
                node1_pub : c.source,
                node2_pub : c.destination
            });
        });
        console.log('edges',edges);

        if (callback) {
            let resp = { nodes: nodes , edges: edges };
            console.log(resp);
            let err;
            callback(err, resp);
        }

	};

    return lightning;
};



/*
message ChannelGraph {
    /// The list of `LightningNode`s in this channel graph
    repeated LightningNode nodes = 1 [json_name = "nodes"];

    /// The list of `ChannelEdge`s in this channel graph
    repeated ChannelEdge edges = 2 [json_name = "edges"];
}


message LightningNode {
    uint32 last_update = 1 [ json_name = "last_update" ];
    string pub_key = 2 [ json_name = "pub_key" ];
    string alias = 3 [ json_name = "alias" ];
    repeated NodeAddress addresses = 4 [ json_name = "addresses" ];
    string color = 5 [ json_name = "color" ];
}

message NodeAddress {
    string network = 1 [ json_name = "network" ];
    string addr = 2 [ json_name = "addr" ];
}
message ChannelEdgeUpdate {
    uint64 chan_id = 1;

    ChannelPoint chan_point = 2;

    int64 capacity = 3;

    RoutingPolicy routing_policy  = 4;

    string advertising_node  = 5;
    string connecting_node = 6;
}
message RoutingPolicy {
    uint32 time_lock_delta = 1 [json_name = "time_lock_delta"];
    int64 min_htlc = 2 [json_name = "min_htlc"];
    int64 fee_base_msat = 3 [json_name = "fee_base_msat"];
    int64 fee_rate_milli_msat = 4 [json_name = "fee_rate_milli_msat"];
}*/