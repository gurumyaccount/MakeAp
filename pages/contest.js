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

    async function xx() {
        const web3Modal = new Web3Modal({
            network: "mainnet",
            cacheProvider: true,
        })
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const marketplaceContract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
        const data = await marketplaceContract.fetchMyNFTs()
        if (data.length > 0) {
            return true;
        }
        return false;
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

        let isMakeUpKitAssignedToUser = await xx()

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


            const potVoters = await contract.getVoters(i.contestId)
            let userIsVoter = false;
            for (let y = 0; y < potVoters.length; y++) {
                console.log("potVoters[y] : " + potVoters[y]);
                if (potVoters[y] == currentUserAddress) {
                    console.log("user is voter")
                    userIsVoter = true
                    break;
                }
            }
            console.log("isMakeUpKitAssignedToUser : " + isMakeUpKitAssignedToUser)
            let item = {
                contestId: i.contestId,
                contestName: i.contestName,
                description: i.description,
                participantsCount: participantsData.participants.length,
                userEnrolled: userEnrolled,
                userIsVoter: userIsVoter,
                isMakeUpKitAssignedToUser: isMakeUpKitAssignedToUser
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
            <div className="flex items-center  bg-slate-400" >
                <div className=" ml-4 my-2 text-3xl text-bold text-grey-1000 place-content-center text-4xl  font-sans ">Contest</div>

            </div>
            <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">

                    {
                        contests.map((contest, i) => (

                            <Card
                                key={i}
                                img={require('./images/MakeApContest.jpg')}
                                title={contest.contestName}
                                description={contest.description}
                                participantsCount={contest.participantsCount}
                                userEnrolled={contest.userEnrolled}
                                enrollClick={participantInContest}
                                enrollClickParam={contest}
                                submitClick={submitVideoLink}
                                isMakeUpKitAssignedToUser={contest.isMakeUpKitAssignedToUser}
                            />

                        ))
                    }
                </div>
            </div>
            {userEnrolled &&
                <div className="max-w-full mx-auto">

                    <div className="flex flex-col">
                        <div className="overflow-x-auto shadow-md sm:rounded-lg">
                            <div className="p-4">
                                <div className="w-3/4 flex flex-col pb-12 ">
                                    <div className="font-bold">Contest Name : {selectedContest.contestName}</div>
                                    <input
                                        placeholder="Add the online link to your video"
                                        className="mt-8 border rounded p-4"
                                        onChange={e => updateContestInput({ ...contestInput, videoLink: e.target.value })}
                                    />
                                    <button
                                        onClick={uploadContestInput} className="font-bold mt-2 bg-pink-500 text-white rounded p-4 shadow-lg">
                                        Upload the Video!!
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }

        </div>
    )
}