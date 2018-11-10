# Coding-Challenge
Use Blockcypher's API to return the balance of a specific bitcoin testnet address and make a payment using testnet bitcoins

### Version
1.0.0

### Requirements
* Node.js

### Setup and Installation
Clone this repository:
```sh
$ git clone https://github.com/mit1221/Coding-Challenge.git
$ cd Coding-Challenge
```

Install dependencies:
```sh
$ npm install
```

## Commands
View all the commands:
```sh
$ challenge-cli --help
```

Get the balance in the testnet at the given address:
```sh
$ challenge-cli getbalance [ADDRESS]
```

Make a payment from one address to another:
```sh
$ challenge-cli makepayment
```