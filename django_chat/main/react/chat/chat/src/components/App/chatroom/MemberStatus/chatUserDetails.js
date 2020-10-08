import React from 'react';
import {StyledUserDetail} from './styles';
import {FaWindowClose} from  'react-icons/fa';
const UserDetail = (props) => {
  return (
    <StyledUserDetail>
        <FaWindowClose onClick={props.onClose}/>
        <h4>{props.data.username} </h4>
      <div className={"userDetails"}>
        <div><p>Location :</p><p>{props.data.usercompany.company.city}</p></div>
        <div><p>Country :</p><p>{props.data.usercompany.company.country}</p></div>
      </div>
    </StyledUserDetail>
  );
};

export default UserDetail;
