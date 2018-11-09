// Import required modules
const program = require('commander');
const { inquirer } = require('inquirer');
const {
    getBalance, 
    makePayment
} = require('./app');

// Get address prompt
const askAddress = [
    {
        type: 'input',
        name: 'address',
        message: 'Bitcoin testnet address:'
    }
];

// Get balance command
program
  .command('balance <address>')
  .alias('b')
  .description('Get the balance in the testnet at the given address')
  .action((address) => {
    getBalance(address);
  });

// Make payment command
program
  .command('pay <fromAddress> <toAddress>')
  .alias('p')
  .description('Make a payment from one address to another')
  .action((fromAddress, toAddress) => {
    makePayment(fromAddress, toAddress);
  });

program.parse(process.argv);