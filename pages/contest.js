import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import Card from './components/Card'
import contest1 from './images/contest1.jpg';

import {
    marketplaceAddress
} from '../config'

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

export default function ContestHome() {
    const [contests, setContests] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    const [formInput, updateFormInput] = useState({
        contestName: '', description: '', winningPrice: 0,
        maxParticipants: 0,
        participantFee: 0,
        participantPrice: 0
    })
    useEffect(() => {
        loadContests()
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

        router.push('/')
    }

    async function participantInContest(contestIdLocal) {

        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        /* next, create the item */
        let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
        alert(contestIdLocal);
        let transaction = await contract.participateInContest(contestIdLocal)
        await transaction.wait()
        alert("done");

    }

    async function loadContests() {

        /* create a generic provider and query for unsold market items */
        const provider = new ethers.providers.JsonRpcProvider("https://matic-mumbai.chainstacklabs.com")
        const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, provider)
        const data = await contract.fetchAllContests() //[{ "contestId": 1, "contestName": "Name", "description": "Custom Desc" }]

        const items = await Promise.all(data.map(async i => {
            //const tokenUri = await contract.tokenURI(i.tokenId)
            //const meta = await axios.get(tokenUri)
            //let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            const participantsData = await contract.fetchContestParticipates(i.contestId)
            let item = {
                contestId: i.contestId,
                contestName: i.contestName,
                description: i.description,
                participantsCount: participantsData.participants.length
            }

            console.log("contestId : " + item.contestId)
            return item
        }))

        setContests(items)
        setLoadingState('loaded')
    }



    return (
        <div>
            <h2 className="text-2xl py-2">Contests</h2>
            <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">

                    {
                        contests.map((contest, i) => (
                            <Card
                                key={i}
                                img={require('./images/contest1.jpg')}
                                title={contest.contestName}
                                description={contest.description}
                                participantsCount={contest.participantsCount}
                                enrollClick={participantInContest}
                                enrollClickParam={contest.contestId}
                            />

                        ))
                    }
                </div>
            </div>

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
                        placeholder="Total contest price"
                        className="mt-8 border rounded p-4"
                        onChange={e => updateFormInput({ ...formInput, winningPrice: e.target.value })}
                    />
                    <input
                        placeholder="Max participants"
                        className="mt-8 border rounded p-4"
                        onChange={e => updateFormInput({ ...formInput, maxParticipants: e.target.value })}
                    />
                    <input
                        placeholder="Participant Fee"
                        className="mt-8 border rounded p-4"
                        onChange={e => updateFormInput({ ...formInput, participantFee: e.target.value })}
                    />
                    <input
                        placeholder="Participant Price"
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