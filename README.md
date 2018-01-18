# Lightning Network Explorer

This is a simple lightning network explorer that uses [LND](https://github.com/lightningnetwork/lnd) as a source of network graph. You can see it live on https://lnmainnet.gaben.win/

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

You need to have `lnd.cert` and `admin.macaroon` files in project directory in order to communicate with LND. Check https://github.com/mably/lncli-web readme on how to get these.

### Start the server

```
node index.js
```

## Credits

Thanks to https://github.com/mably/lncli-web for `lightning.js` grpc wrapper. (Contact me if I messed up with licensing)
