const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarket", function () {
    it("Should create contest", async function () {
        /* deploy the marketplace */




        const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace")
        const nftMarketplace = await NFTMarketplace.deploy()
        await nftMarketplace.deployed()

        const [_, ownerAddress, voterAddress1, voterAddress2] = await ethers.getSigners()

        const MUTToken = await ethers.getContractFactory("MUTToken")
        const mutToken = await MUTToken.deploy()

        await mutToken.deployed()
        console.log("mutToken.getAddress() : " + mutToken.address)
        //console.log("_ : " + _)
        const auctionPrice = ethers.utils.parseUnits('10', 'ether')

        //console.log("ownerAddress.address : " + ownerAddress.address)
        //address = ethers.utils.getAddress("0xa513E6E4b8f2a923D98304ec87F64353C4D5C853")
        //console.log("ownerAddress.address : " + ownerAddress.address)
        await mutToken.connect(ownerAddress).mint(ownerAddress.getAddress(), 20)
        const balance1 = await mutToken.connect(ownerAddress).balanceOf(ownerAddress.getAddress())
        console.log("BAL : " + balance1)
        //const balance2 = await mutToken.connect(ownerAddress).transferTo(voterAddress1.getAddress(), 10)
        //const balance3 = await mutToken.connect(ownerAddress).balanceOf(ownerAddress.getAddress())
        //console.log("BAL : " + balance3)
        console.log("ownerAddress.getAddress() : " + ownerAddress.getAddress())
        await mutToken.connect(ownerAddress).transferToMulti(ownerAddress.getAddress(), [voterAddress1.getAddress(), voterAddress2.getAddress()], 1)
        //const txn = await nftMarketplace.connect(ownerAddress).tr

        console.log("VOTER 1 : " + await mutToken.connect(ownerAddress).balanceOf(voterAddress1.getAddress()))
        console.log("VOTER 2 : " + await mutToken.connect(ownerAddress).balanceOf(voterAddress2.getAddress()))

        console.log("FROM BAL : " + await mutToken.connect(ownerAddress).balanceOf(ownerAddress.getAddress()))



    })
})
