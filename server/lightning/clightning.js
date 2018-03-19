const LightningClient = require('lightning-client');

var lightning = {};

// expose the routes to our app with module.exports
module.exports = function (lightningPath) {

    lightning = new LightningClient(lightningPath, false);

    lightning.LookupInvoice = async function(input, callback){

        //console.log("--- listinvoices ---");
        res = await lightning.listinvoices();
        if (!res){
            return callback("listinvoices error", {});
        }
        var invoice;
        res.invoices.forEach((i)=>{
            if (i.payment_hash === input.r_hash_str){
                invoice = {
                    memo : i.label,
                    r_hash : i.payment_hash,
                    value : i.msatoshi,
                    settled : (i.status === 'paid') ? true : false,
                    settle_date : (i.status === 'paid' && i.paid_at) ? i.paid_at : 0,
                    expiry : i.expiry_at
                }
            }
        });
        if (!invoice){
            return callback("Invoice not found", {});
        }

        let resp = invoice;
        let err ;
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

        let resp = {
            payment_request : res.bolt11,
            r_hash : res.payment_hash
        };
        let err;
        callback(err, resp);
    };

    lightning.DescribeGraph = async function(input, callback){
        if (!callback){
            return callback("invalid callback", {});
        }

        //console.log("--- getinfo ---");
        res = await lightning.getinfo();
        if (!res){
            return callback("listnodes error", {});
        }
        let network = res.network;

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
                    var address = "";
                    if(a.address){
                        address = a.address;
                    }
                    if(a.port){
                        address += ":"+a.port;
                    }
                    addresses.push({
                        network: network,
                        addr: address
                    });
                });
            }
            nodes.push({
                id : n.nodeid,
                pub_key : n.nodeid,
                color : (n.color)?'#'+n.color:'#FFFFFF',
                alias : (n.alias)?n.alias:'',
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
            if (c.active && c.public) {
                edges.push({
                    node1_pub: c.source,
                    node2_pub: c.destination,
                    channel_id: c.short_channel_id,
                    chan_point: c.short_channel_id,
                    last_update: c.last_update
                });
            }
        });

        //console.log("--- callback ---");
        let resp = { nodes: nodes , edges: edges };
        let err;
        callback(err, resp);

	};

    return lightning;
};
