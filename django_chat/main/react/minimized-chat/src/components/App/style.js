import styled from 'styled-components';

export const StyledHeader = styled.div`
  background: #293239;
  border-radius: 5px 5px 0 0;
  color: #fff !important;
  cursor: pointer;
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;

  &:before {
    content: '';
    display: table;
    &:after {
      clear: both;
    }

    span {
      background: #e62727;
      border: 1px solid #fff;
      border-radius: 50%;
      display: none;
      font-size: 12px;
      font-weight: bold;
      height: 28px;
      left: 0;
      line-height: 28px;
      margin: -15px 0 0 -15px;
      position: absolute;
      text-align: center;
      top: 0;
      width: 28px;
    }
  }
  h4.chat-header {
    font-size: 12px;
    padding: 8px 10px;
    flex: 1 1 70%;
    color: white;
    &:before {
      background: #1a8a34;
      border-radius: 50%;
      content: '';
      display: inline-block;
      height: 8px;
      margin: 0 8px 0 0;
      width: 8px;
    }
  }
`;

export const StyledChatMessage = styled.div`
  cursor: pointer;
  div.sender {
    h5 {
      padding: 5px;
      background: #dde6f9;
    }
  }
  .message {
    display: flex;
    align-items: center;
    padding: 10px 8px;

    &:hover {
      background: lightblue;
    }

    p {
      padding: 10px 5px;
      width: 100%;
      font-family: sans-serif;
    }
  }
  .time {
    p {
      background: #e0e1e3;
      padding: 5px;
    }
  }
`;

export const StyleMiniChatWrapper = styled.div`
  bottom: 0;
  font-size: 12px;
  right: 24px;
  position: fixed;
  width: 300px;

  a {
    text-decoration: none;
  }

  h4,
  h5 {
    line-height: 1.5em;
    margin: 0;
    font-family: sans-serif;
  }
  img {
    border: 0;
    display: block;
    height: auto;
    max-width: 100%;
  }

  h5 {
    font-size: 10px;
  }

  p {
    margin: 0;
    font-family: sans-serif;
  }
  #chat-back {
    width: 20px;
    padding: 4px;
  }
  svg {
  }
  .chat-message-counter {
    background: #e62727;
    border: 1px solid #fff;
    border-radius: 50%;
    display: none;
    font-size: 12px;
    font-weight: bold;
    height: 28px;
    left: 0;
    line-height: 28px;
    margin: -15px 0 0 -15px;
    position: absolute;
    text-align: center;
    top: 0;
    width: 28px;
  }

  #chat {
    background: #f4f4f4;
  }
`;

/*
.chat-close {
	background: #1b2126;
	border-radius: 50%;
	color: #fff;
	display: block;
	float: right;
	font-size: 10px;
	height: 16px;
	line-height: 16px;
	margin: 2px 0 0 0;
	text-align: center;
	width: 16px;
}

.chat {
	background: #fff;
}







.chat-feedback {
	font-style: italic;
	margin: 0 0 0 80px;
}



*/

export const StyleStatus = styled.div`
  padding: 2px 5px;
  .outer {
    width: 40px;
    height: 40px;
    background: gray;
    border-radius: 50%;
    border: 5px solid #bbe1fa;
  }
  .status {
    width: 20%;
    height: 20%;
    border-radius: 50%;
    border: 2px solid white;
    position: relative;
    left: 75%;
    top: 75%;
    background: red;
  }
`;
export const StyleRoom = styled.div`
  padding: 0px 2px;
  cursor: pointer;
  display: flex;
  &:hover {
    background: lightblue;
  }
  img {
    border-radius: 50%;
    float: left;
  }

  h5.roomname {
    font-size: 13px !important;
    padding: 10px;
    width: 100%;
    line-height: 2;
    display: flex;
    align-items: center;
    span {
      flex: 1 1 50%;
      text-align: center;
    }
  }
`;
export const StyledDataList = styled.div`
  height: 252px;
  overflow-y: auto;
`;

export const StyleTextInput = styled.input`
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 8px;
  outline: none;
  width: 234px;
`;

export const StyledForm = styled.form`
  padding: 24px;
  fieldset {
    border: 0;
    margin: 0;
    padding: 0;
  }
`;

export const StyleWebsocketStatus = styled.h5`
  position: absolute;
  padding: 5px 10px;
  width: 100%;
`;

export const StyledReferenceList = styled.ul`
padding: 0px;list-style: none;margin-bottom: 0px;width: 100%;max-height: 100px;overflow: auto;min-height: 50px;
li{
    padding: 10px 15px;color: #245e7b;background: white;text-decoration: underline;border-bottom: 1px solid lightgray;
}
`
