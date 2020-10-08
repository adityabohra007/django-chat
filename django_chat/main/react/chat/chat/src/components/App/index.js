import React, {useState, useEffect} from 'react';
import {ChatLeft} from './RoomList';
import {
  StyledChatContainer,
} from './styles';
import {socketUtils} from './socketutils';
import {MdMessage, MdSearch} from 'react-icons/md';
import ChatDialog from './chatroom';
import RoomForm from './RoomManagement/RoomForm';
function App() {
  let room_id = '';
  let room_name = '';
  let user_name = JSON.parse(document.querySelector('#username').textContent);
  let user_id = JSON.parse(document.querySelector('#user_id').textContent);
  const [username, setUsername] = useState(user_name);
  const [userid, setUserid] = useState(user_id);
  const [roomid, setRoomid] = useState(room_id);
  const [roomname, setRoomname] = useState(room_name);
  const [roomurl, setRoomurl] = useState('');
  const [IsVisibleAddRoom,setIsVisibleAddRoom] = useState(false);
  const [triggerFetchRoomData,setTriggerFetchRoomData]=useState(false);

  /* EVENT HANDLERS */
  const handleChatSelect = event => {
    var data = event.target;
    setRoomname(data.textContent);
    setRoomid(data.getAttribute('data-id'));
  };

  /* Close Add Room */
  const handleCloseAddRoom = event => {
    console.log('close it bitch');
      setIsVisibleAddRoom(false);
  };
    /* When show Add Room is Clicked */
    const handleCreateRoom = event =>{
        setIsVisibleAddRoom(true);
    }
    /* After data is refreshed*/
    const roomDataRefreshed=()=>{
        setTriggerFetchRoomData(false)
    }
    /* Room Added */
    const handleRoomAdded=()=>{
        setTriggerFetchRoomData(true);
        console.log("room added  triggered");
    }
  return (
    <StyledChatContainer>
      <ChatLeft onClick={handleChatSelect}  refresh={triggerFetchRoomData}  dataRefreshed={roomDataRefreshed} />
      <ChatDialog room_name={roomname} room_id={roomid} username={username} onClick={handleCreateRoom} />
      {IsVisibleAddRoom ? <RoomForm onClick={handleCloseAddRoom} onAddRoom={handleRoomAdded} /> : ''}
    </StyledChatContainer>
  );
}

export default App;
