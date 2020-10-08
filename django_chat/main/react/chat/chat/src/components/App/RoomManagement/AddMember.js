import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import {StyledBtn} from './../styles';
import {StyledAddMember} from './style';
import {RoomMember, ExistingMembers, AddRoomMembers} from './api';
import {FaWindowClose} from 'react-icons/fa';
import Cookies from 'js-cookie';
const AddMember = props => {
  const [companyMemberList, setCompanyMemberList] = useState([]);
  const [roomMembers, setRoomMembers] = useState([]);
  const [existingMembers, setExistingMembers] = useState([]);
  //  const [selectedMember, setSelectedMember] = useState();

  useEffect(() => console.info('Spotted'));
  const converToSelectFormat = inputList => {
    return inputList.map(data => {
      return {value: data.id, label: data.username};
    });
  };

  const addUser = data => {
    fetch(AddRoomMembers(props.room_id), {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
    })
      .then(resp => resp.json())
      .then(response => {
        setExistingMembers(response[0].members);
      });
  };

  const fetchCompanyMembers = () => {
    fetch(RoomMember(props.room_id))
      .then(res => res.json())
      .then(result => {
        setCompanyMemberList(converToSelectFormat(result));
      });
  };
  const fetchExistingMembers = () => {
    fetch(ExistingMembers(props.room_id))
      .then(res => res.json())
      .then(result => {
        setExistingMembers(result[0].members);
      });
  };

  useEffect(() => {
    console.log('Add Member is Working');
    fetchCompanyMembers();
    fetchExistingMembers();
  }, []);

  const handleSelectMemberChange = selectedOptions => {
    setRoomMembers(selectedOptions);
  };
  const handleAddUser = () => {
    var data = JSON.stringify({
      members: roomMembers.map(data => data.value),
    });
    addUser(data);
  };

  const ExistingMemberList = existingMembers.length ? (
    existingMembers.map(data => (
      <li style={{background: '#f0f0f0', padding: '5px'}}>{data.username}</li>
    ))
  ) : (
    <li>No Member Avalilable</li>
  );

  const formRender = (
    <form>
      <label>Select User</label>
      <Select
        options={companyMemberList}
        value={roomMembers}
        className="basic-multi-select"
        classNamePrefix="select"
        isMulti
        onChange={handleSelectMemberChange}
        style={{marginBottom: '10px'}}
      />

      <StyledBtn onClick={handleAddUser}>Add User</StyledBtn>
    </form>
  );

  return (
    <StyledAddMember>
      <div id="addMemberDialog">
        <div
          style={{
            borderBottom: '1px solid #e8e4e4',
            padding: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <h4 style={{marginBottom: '0px'}}>Add Room Member</h4>
          <FaWindowClose style={{fontSize: '1rem'}} onClick={props.onClick} />
        </div>

        <div className={'dialog-body'}>
          {formRender}

          <div style={{padding: '5px'}}>
            <p style={{textAlign: 'center'}}>Already In Room</p>
            <ul style={{overflowY: 'auto'}}>{ExistingMemberList}</ul>
          </div>
        </div>
      </div>
    </StyledAddMember>
  );
};
export default AddMember;
