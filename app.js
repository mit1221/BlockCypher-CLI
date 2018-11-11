// load environment variables
require('dotenv').config();

// import required modules
const bcypher = require('blockcypher');
const { execSync } = require('child_process');
const bitcore = require('bitcore');

const bcapi = new bcypher('btc', 'test3', process.env.BLOCKCYPHER_KEY);

// helper functions
const satoshiToBTC = amount => {
  return amount / Math.pow(10, 8);
}
const BTCToSatoshi = amount => {
  return Math.round(amount * Math.pow(10, 8)); // round to avoid floating-point arithmetic errors    
}

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
 * Adds funds to the given testnet adddress.
 * Limit is 0.001 BTC.
 *
 * @param {string} address - Address of the testnet
 * @param {number} amount - Funds to add (in BTC)
 */
const addFunds = (address, amount) => {
  if (amount > 0.001) {
    console.log('Enter a smaller amount. The maximum allowed is 0.001 BTC.');
  } else {
    makePayment(process.env.PRIVATE_KEY, address, amount, data => {
      console.log(`Added ${amount} BTC to your address!`);      
    });
  }
}

/**
 * Send funds back to the faucet.
 * @param {string} privateKey - Private key of the testnet to to make payment from
 * @param {number} amount - Payment amount (in BTC)
 */
const sendBackFunds = (privateKey, amount) => {
  // generate address from private key
  const privKey = new bitcore.PrivateKey(process.env.PRIVATE_KEY);
  const publicKey = privKey.toPublicKey();
  const toAddress = publicKey.toAddress(bitcore.Networks.testnet).toString();

  makePayment(privateKey, toAddress, amount, data => {
    console.log(`Thank you for sending ${amount} BTC back to the faucet!`);
  });
}

/**
 * Get the balance of a bitcoin testnet
 * @param {string} address - Address of the testnet
 */
const getBalance = address => {
  bcapi.getAddrBal(address, null, (err, body) => {
    if (err) {
      console.log(err);
    } else {      
      console.log(`The current balance in the testnet address ${address} is: ${satoshiToBTC(body.balance)} BTC.`);
      if (body.unconfirmed_balance != 0) {
        console.log(`Unconfirmed: ${satoshiToBTC(body.unconfirmed_balance)} BTC`);
      }
    }
  });
}

/**
 * Make a payment from one bitcoin testnet to another.
 * @param {string} privateKey - Private key of the testnet to make payment from
 * @param {string} toAddress - Public address of the testnet to make payment to
 * @param {number} amount - Payment amount (in BTC)
 * @param {function} cb - Function called if transaction is successfully completed
 */
const makePayment = (privateKey, toAddress, amount, cb) => {
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
  bcapi.newTX(newtx, (err, tmptx) => {
    if (err) {
      console.log(err);
    } else {
      // signing each of the hex-encoded string required to finalize the transaction
      tmptx.pubkeys = [];
      tmptx.signatures = tmptx.tosign.map((tosign, n) => {
        tmptx.pubkeys.push(publicKey.toString());

        // runs a binary executable to compute the signature from tosign and the private key
        let signature = execSync(`./signer ${tosign} ${privateKey}`).toString();
        signature = signature.trim(); // remove newline character
        
        return signature;
      });      
      
      // send back the signed transaction
      bcapi.sendTX(tmptx, (err, body) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`Transaction hash: ${body.tx.hash}`);
          
          if (cb != undefined) {
            cb(body);
          }
        }
      });
    }
  });
}

// Export all methods
module.exports = {
  satoshiToBTC,
  BTCToSatoshi,
  generateAddress,
  addFunds,
  sendBackFunds,
  getBalance, 
  makePayment
};