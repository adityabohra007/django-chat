import React, {useState, useEffect} from 'react';
import {
  StyledChatSend,
  StyledInput,
  StyledSendBtn,
} from './styles';
import {MdSend} from 'react-icons/md';
import {GrGallery} from 'react-icons/gr';
import FilePreview from './FilePreview';

const ChatSend = props => {
  const [chatFileUpload, setChatFileUpload] = useState([]);
  const [messageSave, setMessagesave] = useState('');

  const handleIconClick = event => {
    console.log('yo');
    console.log(chatFileUpload.length);
  };
    useEffect(()=>{
      setChatFileUpload([])
  },[props.socket])
  /* Message Sending Handling*/
  const handleMessageChange = event => {
    console.log(event.target);
    const target = event.target;
    const data = event.target.value;
    setMessagesave(data);
    console.log(data);
  };
  const handleSendMessage = event => {
    console.log('send message');
    if (props.socket.readyState == props.socket.OPEN) {
      var sending_data = JSON.stringify({
        message_type: 'text',
        message: messageSave,
        sender: props.username,
        room_id: props.room_id,
      });
      props.socket.send(sending_data);
      setMessagesave("");
    }
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
        props.socket.send(
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

  return (
    <StyledChatSend>
      {chatFileUpload.length ? (
        <FilePreview
          onFileSend={handleFileSend}
          onFileSendCancel={handleFileSendCancel}
          fileSelected={chatFileUpload}
          socket={props.socket}
        />
      ) : (
        ''
      )}

      <div className={'fileSelect'} onClick={handleIconClick}>
        <label for="attachFile">
          {' '}
          <GrGallery />{' '}
        </label>
        <input
          type="file"
          name="attachFile"
          hidden
          id="attachFile"
          onChange={handleFileChange}
          accept="image/*,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        />
      </div>

      <div className="InputWrapper">
        <StyledInput
          onChange={handleMessageChange}
          value={messageSave}
          type="text"
          placeholder="Type text to send...."
          style={{flex: '1 1 30%'}}
        />
        <StyledSendBtn
          onClick={(event) => {
            if (event.target.value != '') {
              handleSendMessage();
            }
          }}>
          <MdSend />
        </StyledSendBtn>
      </div>
    </StyledChatSend>
  );
};

export default ChatSend;
