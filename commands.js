#!/usr/bin/env node

// Import required modules
const program = require('commander');
const { prompt } = require('inquirer');
const {
    satoshiToBTC,
    BTCToSatoshi,
    generateAddress,
    addFunds,
    sendBackFunds,
    getBalance, 
    makePayment
} = require('./app');

// Converter prompt
const converterInfo = [
  {
    type: 'list',
    name: 'convert',
    message: 'Choose one of the following:',
    choices: ['BTC to Satoshi', 'Satoshi to BTC']
  },
  {
    type: 'input',
    name: 'amount',
    message: 'Amount:'
  }
];

// Add funds prompt
const addFundsInfo = [
  {
    type: 'input',
    name: 'toAddress',
    message: 'Public bitcoin testnet address to add funds to:'
  },
  {
    type: 'input',
    name: 'amount',
    message: 'Payment amount (in BTC) (Cannot be more than 0.001 BTC):'
  }
];

// Send back funds prompt
const sendBackInfo = [
  {
    type: 'input',
    name: 'privateKey',
    message: 'Private key of the testnet to make payment from:'
  },
  {
    type: 'input',
    name: 'amount',
    message: 'Payment amount (in BTC):'
  }
];

// Payment information prompt
const paymentInfo = [
  {
    type: 'input',
    name: 'privateKey',
    message: 'Private key of the testnet to make payment from:'
  },
  {
    type: 'input',
    name: 'toAddress',
    message: 'Public bitcoin testnet address to make payment to:'
  },
  {
    type: 'input',
    name: 'amount',
    message: 'Payment amount (in BTC):'
  }
];

// Convert command
program
  .command('convert')
  .alias('c')
  .description('Convert between BTC and Satoshi')
  .action(() => {
    prompt(converterInfo).then(answers => {
      if (answers.convert == 'BTC to Satoshi') {
        console.log(BTCToSatoshi(answers.amount));
      } else {
        console.log(satoshiToBTC(answers.amount));
      }
    });
  });

// Generate new address command
program
  .command('generate')
  .alias('g')
  .description('Generate a new testnet adddress and associated private/public keys')
  .action(() => {
    generateAddress();
  });

// Funds an address command
program
  .command('addfunds')
  .alias('a')
  .description('Adds funds to the given testnet adddress. Amount cannot be more than 0.001 BTC.')
  .action(() => {
    prompt(addFundsInfo).then(answers => addFunds(answers.toAddress, parseFloat(answers.amount, 10)));
  });

// Send back command
program
  .command('send')
  .alias('s')
  .description('Send funds back to the faucet.')
  .action(() => {
    prompt(sendBackInfo).then(answers => sendBackFunds(answers.privateKey, parseFloat(answers.amount, 10)));
  });

// Get balance command
program
  .command('getbalance <address>')
  .alias('get')
  .description('Get the balance in the testnet at the given address')
  .action((address) => {
    getBalance(address);
  });

// Make payment command
program
  .command('makepayment')
  .alias('m')
  .description('Make a payment from one address to another')
  .action(() => {
    prompt(paymentInfo).then(answers => makePayment(answers.privateKey, answers.toAddress, parseFloat(answers.amount, 10)));
  });

program.parse(process.argv);