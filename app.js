// load environment variables
require('dotenv').config();

// import required modules
const request = require('request');
var bitcoin = require("bitcoinjs-lib");
var bigi = require("bigi");
var buffer = require('buffer');
var bcypher = require('blockcypher');

var bcapi = new bcypher('btc', 'test3', process.env.BLOCKCYPHER_KEY);

const generateAddress = () => {
  bcapi.genAddr(null, function(err, body) {
    if (err) {
      console.log(err);
    } else {
      console.log(
      `Private Key: ${body.private}\n` +
      `Public Key: ${body.public}\n` +
      `Address: ${body.address}\n` +
      `WIF: ${body.wif}`);
    }
  });
}

// const hexEncoded = Buffer.from("93MKMva9MG5uy2JwN79QRBkNFcVGQX4frPJWsG5X74rvN58AzeB", 'base64').toString('hex');
// var keys = new bitcoin.ECKey(bigi.fromHex(hexEncoded), true);
// console.log(keys);

/**
 * Get the balance of a bitcoin testnet.
 * @param {string} address - Address of the testnet.
 */
const getBalance = address => {
  bcapi.getAddrBal(address, null, function(err, body) {
    if (err) {
      console.log(err);
    } else {
      console.log(`The current balance in the testnet address ${address} is: ${satoshiToBTC(body.balance)} BTC`);
    }
  });
}

const satoshiToBTC = amount => {
  return amount / Math.pow(10, 8);
}

const BTCToSatoshi = amount => {  
  return amount * Math.pow(10, 8);
}

/**
 * Make a payment from one bitcoin testnet to another.
 * @param {string} fromAddress - Public address of the testnet to transfer from
 * @param {string} toAddress - Public address of the testnet to transfer to
 * @param {number} amount - The amount in BTC to transfer
 */
const makePayment = (fromAddress, toAddress, amount) => {
  const hexEncoded = Buffer.from("93MKMva9MG5uy2JwN79QRBkNFcVGQX4frPJWsG5X74rvN58AzeB", 'base64').toString('hex');
  var keys = new bitcoin.ECPair(bigi.fromHex(hexEncoded));
  
  const amountInSatoshi = BTCToSatoshi(parseFloat(amount, 10));
  
  // partially-filled TX object
  var newtx = {
    inputs: [{ addresses: [ fromAddress ] }], 
    outputs: [{ addresses: [ toAddress ], value: amountInSatoshi}]
  };

  request({
    url: 'https://api.blockcypher.com/v1/btc/test3/txs/new', 
    method: 'POST',
    json: true,
    body: newtx
  }, function(err, res, body) {
    if (err) {
      console.log(err);
    } else {
      // body is a TXSkeleton object
      console.log(body);
    }
  });
}

// Export all methods
module.exports = {
  generateAddress,
  getBalance, 
  makePayment
};