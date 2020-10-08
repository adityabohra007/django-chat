import React from "react";
import {StyledChatMessage} from './style.js';
const ChatMessage=(props)=>{
    var userTest=props.by==props.user
    return(
                <StyledChatMessage onClick={props.onClick}>

                <div className={"sender"}>
                    {userTest ?
                    <h5 style={{textAlign:"right"}}>Me</h5>:<h5>{props.by}</h5>
                    }
                </div>
				<div  data-name="Aditya"  className={"message"}  >
                        {props.text==null?<img src={window.origin+"/media/"+props.file}/> :<p>{props.text}</p>}
				</div>
                <div className={"time"} style={{display:'none'}}>
                    <p>{props.time}</p>
                </div>
                </StyledChatMessage>
    )
}

export default ChatMessage;
