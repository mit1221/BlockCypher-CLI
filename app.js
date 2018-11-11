// load environment variables
require('dotenv').config();

// import required modules
const bcypher = require('blockcypher');
const { execSync } = require('child_process');
const bitcore = require('bitcore');

const bcapi = new bcypher('btc', 'test3', process.env.BLOCKCYPHER_KEY);

/**
 * Generate a new testnet adddress and associated private/public keys.
 */
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

/**
 * Adds 10000 Satoshi to the given testnet adddress. 
 * NOTE: Only works on Blockcypher testnet.
 * @param {string} address - Address of the testnet.
 */
const addFunds = address => {
  bcapi.faucet(address, 10000, function(err, body) {
    if (err) {
      console.log(err);
    } else {
      if (body.tx_ref != null) {
        console.log("Added some Satoshi to your address!");
      } else {
        console.log(body);
      }
    }
  });
}

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
  return Math.round(amount * Math.pow(10, 8)); // round to avoid floating-point arithmetic errors    
}

/**
 * Make a payment from one bitcoin testnet to another.
 * @param {string} privateKey - Private key of the testnet to make payment from
 * @param {string} toAddress - Public address of the testnet to make payment to
 * @param {number} amount - Payment amount (in BTC)
 */
const makePayment = (privateKey, toAddress, amount) => {
  // generate public key and address from private key
  const privKey = new bitcore.PrivateKey(privateKey);
  const publicKey = privKey.toPublicKey();
  const fromAddress = publicKey.toAddress(bitcore.Networks.testnet).toString();
    
  // partially-filled TX object
  var newtx = {
    inputs: [{ addresses: [ fromAddress ] }], 
    outputs: [{ addresses: [ toAddress ], value: BTCToSatoshi(amount)}]
  };
  
  // make a new transaction
  bcapi.newTX(newtx, function(err, tmptx) {    
    if (err) {
      console.log(err);
    } else {
      // signing each of the hex-encoded string required to finalize the transaction
      tmptx.pubkeys = [];
      tmptx.signatures = tmptx.tosign.map(function(tosign, n) {
        tmptx.pubkeys.push(publicKey.toString());

        // runs a binary executable to compute the signature from tosign and the private key
        let signature = execSync(`./signer ${tosign} ${privateKey}`).toString();
        signature = signature.trim(); // remove newline character
        
        return signature;
      });      
      
      // send back the signed transaction
      bcapi.sendTX(tmptx, function(err, body) {
        if (err) {
          console.log(err);
        } else {
          console.log(body.tx.hash);
        }
      });
    }
  });
}

// Export all methods
module.exports = {
  generateAddress,
  addFunds,
  getBalance, 
  makePayment
};