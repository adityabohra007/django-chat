import React,{useEffect,useState} from 'react';
import Component from './Component';
import Message from './../Message';
import Room from './../Room';


const Wrapper=(props)=>{
  var dataList = [];
  const [isLoading, setIsLoading] = useState(true);
  const [chatStatus, setChatStatus] = useState(props.status);
  console.log(props.data);
  console.log(props);
  if (props.type) {
    dataList = props.data.map(d => (
      <Room onClick={props.onClick} name={d.name} id={d.id} />
    ));
  } else {
    if(props.data[0].text!=undefined){
    dataList = props.data.map(data => (
      <Message
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
  const scrollToBottom = event => {
    var list = document.getElementById('chat').children[0];
    list.scrollTop = list.scrollTopMax;
  };
  const scrollToTop = event => {
    var list = document.getElementById('chat').children[0];
    list.scrollTop = 0;
  };
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

  useEffect(() => {
    setChatStatus(props.status);
  }, [props.status]);


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


return(

<Component {...props} dataList={dataList} status={status}/>
)
}


export default Wrapper;
