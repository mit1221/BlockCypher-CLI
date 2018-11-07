// import required modules
const request = require('request');
var prompt = require('prompt');

// get testnet address from the user and make a request to blockcypher's API
prompt.start();
prompt.get(['address'], function (err, result) {
  request('https://api.blockcypher.com/v1/btc/test3/addrs/' + result.address + '/balance', {
    json: true
  }, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    console.log("The current balance in the testnet address " + result.address + " is: " + body.balance);
  });
});
