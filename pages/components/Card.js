import { createHeaderRoute } from 'next/dist/server/server-route-utils'
import React from 'react'
import Image from 'next/image';


function Card(props) {

    function handleClick() {
        console.log("this.props : " + props.enrollClickParam);
        props.enrollClick.bind(this, props.enrollClickParam);
        //className="w-full bg-green-800 text-white text-center mr-1 rounded text-sm  font-light font-sans "
    }

    return (
        <div className="card-container">
            <div className="image-container">

                <Image src={props.img} />
            </div>
            <div className='ml-2'>
                <div className="">
                    <div className="font-bold mb-1 float-left ">
                        <h3>{props.title}</h3>
                    </div>
                    {props.enrollClickParam.userIsVoter &&
                        <div className="float-right mr-1">
                            <a href={'/contest-voters?contestId=' + props.enrollClickParam.contestId}>Vote</a>

                        </div>
                    }
                </div>
                <br />
                <div className="flex float-left font-sm">
                    <p>{props.description}</p>
                </div>

            </div>

            <div className="cardFooter">
                <div className="ml-2 mt-3 mb-4" >
                    <br /><br /><br />
                    <h3>Participants Enrolled : {props.participantsCount}</h3>
                </div>

                {props.userEnrolled &&
                    <button className="w-full font-bold bg-green-500 text-white text-center  p-1 shadow-lg" onClick={() => props.submitClick(props.enrollClickParam)}  >You're Enrolled - Please submit Video</button>

                }
                {(!props.userEnrolled && props.isMakeUpKitAssignedToUser) && < div >
                    <button className="w-full font-bold bg-pink-500 text-white  p-1 shadow-lg" onClick={() => props.enrollClick(props.enrollClickParam)}  >Participant In The Contest</button>
                </div>
                }
                {(!props.userEnrolled && !props.isMakeUpKitAssignedToUser) && < div >
                    <button className="w-full font-bold bg-red-500 text-white  p-1 shadow-lg" onClick={() => console.log('')}  >You need a MakeUp Kit to participant</button>
                </div>
                }
            </div>




        </div >
    );
}

export default Card;