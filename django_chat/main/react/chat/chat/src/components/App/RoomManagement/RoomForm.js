import React, {useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import {
  StyledRoundInput,  StyledBtn,    StyleLoaderWrapper }
 from './../styles';
import{
  StyledRoomForm,
  StyledRoomFormWrapper,
} from './style';
import {FaWindowClose} from 'react-icons/fa';
import Select from 'react-select';
import Loader from './../loader.svg';
import {RoomAdd} from './api';

import {CompanyUserList } from './../apiurl';
console.log(RoomAdd)
const LoadingWidget = (props) =>{
return <StyleLoaderWrapper>
        <img src={Loader} />
      </StyleLoaderWrapper>

}
const RoomForm = (props) => {
  const [roomName, setRoomName] = useState();
  const [roomMembers, setRoomMembers] = useState();
  const [companyMemberList, setCompanyMemberList] = useState();
  const [isLoading,setIsLoading] = useState(false);
  const converToSelectFormat = inputList => {
    return inputList.map(data => {
      return {value: data.id, label: data.username};
    });
  };

  const fetchCompanyMembers = () => {
    fetch(CompanyUserList)
      .then(res => res.json())
      .then(result => {
        setCompanyMemberList(converToSelectFormat(result));
      });
  };

  const handleAddRoom = () => {
    setIsLoading(true);
    var formdata = new FormData();
    formdata.append('name', 'Testing3');
    formdata.append('members', JSON.stringify([1, 2]));
    const data = {
      name: roomName,
      members: roomMembers.map(data => {
        return data.value;
      }),
    };
    var requestOptions = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
    };

    fetch(RoomAdd, requestOptions)
      .then(response => response.json())
      .then(result => {
          console.log(result)
          setRoomName('');
          setRoomMembers([]);
          props.onAddRoom();
      })
      .catch(error => console.log('error', error));

    setIsLoading(false);
  };
  const handleRoomNameChange = event => {
    setRoomName(event.target.value);
  };
  const handleSelectMemeberChange = selectedOptions => {
    setRoomMembers(selectedOptions);
  };
  useEffect(() => {
    fetchCompanyMembers();
  }, []);
  return (
    <StyledRoomFormWrapper id="add-room-dialog">
      {isLoading ?
        <LoadingWidget/>:""}
            <div id="addroom-close" >
        <FaWindowClose onClick={props.onClick} />
      </div>
      <div>
        <h4>Create Room</h4>
        <StyledRoomForm>
          <div className={'inputWrapper'}>
            <label>Room Name</label>
            <StyledRoundInput
              placeholder="Enter Room Name"
              name="room_name"
              onChange={handleRoomNameChange}
              value={roomName}
            />
          </div>
          <div className={'inputWrapper'}>
            <label>Members</label>
            <Select
                options ={companyMemberList}
              value={roomMembers}
              className="basic-multi-select"
              classNamePrefix="select"
              isMulti
              onChange={handleSelectMemeberChange}
            />
          </div>
          <div className={'inputWrapper  addRoomButtonWrapper'}>
            <StyledBtn light onClick={handleAddRoom}>
              Create Room
            </StyledBtn>
          </div>
        </StyledRoomForm>
      </div>
    </StyledRoomFormWrapper>
  );
};

export default RoomForm;
