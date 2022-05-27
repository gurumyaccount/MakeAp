# MakeAp Project

MakeAp provides a platform for professionals and amateurs to show case their talent and earn while they do that. The app allows the customer to own a NFT and also participate in compete-to-earn contests. Since this is around the concept of make up, it would encourage "non-crypto" savvy and women to get interested.

## How it works - Simple Workflow ##

* To start off with, the MakeAp application provides a MakeAp NFT marketplace where the customer can buy the NFT.
* Once the customer buys the NFT, he/she is now eligible to participate in the list of contests. along with the eligibility, the customer also gets 50 MUT token that is minted by the project. A MUT is an ERC20 Token, native to the project.
* The NFT owner can go ahead and participate in the contest.
* Each contest has some criteria, like, max participates, participation fees and winning price. Let's take an example of contest C1, with max participates as 3, participation fee as 5 MUT and the winning prize as 10MUT.
* When the contestant participates in C1, 5MUT (fees) is transferred to the project (contract).
* Similarly, 2 other participates also enrol by paying 5 MUT each.
* The contestants can then go ahead and submit the make up video based on the contest criteria.
* Meanwhile, other app users can join the voter pool by depositing 1 MUT token. This token is held in the project and returned back to the voter, along with the "reward" once the winner is announced. The voter is incentivised to join the pool as they are rewarded with MUT token once they cast their vote.
* The voters from the pool are randomly selected using Chainlink VRF V2 and are assigned to the contest.
* Once the voters are assigned to the contest, they can evaluate the video submitted by the contestants and cast their votes.
* Based on the votes, the winner is announced. In the example contest, the winner now gets 10MUT and the voters, for their service get 1.5MUT, which is 1 MUT that was deposited, and 0.5 as reward
* Keep in mind, that these rewards/fees/contest price/max participates/etc can be customised. The examples above are just to give an idea of how things work.

## Local setup ##
* git clone < gitrepo >
* npm install
* local hardhat node (if needed) - npx hardhat node
* make sure to provide private key in .somefile and also the mumbai rpc endpoint url in hardhat.config.js 
* replace the dummy value in contracts/VRFv2ForVoterSelection.sol 
* replace the dummy subscription in scripts/deploy-ChainlinkVRF.js 


## How it deploy ##

#### Deploy contracts ####

* deploy MUT Contract. This will create the contract id in config-muttoken.js
```shell
npx hardhat run scripts/deploy-MUT.js --network localhost
```
* deploy chainkink vrf v2 contract . This will create contract id in config-chainlink.js
```shell
npx hardhat run scripts/deploy-ChainlinkVRF.js --network localhost
```
* deploy main  contract . This will create contract id in config.js
```shell
npx hardhat run scripts/deploy.js --network localhost
```
## Run app locally ##

```shell
npm run dev - This will create local server running at 3000 port. You can access it as http://localhost:3000/ 
```


## Test contracts ##

```shell
npx hardhat test test/starter-test.js - To test entire workflow

npx hardhat test test/contest-test.js - To test contest contract

npx hardhat test test/sc-mut-txn-test.js - To test MUT contract  
```
