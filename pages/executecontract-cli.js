import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import Link from 'next/link'

import {
    marketplaceAddress
} from '../config'

import {
    mutToken
} from '../config-muttoken'

import {
    voterSelection
} from '../config-chainlink'

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'
import MUTToken from '../artifacts/contracts/MUTToken.sol/MUTToken.json'
import VRFv2ForVoterSelection from '../artifacts/contracts/VRFv2ForVoterSelection.sol/VRFv2ForVoterSelection.json'

export default function ExecuteContractCLI() {

    const [loadingState, setLoadingState] = useState('not-loaded')
    const [formInput, updateFormInput] = useState({
        mintAddress: '', contestId: 0, contestIdForWinner: 0
    })
    const [contestVoters, setContestVoters] = useState([])
    const [poolVoters, setPoolVoters] = useState([])
    useEffect(() => {
        //loadNFTs()
    }, [])
    async function transferMutToContract() {

        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        /* next, create the item */

        let contract = new ethers.Contract(mutToken, MUTToken.abi, signer)
        let transaction = await contract.mint(marketplaceAddress, 20)
        await transaction.wait()
    }

    async function mintMutToAddress() {

        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        /* next, create the item */

        let contract = new ethers.Contract(mutToken, MUTToken.abi, signer)
        console.log("formInput.mintAddress : " + formInput.mintAddress)
        let transaction = await contract.mint(formInput.mintAddress, 20)
        await transaction.wait()
    }

    const noOfRandoms = 2
    async function randomNumber() {

        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        /* next, create the item */
        let contract = new ethers.Contract(voterSelection, VRFv2ForVoterSelection.abi, signer)
        console.log("in")
        let transaction = await contract.requestRandomWords(noOfRandoms)
        await transaction.wait()
        console.log("done")
    }
    async function getVoterIndexes() {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        /* next, create the item */
        let contract = new ethers.Contract(voterSelection, VRFv2ForVoterSelection.abi, signer)
        console.log("in")

        let randomNumbers = [];
        for (let i = 0; i < noOfRandoms; i++) {
            let randomWords = await contract.s_randomWords(i)
            randomNumbers.push(randomWords)
        }
        console.log("in" + randomNumbers)
    }
    async function assignVotersToContest() {

        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        /* next, create the item */
        let contract = new ethers.Contract(voterSelection, VRFv2ForVoterSelection.abi, signer)
        console.log("in")

        let randomNumbers = [];
        for (let i = 0; i < noOfRandoms; i++) {
            let randomWords = await contract.s_randomWords(i)
            randomNumbers.push(randomWords)
        }
        randomNumbers.push(5)

        console.log("in" + randomNumbers)
        console.log(formInput.contestId)
        contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)

        let allVoters = await contract.fetchAllVoters()
        console.log("allVoters : " + allVoters)

        await contract.assignVotersToContest(formInput.contestId, randomNumbers)

        let voters = await contract.getVoters(formInput.contestId)
        console.log("voters : " + voters)
        let toA = ''
        for (let x = 0; x < voters.length; x++) {
            toA = toA + "xxxxxxxxxxxx" + voters[x].substr(voters[x].length - 5) + " |  "

        }
        setContestVoters(toA)
    }
    async function winnerAnnouncement() {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        /* next, create the item */
        let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
        let winnerAddress = await contract.winnerAnnouncement(formInput.contestIdForWinner)
        console.log("Winner Address : " + winnerAddress)

        return winnerAddress
    }
    async function getAllVoters() {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)

        let allVoters = await contract.fetchAllVoters()
        console.log("allVoters : " + allVoters)
        let toA = ''
        for (let x = 0; x < allVoters.length; x++) {
            toA = toA + "xxxxxxxxxxxx" + allVoters[x].substr(allVoters[x].length - 5) + " |  "

        }

        setPoolVoters(toA)
    }
    async function distributePrizes() {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
        let contractAddress = contract.address
        let voters = await contract.getVoters(formInput.contestIdForWinner)

        let toA = ''
        for (let x = 0; x < voters.length; x++) {
            toA = toA + "xxxxxxxxxxxx" + voters[x].substr(voters[x].length - 5) + " |  "

        }
        alert("Voters that would get 2 MUTD: " + toA)
        /* next, create the item */
        let contract1 = new ethers.Contract(mutToken, MUTToken.abi, signer)


        /*let toA = [formInput.mintAddress, formInput.mintAddress]
        for (let x = 0; x < voters.length; x++) {
            toA.push(ethers.utils.getAddress(voters[x]))

        }*/

        //transfer to voters
        let transferMoneyToVoter = []
        for (let x = 0; x < voters.length; x++) {
            if (voters[x] != '0x0000000000000000000000000000000000000000') {
                if (!transferMoneyToVoter.includes(voters[x])) {
                    transferMoneyToVoter.push(voters[x])
                }

            }
        }

        console.log("transferMoneyToVoter : " + transferMoneyToVoter)
        await contract1.transferToMulti(contractAddress, transferMoneyToVoter, 2)

        //transfer to winner
        let winnerAddress = await winnerAnnouncement();
        alert("Winner who would get 10MUT : xxxxxxxxxxxx" + winnerAddress.substr(winnerAddress.length - 5))
        await contract1.transferToMulti(contractAddress, [winnerAddress], 10)




    }
    return (
        /*<button onClick={transferMutToContract} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
                    Transfer MUT to Contract
                </button> */
        <div>
            <div className="p-4">
                <h2 className="text-2xl py-2">Operation exposed for this presentation</h2>

                <br />
                <button onClick={mintMutToAddress} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
                    Mint MUT to Address
                </button>
                &nbsp;
                <input
                    placeholder="mintAddress"
                    className="mt-8 border rounded p-4"
                    onChange={e => updateFormInput({ ...formInput, mintAddress: e.target.value })}
                />
                <br />
                <button onClick={randomNumber} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
                    Select Voters From Pool (Chainlink VRF V2)
                </button>
                &nbsp;
                <button onClick={getVoterIndexes} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
                    Get Voter Indexes
                </button>

                <br />
                <button onClick={getAllVoters} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
                    Get All Voters
                </button>&nbsp;
                <button onClick={assignVotersToContest} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
                    Assign Voters to Contest
                </button>
                &nbsp;
                <input
                    placeholder="contestId"
                    className="mt-8 border rounded p-4"
                    onChange={e => updateFormInput({ ...formInput, contestId: e.target.value })}
                />
                <br />
                <p className="font-bold mt-5">Potential voters available in the pool : {poolVoters}</p>
                <p className="font-bold mt-3">Voters assigned to the contest : {contestVoters}</p>
                <br />
                <button onClick={winnerAnnouncement} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
                    Winner Announcement For Contest
                </button>
                &nbsp;
                <input
                    placeholder="contestId for winner announcement"
                    className="mt-8 border rounded p-4 "
                    onChange={e => updateFormInput({ ...formInput, contestIdForWinner: e.target.value })}
                />
                <br />
                <button onClick={distributePrizes} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
                    Distribute Prizes
                </button>

                <br /><br />
                <Link href="/create-nft">
                    <a className="mr-6 text-pink-500 font-6xl">
                        MakeAp Kit Manager
                    </a>
                </Link>
                <br /><br />
                <Link href="/contest-create">
                    <a className="mr-6 text-pink-500 font-6xl">
                        Contest Create
                    </a>
                </Link>
            </div>
        </div>
    )
}