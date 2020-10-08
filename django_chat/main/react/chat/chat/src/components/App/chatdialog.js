import React, {useEffect, useState} from 'react';
import {
  StyledAddMember,
  StyledChat,
  StyledChatHeader,
  StyledRoomId,
  StyledBtn,
  StyledRoundInput,
} from './styles';
import {socketUtils} from './socketutils';
import Select from 'react-select';
import {
  ExistingMembers,
  CompanyUserList,
  RoomAdd,
  RoomMember,
  AddRoomMembers,
} from './apiurl';

import AddRoom from './RoomManagement/AddRoom';
import AddMember from './RoomManagement/AddMember';
import ChatSend from './chatsend';
import ChatMessage from './message';
import ChatUser from './chatusers';
import PropTypes from 'prop-types';
import UserDetail from './chatUserDetails';
import utils from './utils';
import {userDetail} from './apiurl';
import WebSocketClient from './websocketClient';
import {FaUserPlus, FaWindowClose} from 'react-icons/fa';

const findLatestMessageID = () => {
  try {
    var selector = document.querySelector('#message_list div div');
    return selector.getAttribute('data-id');
  } catch (SyntaxError) {
    return 0;
  }
};

//var memberSocketClient=new WebSocketClient();
const ChatDialog = props => {
  /* STATES */
  const [roomName, setRoomname] = useState(props.room_name);
  const [roomid, setRoomid] = useState(props.room_id);

  const [memberList, setMemberlist] = useState([]);
  var selectTest = props.room_id ? true : false;
  const [isSelected, setSelected] = useState(selectTest);
  const [isLoading, setLoading] = useState(true);
  const [membersocketURL, setMembersocketurl] = useState(
    socketUtils.member_url(),
  );
  const [AddMemberDialogVisible, setAddMemberDialogVisible] = useState(false);
  const [membersocket, setMembersocket] = useState(new WebSocketClient());

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

  WebSocketClient.prototype.onmessage = function(response) {
    console.info(response);
    response = JSON.parse(response.data);
    const type = response.message;
    console.log(type);
    switch (type) {
      case 'users':
        var user_status = utils.findMatching(
          response.all_members,
          response.live_members,
        );
        console.info(user_status);
        setMemberlist(user_status);
        break;
      case 'update':
        console.log('updated');
        if (memberList) {
          if (memberList.length == 0) {
            console.info('pre');
          } else {
            console.info(memberList);
            try {
              var new_data = utils.changeValue(
                response.update_user,
                memberList,
                true,
              );
              console.info(new_data);
              setMemberlist(new_data);
            } catch {
              console.log('update error');
            }
            console.info('post');
          }
        }
        break;
      case 'remove':
        console.info('removed');
        if (memberList) {
          if (memberList.length == 0) {
            console.log('pre');
          } else {
            setMemberlist(
              utils.changeValue(response.update_user, memberList, false),
            );

            console.log('post');
          }
        }
        break;
      default:
        console.info('not valid');
        break;
    }
  };

  /* USE EFFECTS */

  /*Memeber*/
  useEffect(() => {
    console.debug('memberList');
    console.debug(memberList);
  }, [memberList]);
  useEffect(() => {
    membersocket.open(membersocketURL);
  }, [membersocket]);

  useEffect(() => {
    setChatsocketurl(socketUtils.chat_url(props.room_id));
    setSelected(selectTest);
    console.log('Yaaho');
    var data = JSON.stringify({
      type: 'fetch.status',
      room_id: props.room_id,
    });
    membersocket.send(data);
  }, [props.room_id]);

  const setupMemberWebsocket = () => {
    if (membersocket) {
      try {
        membersocket.prototype.onopen = () => {
          console.info('Open Memebers');
          var data = JSON.stringify({
            type: 'fetch.status',
            room_id: props.room_id,
          });
          membersocket.send(data);
          console.info('socket url is new ');
        };
      } catch {
        console.error('not valid membersocketurl');
      }
    }
  };

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

  /*  useEffect(() => {
    if (chatFileUpload) {
      var data = JSON.stringify({message_type: 'image', image: buffer});
      chatsocket.send(data);
      var file
    }
  }, [chatFileUpload]);*/
  /* Functions */

  /* Socket */
  /*Chatsocket */
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

  /* Event Handlers */

  /* message */
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

  /*Add Member Dialog*/
  const handleAddMemberDialog = () => {
    setAddMemberDialogVisible(!AddMemberDialogVisible);
  };

  function checkInView(elem, container, partial) {
    var contHeight = container.height();
    var contTop = container.scrollTop();
    var contBottom = contTop + contHeight;

    var elemTop = elem.offsetTop - container.offsetTop;
    var elemBottom = elemTop + elem.offsetHeight;

    var isTotal = elemTop >= 0 && elemBottom <= contHeight;
    var isPart =
      ((elemTop < 0 && elemBottom > 0) ||
        (elemTop > 0 && elemTop <= container.height())) &&
      partial;

    return isTotal || isPart;
  }

  const messageRender = messageList.length ? (
    messageList[0].id != undefined ? (
      <ChatMessage
        username={props.username}
        {...props}
        onScroll={handlemessageScroll}
        scrollinit={scroll}
        messages={messageList}
      />
    ) : (
      <p style={{textAlign: 'center', padding: '10px 20px'}}>
        No Message to Show
      </p>
    )
  ) : (
    <p>Empty</p>
  );

  /* RENDER ELEMENT */
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
        {memberList.length ? (
          <ChatUser members={memberList} onClick={handleShowUserDetails} />
        ) : (
          ''
        )}
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
  const loadingorselect = isSelected ? (
    isLoading ? (
      `loading`
    ) : (
      mod
    )
  ) : (
    <AddRoom onClick={props.onClick} />
  );
  /* RETURN */
  return <StyledChat>{loadingorselect} </StyledChat>;
};

ChatDialog.propTypes = {
  room_name: PropTypes.string,
  room_id: PropTypes.string,
};

export default ChatDialog;
