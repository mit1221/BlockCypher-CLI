const request = require('request');

request('https://api.blockcypher.com/v1/btc/test3/addrs/n4VQ5YdHf7hLQ2gWQYYrcxoE5B7nWuDFNF/balance', {
  json: true
}, (err, res, body) => {
  if (err) {
    return console.log(err);
  }
  console.log("The current balance in the testnet address is: " + body.balance);
});
