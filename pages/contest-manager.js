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
    const [voters, setVoters] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')


    useEffect(() => {
        loadAllParticipants()
    }, [])



    async function loadAllParticipants() {


        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider2 = new ethers.providers.Web3Provider(connection)
        const signer = provider2.getSigner()
        let currentUserAddress = await signer.getAddress();

        /* create a generic provider and query for unsold market items */
        const provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.g.alchemy.com/v2/X3ts4ZSSp2aATZqlMWYEf9iYC6BoqfSO")
        const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, provider)


        const data = await contract.fetchAllParticipantData() //[{ "contestId": 1, "contestName": "Name", "description": "Custom Desc" }]

        const items = await Promise.all(data.map(async i => {
            //const tokenUri = await contract.tokenURI(i.tokenId)
            //const meta = await axios.get(tokenUri)
            //let price = ethers.utils.formatUnits(i.price.toString(), 'ether')


            console.log("contestId match : " + i)
            let item = {
                participant: i.participant,
                videoLink: i.videoLink,
                contestId: i.contestId.toNumber(),
                voteUp: i.votedFor.length,
                voteDown: i.votedAgainst.length,
            }

            return item





        }))

        console.log("items size : " + items.length)
        setVoters(items)
        setLoadingState('loaded')
    }



    return (
        <div>
            <h2 className="text-2xl py-2"></h2>
            <div className="flex items-center  bg-slate-400" >
                <div className=" ml-4 my-2 text-3xl text-bold text-grey-1000 place-content-center text-4xl  font-sans ">All Contestants</div>

            </div>

            <div className="max-w-full mx-auto">

                <div className="flex flex-col">
                    <div className="overflow-x-auto shadow-md sm:rounded-lg">
                        <div className="inline-block min-w-full align-middle">
                            <div className="overflow-hidden ">
                                <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-700">
                                    <thead className="bg-gray-100 dark:bg-gray-700">
                                        <tr>

                                            <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                                                Participant's Address
                                            </th>
                                            <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400 text-center">
                                                Contest ID
                                            </th>
                                            <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                                                Submission Video
                                            </th>
                                            <th scope="col" className="py-3 px-6 text-xs font-medium text-center tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                                                Vote Up/Down
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                        {
                                            voters.map((voter, i) => (



                                                <tr key={i} className="hover:bg-gray-100 dark:hover:bg-gray-700">

                                                    <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">{voter.participant}</td>
                                                    <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">{voter.contestId}</td>
                                                    <td className="py-4 px-6 text-sm font-medium text-gray-500 whitespace-nowrap dark:text-white">

                                                        <a href={voter.videoLink} className="text-blue-600 visited:text-purple-600" >{voter.videoLink}</a>
                                                    </td>
                                                    <td className="py-4 px-6 text-sm font-medium text-center text-gray-900 whitespace-nowrap dark:text-white">
                                                        Up : {voter.voteUp} / Down : {voter.voteDown}
                                                    </td>

                                                </tr>

                                            ))
                                        }


                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}