const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const VRFv2ForVoterSelection = await hre.ethers.getContractFactory("VRFv2ForVoterSelection");
  const voterSelection = await VRFv2ForVoterSelection.deploy(111);
  await voterSelection.deployed();
  console.log("VRFv2ForVoterSelection deployed to:", voterSelection.address);

  fs.writeFileSync('./config-chainlink.js', `
  export const voterSelection = "${voterSelection.address}"
  `)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
