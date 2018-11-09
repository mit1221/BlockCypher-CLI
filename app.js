/**
 * Get the balance of a bitcoin testnet.
 * @param {string} address - Address of the testnet.
 */
const getBalance = (address) => {
  request('https://api.blockcypher.com/v1/btc/test3/addrs/' + address + '/balance', {
    json: true
  }, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    console.log("The current balance in the testnet address " + address + " is: " + body.balance);
  }); 
}

/**
 * Make a payment from one bitcoin testnet to another.
 * @param {string} fromAddress - Address to transfer from
 * @param {string} toAddress - Address to transfer to
 */
const makePayment = (fromAddress, toAddress) => {
  
}

// Export all methods
module.exports = {
  getBalance, 
  makePayment
};