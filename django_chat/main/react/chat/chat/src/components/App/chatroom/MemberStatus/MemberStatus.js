import React from 'react';
import PropTypes from 'prop-types';
import {StyledUserList, StyledUserStatus, StyledUserName} from './styles';
const MemberStatus = props => {
  console.log(props.members);
  return (
    <StyledUserList>
      {props.members.map((user, index) => (
        <div
          className={'userName'}
          onClick={() => props.onClick(user.id)}
          key={index}>
          <StyledUserStatus status={user.status}> </StyledUserStatus>
          <StyledUserName>{user.username}</StyledUserName>
        </div>
      ))}
    </StyledUserList>
  );
};

MemberStatus.propTypes = {
  members: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      member: PropTypes.arrayOf(PropTypes.number),
    }),
  ),
};
export default MemberStatus;
