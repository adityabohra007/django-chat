import React from 'react';
//import {} from './styles.js'
import {StyleStatus,StyleRoom} from './styles.js'
import {FaUserCircle} from 'react-icons/fa';



const Component=(props)=>{
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
export default Component;
