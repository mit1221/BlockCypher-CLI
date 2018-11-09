// import required modules
const program = require('commander');
const inquirer = require('inquirer');

const {
    getBalance, 
    makePayment
  } = require('./app');