import React from 'react';
import {StyleStatus,StyleRoom} from './style.js'
import {FaUserCircle} from 'react-icons/fa';
const ChatRoomList=(props)=>{
    console.log(props.id)
    console.log(typeof(props.id))
    return(
				<StyleRoom className="members" >
                    <h5 className={"roomname"}  onClick={()=>props.onClick(props.id)} data-name={props.name} data-id={props.id}>
                        <UserStatus/>
                       <span> {props.name}</span>
                    </h5>
				</StyleRoom>
    )
}


const UserStatus=(props)=>{
    return(
                <StyleStatus>
                        <FaUserCircle style={{fontSize:'2rem'}}/>
                </StyleStatus>

    )
}
export default ChatRoomList;

  // <div class={"status"}></div>
