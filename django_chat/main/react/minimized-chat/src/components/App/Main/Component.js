import React from 'react';
import {MdSend} from 'react-icons/md';
import ChatForm from './../Send';
import ChatList from './../ChatList';
import ChatHeader from './ChatHeader';
import {StyledHeader, StyledDataList, StyleMiniChatWrapper} from './styles';


const Component=(props)=>{
// return(<h4>Working</h4>)

  // const  userrefReg = new RegExp(/[^a-zA-Z0-9]@[a-zA-Z]+\s | \s[^a-zA-Z0-9]@[a-zA-Z]+\s/g)
    const stringReg = new RegExp(/^(@)(?!\s)\w+|(?<=[\-\.\,\%\&\*\(\)\+\=])(@)(?!\s)\w+|(?<=\s)(@)(?!\d)\w+/g);
  // const stringReg = /(@)\w+/g;



  const userData = (
    <>
      <ChatHeader
        type={props.isUserlist}
        onClick={props.handleHeaderClick}
        heading={'Chat Lis'}
      />
      <div id="chat">
        <ChatList
          data={props.userList}
          type={props.isUserlist}
          onClick={props.handleSelectRoom}
        />
      </div>
    </>
  );
  const messageData = (
    <>
      <ChatHeader
        type={props.isUserlist}
        onClick={props.handleHeaderClick}
        onClickBack={props.handleBackClick}
        heading={props.roomName}
        status={1}
      />
      <div id="chat">
        <ChatList
          data={props.messageList}
          type={props.isUserlist}
          onClick={props.handleMessageClick}
          user={props.userName}
        />
        <ChatForm
          onChange={props.handleMessageChange}
          onSubmit={props.handleSendMessage}
          value={props.messageSave}
        />
      </div>
    </>
  );

  return (
    <StyleMiniChatWrapper id="live-chat">
      {props.isUserlist ? userData : messageData}
    </StyleMiniChatWrapper>
  );
};


export default Component;
