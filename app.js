// load environment variables
require('dotenv').config();

// import required modules
const request = require('request');

/**
 * Get the balance of a bitcoin testnet.
 * @param {string} address - Address of the testnet.
 */
const getBalance = address => {
  // make request to Blockcypher's API
  request(`https://api.blockcypher.com/v1/btc/test3/addrs/${address}/balance`, {
    json: true
  }, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    console.log(`The current balance in the testnet address ${address} is: ${satoshiToBTC(body.balance)} BTC`);
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
  const amountInSatoshi = BTCToSatoshi(parseFloat(amount, 10));
  
  var newtx = {
    inputs: [{ addresses: [ fromAddress ] }], 
    outputs: [{ addresses: [ toAddress ], value: amountInSatoshi}]
  };

  var url = 'https://api.blockcypher.com/v1/btc/test3/txs/new';

  request({
    url: url, 
    method: 'POST',
    json: true,
    body: newtx
  }, function(err, res, body) {
    if (err) {
      return console.log(err);
    }
    console.log(body);
  });
}

// Export all methods
module.exports = {
  getBalance, 
  makePayment
};