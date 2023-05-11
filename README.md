# 0xRosChain Solidity Workshop

### Pre-requirements

The following prerequisites are required:

- [`Node.js`](https://nodejs.org/es/)
- [`Npm 7 or higher`](https://www.npmjs.com//)

### Install dependencies

Before running any command, make sure to install dependencies:

```sh
npm i
```

### Compile contracts

Compile the smart contracts with Hardhat:

```sh
npm run compile
```

### Test

Run unit tests:

```sh
npm run test
```

### Coverage

Run unit tests coverage:

```sh
npm run coverage
```

### Gas Report

Run unit tests with gas report:

```sh
npm run gas-report
```

### Linter

Run typescript and solidity linters:

```sh
npm run lint
```

## Deployment

Create `.env` file and complete the variables:

```sh
cp .env.example .env
```

### Deploy the contracts to Goerli Network

Deploy contracts:
```sh
npm run deploy:goerli
```

Verify contracts:
```sh
npm run verify:goerli
```
