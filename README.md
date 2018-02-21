# Lightning Network Explorer

This is a simple lightning network explorer that uses [LND](https://github.com/lightningnetwork/lnd) or [c-lightning](https://github.com/ElementsProject/lightning) as a source of network graph. You can see it live on https://lnmainnet.gaben.win/

## Installation

Clone repository:

```
git clone https://github.com/chemicstry/recksplorer.git
```

Install npm dependencies (inside project folder):

```
npm install
```

## Running

### Requirements

If connecting to a remote LND, you need to set `lndHost` and `lndDir` params. `lndDir` must have `admin.macaroon` and `tls.cert` files.

For `c-lightning` set `--daemon clightning` and specify `clightningDir` if not using default location. Note that c-lightning supplies less data about channels than LND.

For full configuration options use `node server.js --help` or see `options.js` file.

### Start the server

```
node server.js
```

### Running in production mode (faster, without hot module reload)

```
npm run build
NODE_ENV=production node server.js
```

## Credits

Thanks to https://github.com/mably/lncli-web for `lightning.js` grpc wrapper.
