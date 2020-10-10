import React from 'react';
import {StyledHeader} from './styles';
import {FaArrowLeft} from 'react-icons/fa';

const ChatHeader = props => {
  const isUserList = props.type ? (
    <h4 className={'chat-header'} onClick={props.onClick}>
      {props.heading}
    </h4>
  ) : (
    <>
      <p
        id="chat-back"
        onClick={() => {
          props.onClickBack();
        }}>
        <FaArrowLeft />
      </p>
      <h4 className={'chat-header'} onClick={props.onClick}>
        {props.heading}
      </h4>
    </>
  );
  return (
    <StyledHeader className="clearfix">
      {isUserList}
      <span className="chat-message-counter">3</span>
    </StyledHeader>
  );
};
export default ChatHeader
