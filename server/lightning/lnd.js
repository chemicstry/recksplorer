// app/lightning.js
const grpc = require("grpc");
const fs = require("fs");

// expose the routes to our app with module.exports
module.exports = function (protoPath, lndHost, lndCertPath, macaroonPath) {
    // GRPC does not support ECDSA certificates by default
    process.env.GRPC_SSL_CIPHER_SUITES = "HIGH+ECDSA";

    const lnrpcDescriptor = grpc.load(protoPath);
    const lndCert = fs.readFileSync(lndCertPath);
    const sslCreds = grpc.credentials.createSsl(lndCert);
    const lnrpc = lnrpcDescriptor.lnrpc;

    var macaroonCreds = grpc.credentials.createFromMetadataGenerator(function (args, callback) {
        const adminMacaroon = fs.readFileSync(macaroonPath);
        const metadata = new grpc.Metadata();
        metadata.add("macaroon", adminMacaroon.toString("hex"));
        callback(null, metadata);
    });

    credentials = grpc.credentials.combineChannelCredentials(sslCreds, macaroonCreds);

    // Connect
    var lnd = new lnrpc.Lightning(lndHost, credentials);

    // Test connection
    lnd.getInfo({}, function(err, response) {
        if (err)
            throw new Error(`LND connection failed. ${err}`);
        else
            console.log(`LND connected. Pub key: ${response.identity_pubkey}`);
    });

    return lnd;
};
