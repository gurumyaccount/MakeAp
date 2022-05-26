import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import Card from './components/Card'
import contest1 from './images/contest1.jpg';

import {
    marketplaceAddress
} from '../config'

import {
    mutToken
} from '../config-muttoken'

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'
import MUTToken from '../artifacts/contracts/MUTToken.sol/MUTToken.json'

export default function ContestHome() {
    const [contests, setContests] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    const [formInput, updateFormInput] = useState({
        contestName: '', description: '', winningPrice: 0,
        maxParticipants: 0,
        participantFee: 0,
        participantPrice: 0
    })

    const [selectedContest, setSelectedContest] = useState({ contestId: 0, contestName: '' })

    const [contestInput, updateContestInput] = useState({
        videoLink: ''
    })

    const [userEnrolled, setUserEnrolled] = useState(false)

    useEffect(() => {
        //loadContests()
    }, [])

    async function createContestItem() {

        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        /* next, create the item */
        let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
        let transaction = await contract.createContestItem(formInput.contestName, formInput.description,
            formInput.winningPrice, formInput.maxParticipants, formInput.participantFee, formInput.participantPrice)
        await transaction.wait()


    }

    async function participantInContest(props) {

        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        let contract = new ethers.Contract(mutToken, MUTToken.abi, signer)

        let transaction = await contract.transferTo(marketplaceAddress, 5)
        await transaction.wait()

        /* next, create the item */
        let contract2 = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
        console.log("props : ")
        //console.log(props.contestId.toNumber())
        //let tempContractId = ethers.utils.formatEther(props.contestId) * 10 ** 18

        let transaction2 = await contract2.participateInContest(props.contestId.toNumber())
        await transaction2.wait()

        await loadContests();

    }

    async function loadContests() {

        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider2 = new ethers.providers.Web3Provider(connection)
        const signer = provider2.getSigner()
        let currentUserAddress = await signer.getAddress();

        /* create a generic provider and query for unsold market items */
        const provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.g.alchemy.com/v2/X3ts4ZSSp2aATZqlMWYEf9iYC6BoqfSO")
        const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, provider)


        const data = await contract.fetchAllContests() //[{ "contestId": 1, "contestName": "Name", "description": "Custom Desc" }]

        const items = await Promise.all(data.map(async i => {
            //const tokenUri = await contract.tokenURI(i.tokenId)
            //const meta = await axios.get(tokenUri)
            //let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            console.log("i.contestId : " + i.contestId)
            const participantsData = await contract.fetchContestParticipates(i.contestId)

            let userEnrolled = false;
            for (let x = 0; x < participantsData.participants.length; x++) {
                if (participantsData.participants[x] == currentUserAddress) {
                    userEnrolled = true;
                    setUserEnrolled(true);
                    break;
                }
            }

            const potVoters = await contract.fetchAllVoters()
            let userIsVoter = false;
            for (let y = 0; y < potVoters.length; y++) {
                console.log("potVoters[y] : " + potVoters[y]);
                if (potVoters[y] == currentUserAddress) {
                    console.log("user is voter")
                    userIsVoter = true
                    break;
                }
            }

            let item = {
                contestId: i.contestId,
                contestName: i.contestName,
                description: i.description,
                participantsCount: participantsData.participants.length,
                userEnrolled: userEnrolled,
                userIsVoter: userIsVoter
            }

            console.log("contestId : " + item.contestId)



            return item
        }))

        setContests(items)
        setLoadingState('loaded')
    }

    async function uploadContestInput() {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        /* next, create the item */
        let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
        console.log("contestInput.contestId : " + selectedContest.contestId)
        let transaction = await contract.uploadVideoLink(selectedContest.contestId, contestInput.videoLink)
        await transaction.wait()
    }

    async function submitVideoLink(props) {
        setSelectedContest(props)
    }



    return (
        <div>
            <h2 className="text-2xl py-2">Contests</h2>

            <div className="p-4">


                <div className="w-1/2 flex flex-col pb-12">
                    <input
                        placeholder="Contest Name"
                        className="mt-8 border rounded p-4"
                        onChange={e => updateFormInput({ ...formInput, contestName: e.target.value })}
                    />
                    <textarea
                        placeholder="Contest Description"
                        className="mt-2 border rounded p-4"
                        onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                    />

                    <input
                        placeholder="Total contest price in MUTD"
                        className="mt-8 border rounded p-4"
                        onChange={e => updateFormInput({ ...formInput, winningPrice: e.target.value })}
                    />
                    <input
                        placeholder="Max participants "
                        className="mt-8 border rounded p-4"
                        onChange={e => updateFormInput({ ...formInput, maxParticipants: e.target.value })}
                    />
                    <input
                        placeholder="Participant Fee in MUTD"
                        className="mt-8 border rounded p-4"
                        onChange={e => updateFormInput({ ...formInput, participantFee: e.target.value })}
                    />
                    <input
                        placeholder="Participant Price in MUTD"
                        className="mt-8 border rounded p-4"
                        onChange={e => updateFormInput({ ...formInput, participantPrice: e.target.value })}
                    />
                    <button
                        onClick={createContestItem} className="font-bold mt-2 bg-pink-500 text-white rounded p-4 shadow-lg">
                        Create Contest
                    </button>
                </div>
            </div>
        </div>
    )
}