require("@nomiclabs/hardhat-waffle");
const fa = require("fs")

const privateKey = fa.readFileSync(".secret").toString()

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    //  unused configuration commented out for now
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/X3ts4ZSSp2aATZqlMWYEf9iYC6BoqfSO",
      accounts: [privateKey]
    }
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
