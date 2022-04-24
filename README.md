# Buy Property

Dapp for buying properties

## Dependencies

- Metamask: https://metamask.io/
- Truffle: https://github.com/trufflesuite/truffle
- Ganache: http://truffleframework.com/ganache/

## Step 1. Clone the project

`git clone https://github.com/TheAkshitS/buy-property`

## Step 2. Install dependencies

```
$ cd buy-property
$ npm i
```

## Step 3. Start Ganache

Open the Ganache GUI client that you downloaded and installed. This will start your local blockchain instance

## Step 4. Compile & Deploy Buyer Smart Contract

`$ truffle migrate --reset`
You must migrate the Buyer smart contract each time your restart ganache

## Step 5. Configure Metamask

- Unlock Metamask
- Connect metamask to your local Ethereum blockchain provided by Ganache
- Import the account provided by ganache

## Step 6. Run the Front End Application

`$ npm run dev`

Visit this URL in your browser: http://localhost:3000
