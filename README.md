# 0xRosChain Solidity Workshop

Este repo se creó para el workshop de Solidity para la comunidad de Roschain. La intención del workshop es que sea 100% práctico.

En [contracts](./contracts/) van a encontrar 2 smart contracts que funcionan pero estan incompletos, y en [tests](./test/) algunos tests para los smart contracts con los que vamos a trabajar, alguno de los test fallan y otros ni siquiera están escritos.

A partir de los tests vamos a tener que trabajar en los contratos para cumplir con los requerimientos que se plantean.

## `ZxRosChainNFT`
Es un token ERC721 (NFT)

- Solo el contrato `ZxRosChainMinter` deberia poder llamar a la función `mint`
- La cantidad de `ZxRosChainNFT`s debería estar limitada a un cierto número

## `ZxRosChainMinter`
Es el contrato con el que deberían interactuar los usuario que participan del mint de `ZxRosChainNFT`

- Debería emitir un error particular si se intenta llamar a la función `mint` sin que haya un token configurado
- El NFT minteado debería ser transferido al address que llama a la función `mint`
- Solo debería permitir mintear 1 NFT por address
- Solo un grupo de addresses habilitadas deberían poder mintear un NFT

----
### Pre-requirements

The following prerequisites are required:

- [`Node.js`](https://nodejs.org/es/)
- [`Npm 7 or higher`](https://www.npmjs.com//)

#### How to upgrade NPM to latest stable version

```javascript
npm install -g npm@latest
```

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
