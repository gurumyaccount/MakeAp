import { createHeaderRoute } from 'next/dist/server/server-route-utils'
import React from 'react'
import Image from 'next/image';


function Card(props) {

    function handleClick() {
        console.log("this.props : " + props.enrollClickParam);
        props.enrollClick.bind(this, props.enrollClickParam);
    }

    return (
        <div className="card-container">
            <div className="image-container">

                <Image src={props.img} />
            </div>
            <div className='card-content'>
                <div className="card-title">
                    <h3>{props.title}</h3>
                </div>
                <div className="card-body">
                    <p>{props.description}</p>
                </div>

            </div>

            <div className="cardFooter">
                <div className="participantsCount" >
                    <h3>Participants Enrolled : {props.participantsCount}</h3>
                </div>
                <div className="btn" >
                    <button onClick={() => props.enrollClick(props.enrollClickParam)} >Enroll</button>
                </div>
            </div>
        </div>
    );
}

export default Card;