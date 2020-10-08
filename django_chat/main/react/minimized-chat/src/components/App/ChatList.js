import React, {useEffect, useState} from 'react';
import {StyleWebsocketStatus, StyledDataList} from './style';
import ChatMessage from './Message';
import ChatRoomList from './Room';

const ChatList = props => {
  var dataList = [];
  const [isLoading, setIsLoading] = useState(true);
  const [chatStatus, setChatStatus] = useState(props.status);
  console.log(props.data);
  console.log(props);

  useEffect(() => {
    setChatStatus(props.status);
  }, [props.status]);
  const scrollToBottom = event => {
    var list = document.getElementById('chat').children[0];
    list.scrollTop = list.scrollTopMax;
  };
  const scrollToTop = event => {
    var list = document.getElementById('chat').children[0];
    list.scrollTop = 0;
  };
console.log("data - list")
  if (props.type) {
    dataList = props.data.map(d => (
      <ChatRoomList onClick={props.onClick} name={d.name} id={d.id} />
    ));
  } else {
    if(props.data[0].text!=undefined){
    dataList = props.data.map(data => (
      <ChatMessage
        onClick={props.onClick}
        id={data.id}
        text={data.text}
        file={data.file}
        time={data.date_created}
        by={data.sender__username}
        user={props.user}
      />
    ));
  }
      else{
         dataList= <p style={{padding:'10px',textAlign:'center'}}>No Messages to Show</p>
      }

  }
  console.log(dataList);
  useEffect(() => {
    //setIsLoading(false);
    if (props.user && !isLoading) {
      console.log('Data is here $$');
      scrollToBottom();
    } else {
      scrollToTop();
    }
    console.log('-------------------------------------------------');
  }, [props.data, isLoading]);
  useEffect(() => {
    if (isLoading) {
      setIsLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    setChatStatus(props.status);
    console.log('setting chatStatus');
  }, [props.status]);
  const status = () => {
    console.log('chatStatus' + chatStatus);
    if (chatStatus == 0) {
      return (
        <StyleWebsocketStatus
          status={chatStatus}
          style={{background: '#c9ec96'}}>
          Connecting
        </StyleWebsocketStatus>
      );
    }
    if (chatStatus == 1) {
      // <StyleWebsocketStatus status={chatStatus} style={{background: '#96ec96'}}>
      //   Connected
      // </StyleWebsocketStatus>;
    }
    if (chatStatus == 2) {
      // <StyleWebsocketStatus status={chatStatus} style={{background: '#ecc296'}}>
      //   Disconnecting
      // </StyleWebsocketStatus>;
    }
    if (chatStatus == 3) {
      // <StyleWebsocketStatus status={chatStatus} style={{background: '#ec9a96'}}>
      //   Disconnected
      // </StyleWebsocketStatus>;
    }
  };

  return (
    <StyledDataList>
      {status}
      {dataList}
    </StyledDataList>
  );
};
export default ChatList;
