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

    const [_, ownerAddress, participantAddress, participantAddress2, voterAddress1, voterAddress2] = await ethers.getSigners()

    /* create contest */
    await nftMarketplace.connect(ownerAddress).createContestItem("Contest 1", "Contest 1", 15, 3, 5, 10)

    /*fetch all contest */
    items = await nftMarketplace.connect(participantAddress).fetchAllContests()

    let contestId = 0;
    items = await Promise.all(items.map(async i => {

      console.log('contest : ', i)
      contestId = i.contestId
    }))

    /* participate in contest */
    console.log("participant1 joing contest : " + contestId)
    await nftMarketplace.connect(participantAddress).participateInContest(contestId, { value: 5 })

    /* participate in contest */
    console.log("participant2 joing contest : " + contestId)
    await nftMarketplace.connect(participantAddress2).participateInContest(contestId, { value: 5 })

    /* fetch Contest Participates */
    console.log("fetch Contest Participates for contest id : " + contestId)
    participants = await nftMarketplace.connect(participantAddress).fetchContestParticipates(contestId)

    participants = await Promise.all(participants.map(async i => {

      console.log('participants : ', i)

    }))

    /* voter enrollment */
    console.log("signUpToVote1 : " + voterAddress1.address);
    await nftMarketplace.connect(voterAddress1).signUpToVote();
    console.log("signUpToVote : " + voterAddress2.toString());
    await nftMarketplace.connect(voterAddress2).signUpToVote();
    /*get all voters*/
    console.log("fetch all votes");
    potVoters = await nftMarketplace.connect(ownerAddress).fetchAllVoters();
    potVoters = await Promise.all(potVoters.map(async i => {

      console.log('pot Voters : ', i)

    }))

    /* participant data */

    await nftMarketplace.connect(participantAddress).uploadVideoLink(1, 'https://youtu.be/mj8DstS8RRYE')
    console.log('after first upload');
    await nftMarketplace.connect(participantAddress).uploadVideoLink(2, 'https://youtu.be/mj8DstS8RRYE')
    console.log('after 2 upload');
    await nftMarketplace.connect(participantAddress).uploadVideoLink(1, 'https://youtu.be/mj8DstS8RRYR')
    console.log('after 3 upload');
    await nftMarketplace.connect(participantAddress2).uploadVideoLink(1, 'https://youtu.be/mj8DstS8RRYR')
    console.log('after 3 upload');

    items = await nftMarketplace.connect(participantAddress).fetchAllParticipantData();

    items = await Promise.all(items.map(async i => {

      console.log('ParticipantData : ', i)

    }))

    /* VOTing */
    await nftMarketplace.connect(voterAddress1).voteUpOrDown(1, participantAddress.getAddress(), true)
    await nftMarketplace.connect(voterAddress2).voteUpOrDown(1, participantAddress.getAddress(), false)
    await nftMarketplace.connect(voterAddress1).voteUpOrDown(1, participantAddress2.getAddress(), true)

    items = await nftMarketplace.connect(participantAddress).fetchAllParticipantData();

    items = await Promise.all(items.map(async i => {

      console.log('ParticipantData after voting : ', i)

    }))

    /* request random number */
    console.log(voterAddress1.getAddress());
    console.log(voterAddress2.getAddress());
    const randomNumber = [3, 4, 5];
    await nftMarketplace.connect(ownerAddress).assignVotersToContest(1, randomNumber)
    items = await nftMarketplace.connect(ownerAddress).getVoters(1);

    items = await Promise.all(items.map(async i => {

      console.log('address of voters : ', i)

    }))

    console.log("participantAddress.getAddress() : " + await participantAddress.getAddress());
    console.log("participantAddress2.getAddress() : " + await participantAddress2.getAddress());

    winnerAddress = await nftMarketplace.connect(ownerAddress).winnerAnnouncement(1);
    console.log('winnerAddress : ', winnerAddress)

    console.log("done")
  })
})
