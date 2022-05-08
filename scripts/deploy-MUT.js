const hre = require("hardhat");
const fs = require('fs');

async function main() {
    const MUTToken = await hre.ethers.getContractFactory("MUTToken");
    const mutToken = await MUTToken.deploy();
    await mutToken.deployed();
    console.log("mutToken deployed to:", mutToken.address);

    fs.writeFileSync('./config-muttoken.js', `
  export const mutToken = "${mutToken.address}"
  `)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });