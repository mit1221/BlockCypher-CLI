# Coding-Challenge
A CLI that interacts with Blockcypher's API to return the balance of a bitcoin testnet address, make a payment and more.

### Version
1.0.0

### Requirements
* Node.js
* Blockcypher token (Get it free from [https://accounts.blockcypher.com/signup](https://accounts.blockcypher.com/signup))

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

NOTE: Bitcore will not install correctly because of a problem in their package. To fix this, run:
```sh
$ npm install --ignore-scripts bitcore
```

### Create Symlink
```sh
$ npm link
```

### Create `.env` file
For Unix-based Operating Systems:
```sh
$ touch .env
```

For Windows:
```sh
$ type nul > .env
```

### Add Blockcypher token (without the square brackets)
```sh
$ echo "BLOCKCYPHER_TOKEN='[YOUR_TOKEN]'" >> .env
```

If you have the private key for your bitcoin testnet, also add that to the `.env` file:
```sh
$ echo "PRIVATE_KEY='[YOUR_KEY]'" >> .env
```

Otherwise, you can generate a new testnet address using command 3 (below), which will give you a private key.

## Commands
1. View all the commands:
```sh
$ challenge-cli --help
```

2. Convert between BTC and Satoshi:
```sh
$ challenge-cli convert
```

3. Generate a new testnet adddress and associated private/public keys:
```sh
$ challenge-cli generate
```

4. Adds funds to the given testnet adddress from the faucet:
```sh
$ challenge-cli addfunds
```
Note: This will only work if there are funds present in the testnet corresponding to the private key specified in the .env file.

5. Send funds back to the faucet:
```sh
$ challenge-cli send
```

6. Get the balance in the testnet at the given address:
```sh
$ challenge-cli getbalance [ADDRESS]
```

7. Make a payment from one address to another:
```sh
$ challenge-cli makepayment
```
