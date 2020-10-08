import React, {useEffect, useState} from 'react';
import ChatSend from './../Send';
import ChatMessage from './../Message';
import {socketUtils} from './../Common/socketutils'
import BarLoader from "react-spinners/BarLoader";


const ChatWidget=(props)=>{
  var selectTest = props.room_id ? true : false;
  const [isSelected, setSelected] = useState(selectTest);
  const [isLoading, setLoading] = useState(true);

  const [chatFileUpload, setChatFileUpload] = useState([]);
  /* Chatting Socket */
  const [chatsocket, setChatsocket] = useState(null);
  const [chatsocketURL, setChatsocketurl] = useState(
    socketUtils.chat_url(props.room_id),
  );
  const [moreAvailable, setMoreAvailable] = useState(true);
  const [messageFetching, setMessagefetching] = useState(false);
  const [messageList, setMessageList] = useState([]);
  const [scrollWaitingMessage, setScrollMessage] = useState(false);

const findLatestMessageID = () => {
  try {
    var selector = document.querySelector('#message_list div div');
    return selector.getAttribute('data-id');
  } catch (SyntaxError) {
    return 0;
  }
};

  const [lastmessageId, setlastmessageId] = useState(findLatestMessageID);
  const [messageSave, setMessagesave] = useState('');




    useEffect(()=>{
        console.log("doing it in chatwidget")
    })

  const chatWebsocket = () => {
    var chatws = new WebSocket(chatsocketURL);
    chatws.binaryType = 'arraybuffer';
    setChatsocket(chatws);

    chatws.onopen = function() {
      const sending_data = JSON.stringify({
        message_type: 'fetch',
        room_id: props.room_id,
        last_fetch_id: lastmessageId,
        fetchCount: 10,
      });
      chatws.send(sending_data);
    };

    chatws.onerror = function() {
      setMessagefetching(false);
    };
    chatws.onclose = function() {};
    chatws.onmessage = function(response) {
      const parsed = JSON.parse(response.data);

      if (parsed.message === 'fetch_message') {
        const messages = parsed.data_message;
        console.log(messages);
        if (messages.length === 0) {
          setMessageList([{}]);
        } else {
          setMessageList(messages);
        }
        setMoreAvailable(parsed.moreAvailable);
        setlastmessageId(parsed.last_fetch);
      } else if ((parsed.message = 'new_message')) {
        console.log(parsed);
        setMessageList(prevState => [...prevState, parsed]);
      }
      setTimeout(()=>{
      setMessagefetching(false);
      setLoading(false);
    },5000);

    };
  };


 /* when the above on is executed it set url to new values so changes occur in this */
useEffect(()=>{

    setChatsocketurl( socketUtils.chat_url(props.room_id))

},[props.room_id])

useEffect(() => {
      try{
    if (isSelected) {
      setLoading(true);
      setMoreAvailable(true);
      setMessageList([]);
      chatWebsocket();
      setChatFileUpload([]);
      setMessagesave('');
    }

  }
    catch{
        console.debug("In Selected useeffect")
    }
}, [chatsocketURL]);
  var waiting = false;
  const handlemessageScroll = event => {
    if (waiting) {
      return;
    }
    waiting = true;
    const execution = () => {
      const target = event.target;
      var containerHeight = document.querySelector('#message_list')
        .scrollHeight;
      if (target.scrollTop < 20 && messageFetching === false) {
        while (chatsocket.readyState === chatsocket.CLOSED) {
          console.log('connecting to it ......');
          break;
        }

        if (chatsocket.readyState === chatsocket.OPEN) {
          setMessagefetching(true);
          const sending_data = JSON.stringify({
            message_type: 'fetch',
            room_id: props.room_id,
            last_fetch_id: lastmessageId,
            fetchCount: 10,
          });
          console.debug(sending_data);
          chatsocket.send(sending_data);
        }

        var tempMessage = messageList;
        setMessageList(tempMessage);
      }
    };

    execution();
    setTimeout(function() {
      waiting = false;
    }, 2000);
  };

const messageRender = messageList.length ? (
messageList[0].id !== undefined ? (
      <ChatMessage
        username={props.username}
        onScroll={handlemessageScroll}
        messages={messageList}
      />
    ) : (
      <p style={{textAlign: 'center', padding: '10px 20px'}}>
        No Message to Show
      </p>
    )

) : ( <p>Empty</p> );



const loaderWidget= <div style={{ display: 'flex',justifyContent:'center',alignItems: 'center'  }}>
        <BarLoader
          size={150}
          color={"#123abc"}
          loading={isLoading}
        />
      </div>

const loadingornot=isLoading ? loaderWidget : messageRender


    return(<>
        {loadingornot}
        <ChatSend  socket={chatsocket} username={props.username} room_id={props.room_id} />

        </>)


}
export default ChatWidget;
