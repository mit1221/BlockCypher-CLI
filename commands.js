#!/usr/bin/env node

// Import required modules
const program = require('commander');
const { prompt } = require('inquirer');
const {
    generateAddress,
    getBalance, 
    makePayment
} = require('./app');

// Get address prompt
const askPaymentInfo = [
    {
        type: 'input',
        name: 'fromAddress',
        message: 'Public bitcoin testnet address to make payment from:'
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

// Generate new address command
program
  .command('generate')
  .alias('g')
  .description('Get the balance in the testnet at the given address')
  .action(() => {
    generateAddress();
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
    prompt(askPaymentInfo).then(answers => makePayment(answers.fromAddress, answers.toAddress, answers.amount));
  });

program.parse(process.argv);