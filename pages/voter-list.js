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

export default function VoterListHome() {
    /*const [contests, setContests] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    const [formInput, updateFormInput] = useState({
        contestName: '', description: '', winningPrice: 0,
        maxParticipants: 0,
        participantFee: 0,
        participantPrice: 0
    })
    useEffect(() => {
        loadContests()
    }, [])*/




    return (
        <div>
            <div className="flex items-center  bg-slate-400" >
                <div className=" ml-4 my-2 text-3xl text-bold text-grey-1000 place-content-center ">Voters List</div>

            </div>
            <br />
            <div className="max-w-full mx-auto">

                <div className="flex flex-col">
                    <div className="overflow-x-auto shadow-md sm:rounded-lg">
                        <div className="inline-block min-w-full align-middle">
                            <div className="overflow-hidden ">
                                <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-700">
                                    <thead className="bg-gray-100 dark:bg-gray-700">
                                        <tr>

                                            <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                                                Voter's address
                                            </th>
                                            <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                                                Contest for which votes will be casted
                                            </th>
                                            <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                                                Contest already voted
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                        <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">

                                            <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC</td>
                                            <td className="py-4 px-6 text-sm font-medium text-gray-500 whitespace-nowrap dark:text-white">
                                                Contest 1, Contest 2
                                            </td>
                                            <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                Contest 1
                                            </td>

                                        </tr>
                                        <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">

                                            <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">0x90F79bf6EB2c4f870365E785982E1f101E93b906</td>
                                            <td className="py-4 px-6 text-sm font-medium text-gray-500 whitespace-nowrap dark:text-white">
                                                Contest 1, Contest 2, Contest 3
                                            </td>
                                            <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                Contest 2, Contest 3
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">

                                            <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">0x90F79bf6EB2c4f870365E785982E1f101E93b906</td>
                                            <td className="py-4 px-6 text-sm font-medium text-gray-500 whitespace-nowrap dark:text-white">
                                                Contest 1, Contest 2, Contest 3
                                            </td>
                                            <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                Contest 2, Contest 3
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">

                                            <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">0x90F79bf6EB2c4f870365E785982E1f101E93b906</td>
                                            <td className="py-4 px-6 text-sm font-medium text-gray-500 whitespace-nowrap dark:text-white">
                                                Contest 1, Contest 2, Contest 3
                                            </td>
                                            <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                Contest 2, Contest 3
                                            </td>
                                        </tr>

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