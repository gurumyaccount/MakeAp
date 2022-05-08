const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarket", function () {
  it("Should create contest", async function () {
    /* deploy the marketplace */
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace")
    const nftMarketplace = await NFTMarketplace.deploy()
    await nftMarketplace.deployed()

    let listingPrice = await nftMarketplace.getListingPrice()
    listingPrice = listingPrice.toString()

    const auctionPrice = ethers.utils.parseUnits('1', 'ether')

    /* create two tokens */
    await nftMarketplace.createToken("https://www.mytokenlocation.com", auctionPrice, { value: listingPrice })
    await nftMarketplace.createToken("https://www.mytokenlocation2.com", auctionPrice, { value: listingPrice })
    await nftMarketplace.createToken("https://www.mytokenlocation3.com", auctionPrice, { value: listingPrice })

    const [_, ownerAddress, randomAddress] = await ethers.getSigners()

    /* create contest */
    await nftMarketplace.connect(ownerAddress).createContestItem("Contest 1", "Contest 1", 15, 3, 5, 10)

    /*fetch all contest */
    items = await nftMarketplace.connect(randomAddress).fetchAllContests()

    let contestId = 0;
    items = await Promise.all(items.map(async i => {

      console.log('contest : ', i)
      contestId = i.contestId
    }))

    /* participate in contest */
    console.log("contest id of participant : " + contestId)
    await nftMarketplace.connect(randomAddress).participateInContest(contestId)
  })
})
