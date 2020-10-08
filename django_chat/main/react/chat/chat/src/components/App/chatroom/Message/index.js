import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {StyledMessages, StyledMessageWrapper} from './styles.js';
//import {word, image} from './../Common/fileTypes';
import {
  FaFileWord,
  //FaFile,
  FaFilePdf,
  //FaImage,
  FaFileExcel,
  FaFileCsv,
} from 'react-icons/fa';
const ChatMessage = props => {
  const [messages, setMessages] = useState(props.messages);

  useEffect(() => {
    setMessages(props.messages);
  }, [props.messages]);

  const scrollToBottom = () => {};
  /* For initial Position to latest message*/
  useEffect(() => {
    if (props.messages.length) {
      var element = document.querySelector('#message_list');
      element.lastElementChild.scrollIntoView();
    }
  }, []);
  const message = single => {
    if (single.text == null) {
      if (['png', 'jpeg', 'gif', 'jpg'].includes(single.file.split('.')[1])) {
        return (
          <img
            src={window.origin + '/media/' + single.file}
            style={{width: '99%', height: '200px'}}
          />
        );
      }
      if (['docx', 'doc'].includes(single.file.split('.')[1])) {
        return (
          <p className="message">
            {' '}
            <FaFileWord style={{color: '#298bc6'}} />
            <a href={'/media/' + single.file} target="_blank">
              {single.file}
            </a>
          </p>
        );
      }
      if (['xlsx', 'xls'].includes(single.file.split('.')[1])) {
        return (
          <p className="message">
            {' '}
            <FaFileExcel style={{color: 'green'}} />
            <a href={'/media/' + single.file} target="_blank">
              {single.file}
            </a>
          </p>
        );
      }
      if (['pdf'].includes(single.file.split('.')[1])) {
        return (
          <p className="message">
            <FaFilePdf style={{color: '#c82020'}} />
            <a href={'/media/' + single.file} target="_blank">
              {single.file}
            </a>
          </p>
        );
      }
      if (['xml', 'csv'].includes(single.file.split('.')[1])) {
        return (
          <p className="message">
            <FaFileCsv style={{color: 'orange'}} />
            <a href={'/media/' + single.file} target="_blank">
              {single.file}
            </a>
          </p>
        );
      } else {
        return <p>What the hell</p>;
      }
    } else {
      return <p className="message">{single.text}</p>;
    }
  };

  let message_render = {};
  if (messages.length >= 1) {
    message_render = messages.map(single => (
      <StyledMessageWrapper
        userSelf={single.sender__username == props.username}
        key={single.id}
        data-id={single.id}>
        <div>
          <p className="userName">{single.sender__username}</p>
          {message(single)}
          <p className="time">{single.date_created}</p>
        </div>
      </StyledMessageWrapper>
    ));
  }

  const message_exist =
    messages.length != 0 ? message_render : '<p>No Messages Available</p>';
  return (
    <StyledMessages
      onScroll={props.onScroll}
      onLoad={scrollToBottom}
      id={'message_list'}>
      {message_exist}
    </StyledMessages>
  );
};

ChatMessage.propTypes = {
  username: PropTypes.string.isRequired,
  room_id: PropTypes.string.isRequired,
  room_name: PropTypes.string.isRequired,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      text: PropTypes.string,
      date_created: PropTypes.string,
      sender: PropTypes.number,
      sender__id: PropTypes.number,
      sender__username: PropTypes.string,
    }),
  ),
};

export default ChatMessage;
