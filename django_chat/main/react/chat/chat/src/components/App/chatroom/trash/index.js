import React, {useEffect, useState} from 'react';
import {FaUserPlus} from 'react-icons/fa';
import PropTypes from 'prop-types';
import Select from 'react-select';
import {
  ExistingMembers,
  CompanyUserList,
  RoomAdd,
  RoomMember,
  AddRoomMembers,
} from './apiurl';
import {userDetail} from './apiurl';
import utils from './utils';
import {socketUtils} from './socketutils';

import {
  StyledAddMember,
  StyledChat,
  StyledChatHeader,
  StyledRoomId,
  StyledBtn,
  StyledRoundInput,
} from './styles';

import AddRoom from './RoomManagement/AddRoom';
import AddMember from './RoomManagement/AddMember';

import ChatSend from './chatsend';
import ChatMessage from './message';
import ChatUser from './chatusers';

import UserDetail from './chatUserDetails';
const findLatestMessageID = () => {
  try {
    var selector = document.querySelector('#message_list div div');
    return selector.getAttribute('data-id');
  } catch (SyntaxError) {
    return 0;
  }
};

const ChatRoomContainer = () => {
  var selectTest = props.room_id ? true : false;
  const [isSelected, setSelected] = useState(selectTest);
  const [isLoading, setLoading] = useState(true);

  const [AddMemberDialogVisible, setAddMemberDialogVisible] = useState(false);
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
  const [userDetailSelected, setUserDetailsSelected] = useState();
  const [userDetailData, setUserDetailData] = useState();
  const [lastmessageId, setlastmessageId] = useState(findLatestMessageID);
  const [messageSave, setMessagesave] = useState('');



  useEffect(() => {
    setChatsocketurl(socketUtils.chat_url(props.room_id));
    setSelected(selectTest);
    console.log('Yaaho');
  }, [props.room_id]);

  useEffect(() => {
    /* when the above on is executed it set url to new values so changes occur in this */
    if (isSelected) {
      setLoading(true);
      setMoreAvailable(true);
      setMessageList([]);
      chatWebsocket();
      //      memberWebsocket();
      setChatFileUpload([]);
      setMessagesave('');
    }
  }, [chatsocketURL]);

  const fetchMessage = chatws => {
    const sending_data = JSON.stringify({
      type: 'fetch',
    });
    try {
      sending_data = JSON.stringify({
        message_type: 'fetch',
        room_id: props.room_id,
        last_fetch_id: lastmessageId,
        fetchCount: 10,
      });
    } catch {
      console.log('Error in sending data');
    }
    chatws.send(sending_data);
  };

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

      if (parsed.message == 'fetch_message') {
        const messages = parsed.data_message;
        console.log(messages);
        if (messages.length == 0) {
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
      setMessagefetching(false);
      setLoading(false);
    };
  };
  var waiting = false;

  const handleMessageChange = event => {
    console.log(event.target);
    const target = event.target;
    const data = event.target.value;
    setMessagesave(data);
    console.log(data);
  };
  const handleSendMessage = event => {
    if (chatsocket.readyState == chatsocket.OPEN) {
      var sending_data = JSON.stringify({
        message_type: 'text',
        message: messageSave,
        sender: props.username,
        room_id: props.room_id,
      });
      chatsocket.send(sending_data);
    }
  };
  /*User Details */
  const handleShowUserDetails = userdata => {
    console.log('Details');
    fetch(userDetail(userdata))
      .then(res => res.json())
      .then(res => {
        setUserDetailData(res);
        setUserDetailsSelected(true);
      });
  };
  const handleUserDetailsClose = () => {
    setUserDetailsSelected(false);
    setUserDetailData('');
  };

  /* File Send*/
  const handleFileChange = event => {
    try {
      console.log('changed');
      console.log(event.target.files[0]);
      setChatFileUpload([event.target.files[0]]);
    } catch {
      console.log('change');
    }
  };

  const handleFileSend = () => {
    try {
      var fileId = document.getElementById('attachFile');
      var file = fileId.files[0];
      console.log(file);
      var reader = new FileReader();
      reader.onload = function(e) {
        console.log(reader.result);
        chatsocket.send(
          JSON.stringify({
            message_type: 'file',
            filename: file.name,
            filetype: file.type,
            file: reader.result.split(',', 2)[1],
            room_id: props.room_id,
          }),
        );
        setChatFileUpload([]);
      };
      reader.readAsDataURL(file);
    } catch {
      console.log('inside send image');
    }
  };

  const handleFileSendCancel = event => {
    setChatFileUpload([]);
    event.target.files = '';
  };

  const handlemessageScroll = event => {
    if (waiting) {
      return;
    }
    waiting = true;
    const execution = () => {
      const target = event.target;
      var containerHeight = document.querySelector('#message_list')
        .scrollHeight;
      if (target.scrollTop < 20 && messageFetching == false) {
        while (chatsocket.readyState == chatsocket.CLOSED) {
          console.log('connecting to it ......');
          break;
        }

        if (chatsocket.readyState == chatsocket.OPEN) {
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

  const mod = (
    <>
      {userDetailSelected ? (
        <UserDetail onClose={handleUserDetailsClose} data={userDetailData} />
      ) : (
        ''
      )}

      {AddMemberDialogVisible ? (
        <AddMember room_id={props.room_id} onClick={handleAddMemberDialog} />
      ) : (
        ''
      )}

      <StyledChatHeader>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <StyledRoomId>Room Id:{props.room_name} </StyledRoomId>
          <div style={{padding: '10px', background: '#e8e5e5'}}>
            <FaUserPlus
              style={{fontSize: '20px'}}
              onClick={handleAddMemberDialog}
            />
          </div>
        </div>



      </StyledChatHeader>
      {messageRender}
      <ChatSend
        fileSelected={chatFileUpload}
        onFileSend={handleFileSend}
        onFileSendCancel={handleFileSendCancel}
        onFileChange={handleFileChange}
        onChange={handleMessageChange}
        value={messageSave}
        onClick={handleSendMessage}
      />
    </>
  );
};
