import React, {useEffect, useState} from 'react';
import {
  StyledChat,
  StyledChatHeader,
  StyledRoomId,
} from './styles';
import {socketUtils} from './Common/socketutils';
import ChatWidget from './ChatWidget';
import AddRoom from './../RoomManagement/AddRoom';
import AddMember from './../RoomManagement/AddMember';
import PropTypes from 'prop-types';
import utils from './Common/utils';
import {FaUserPlus} from 'react-icons/fa';
import MemberStatusContainer from './MemberStatus';
import WebSocketClient from './MemberStatus/websocketClient';


const findLatestMessageID = () => {
  try {
    var selector = document.querySelector('#message_list div div');
    return selector.getAttribute('data-id');
  } catch (SyntaxError) {
    return 0;
  }
};

const ChatDialog = props => {
const [memberList, setMemberlist] = useState([]);
const [membersocket, setMembersocket] = useState(new WebSocketClient());
const [membersocketURL, setMembersocketurl] = useState(
    socketUtils.member_url(),
  );

 WebSocketClient.prototype.onmessage = function(response) {
    response = JSON.parse(response.data);
     console.log(response)
     console.log("new data-----------------------------------------------------------")
    const type = response.message;
    switch (type) {
      case 'users':
        var user_status = utils.findMatching(
          response.all_members,
          response.live_members,
        );
        setMemberlist(user_status);
        break;
      case 'update':
        console.log('updated');
        if (memberList) {
          if (memberList.length === 0) {
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
          if (memberList.length === 0) {
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


  /* STATES */
  // const [roomName, setRoomname] = useState(props.room_name);
  // const [roomid, setRoomid] = useState(props.room_id);

  var selectTest = props.room_id ? true : false;
  const [isSelected, setSelected] = useState(selectTest);
  const [isLoading, setLoading] = useState(true);
  const [AddMemberDialogVisible, setAddMemberDialogVisible] = useState(false);

  /* Chatting Socket */
  const [chatsocket, setChatsocket] = useState(null);
  const [chatsocketURL, setChatsocketurl] = useState(
    socketUtils.chat_url(props.room_id),
  );
  const [moreAvailable, setMoreAvailable] = useState(true);
  const [messageFetching, setMessagefetching] = useState(false);
  const [messageList, setMessageList] = useState([]);
  const [scrollWaitingMessage, setScrollMessage] = useState(false);
  const [lastmessageId, setlastmessageId] = useState(findLatestMessageID);

  /* USE EFFECTS */

    useEffect(()=>{
        setSelected(selectTest)
    },[props.room_id])





useEffect(() => {
    console.debug('memberList');
    console.debug(memberList);
  }, [memberList]);

useEffect(() => {
    membersocket.open(membersocketURL);
  }, [membersocket]);

useEffect(() => {
    console.log('Yaaho');
    var data = JSON.stringify({
      type: 'fetch.status',
      room_id: props.room_id,
    });
    console.debug(data);
    membersocket.send(data);
  }, [props.room_id]);


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


  /*Add Member Dialog*/
  const handleAddMemberDialog = () => {
    setAddMemberDialogVisible(!AddMemberDialogVisible);
    var data = JSON.stringify({
      type: 'fetch.status',
      room_id: props.room_id,
    });
    console.debug(data);
    membersocket.send(data);

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


  /* RENDER ELEMENT */
  const mod = (
    <>
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
      <MemberStatusContainer room_id={props.room_id} memberList={memberList}/>
      </StyledChatHeader>
      <ChatWidget  room_id={props.room_id} username={props.username}/>
    </>
  );
  const loadingorselect = isSelected ? mod: ( <AddRoom onClick={props.onClick} /> );
  /* RETURN */
  return <StyledChat>{loadingorselect} </StyledChat>;
};

ChatDialog.propTypes = {
  room_name: PropTypes.string,
  room_id: PropTypes.string,
};

export default ChatDialog;
