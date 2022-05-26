require("@nomiclabs/hardhat-waffle");
const fa = require("fs")

const privateKey = fa.readFileSync(".somefile").toString()

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    //  unused configuration commented out for now
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/<key>",
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
