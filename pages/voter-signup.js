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
export default function VoterSignUp() {
    async function signUp() {

        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()


        let contract = new ethers.Contract(mutToken, MUTToken.abi, signer)

        let transaction = await contract.transferTo(marketplaceAddress, 1)
        await transaction.wait()

        let contract2 = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)

        let transaction2 = await contract2.signUpToVote()
        await transaction2.wait()

        let potVoters = await contract2.fetchAllVoters();
        await Promise.all(potVoters.map(async i => {

            console.log('pot Voters : ', i)

        }))

    }




    return (
        <div>
            <div className="flex items-center  bg-slate-400" >
                <div className=" ml-4 my-2 text-3xl text-bold text-grey-1000 place-content-center ">Voter Sign Up </div>

            </div>
            <br />
            <div className="max-w-full mx-auto">

                <div className="flex flex-col">
                    <div className="overflow-x-auto ">
                        <div className="inline-block min-w-full align-middle">
                            <div className="overflow-hidden pl-6 pd-6 ">
                                <p className="pl-6 text-lg font-small" >Click on the button below to deposit 1 MUT as collateral to make yourself eligible for the selection process. Once the selection process is completed,  we will credit 1 MUT back, even if you are not selected </p>
                                <button onClick={signUp} className="font-bold mt-4 ml-4 bg-pink-500 text-white rounded p-4 shadow-lg">
                                    SignUp to Vote
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}