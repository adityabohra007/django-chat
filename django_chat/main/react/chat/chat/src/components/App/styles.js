import styled from 'styled-components';
//import {tablet, mobile, monitor} from './../styles/mediaQueries';

export const StyledChatContainer = styled.div`
  display: grid;
  grid-template-columns: minmax(200px, 20%) minmax(auto, 80%);
  grid-template-rows: 100vh;
`;

export const StyledChat = styled.div`
  display: grid;
  grid-template-rows: minmax(18vh, 18vh) minmax(300px, auto) minmax(auto, 10vh);
  grid-template-columns: 100%;
  position: relative;
`;
export const StyledChatHeader = styled.div`
  display: flex;
  flex-flow: column;
  padding: 10px;
`;

export const StyledRoomId = styled.h4`
  margin: 10px;
`;

export const StyledUserStatus = styled.div`
  width: 10px;
  height: 10px;
  background: ${props => (props.status ? 'lightgreen' : 'red')};
  border-radius: 10px;
  margin: 10px;
`;
export const StyledUserName = styled.div`
  margin: 10px;
`;
export const StyledMessageWrapper = styled.div`
  display: flex;
  flex-flow: column;
  margin: 10px 0px;
  ${props =>
    props.userSelf &&
    ` align-items: end;
    `}
  div {
    width: 70%;
    p.message {
      background: aliceblue;
      padding: 14px 10px;
      margin: 2px;
      display: flex;
      align-items: center;
      svg {
        font-size: 30px;
        margin-right: 10px;
      }
      a {
        word-wrap: anywhere;
      }
    }
    p.time {
      margin: 2px;
      font-weight: 200;
      ${props => props.userSelf && ` text-align: right; `}
    }
    p.userName {
      margin: 10px;
      color: lightcoral;
      ${props => props.userSelf && ` text-align: right; color: lightblue;`}
      font-weight: 800;
    }
  }
`;
export const StyledMessages = styled.div`
  border: 1px solid #e3dddd;
  padding: 10px 30px;
  max-height: 500px;
  overflow-y: scroll;
  grid-column: 1/2;
`;

export const StyledUserList = styled.div`
  display: flex;
  overflow-x: auto;

  div.userName {
    margin: 5px;
    background: aliceblue;
    display: flex;
    align-items: center;
    justify-content: space-around;
    cursor: pointer;
    &:hover {
      background: #e0f3ff;
    }
  }
`;
export const StyledInput = styled.textarea`
  border: 0px;
  padding: 10px;
  resize: none;
`;
export const StyledChatSend = styled.div`
  padding: 10px 30px;
  border-top: 1px solid;
  grid-column: 1/2;
  display: flex;
  align-items: center;
  padding: 0px;
  background: #e0e2e8;
  height: 80px;
  position: relative;
  .fileSelect {
    padding: 10px 20px;
    height: 100%;
    display: flex;
    align-items: center;
    svg {
      font-size: 25px;
    }
  }
  div.InputWrapper {
    display: flex;
    flex: 1 1 80%;
    align-items: center;
    height: 100%;
    textarea {
      flex: 1 1 30%;
      background: inherit;
    }
  }
`;

export const StyledSendBtn = styled.span`
  padding: 20px;
  font-size: 20px;
  height: 100%;
  display: flex;
  align-items: center;
  background: #8ac6dd;
  &:hover {
    background: #bad9c2;
  }
`;

export const StyledBtn = styled.a`
  ${props =>
    props.light
      ? 'background: #27496d;color: white !important;'
      : 'background: #3282b8; color: white !important;'}
  border-radius: 5px;

  border: 2px solid #3282b8;
  padding: 10px;
  cursor: pointer;
  text-align: center;
  ${props =>
    props.right
      ? 'text-align:right;'
      : props.left
      ? 'text-align:left;'
      : 'text-align:center;'}
  &:hover {
  ${props => (props.light ? '' : '')}
`;

export const StyledRoundInput = styled.input`
  background: white;
  border: 1px solid white;
  border: 1px solid white;
  border-radius: 5px;
  padding: 10px;
`;
export const StyleLoaderWrapper = styled.div`
  height: 100%;
  background: #a1a6bfb8 none repeat scroll 0% 0%;
  width: 100%;
  z-index: 1;
  display: flex;
  position: absolute;
  img {
    margin: auto;
    height: 100px;
  }
`;

export const StyledUserDetail = styled.div`
  width: 30%;
  height: 30%;
  max-height: 300px;
  min-height: 200px;
  background: white;
  position: absolute;
  box-shadow: 2px 2px 2px 3px #c4bbbb;
  padding: 12px;
  left: 50%;
  top: 50%;
  margin-left: -100px;
  margin-top: -100px;
  svg {
    position: absolute;
    top: -8px;
    right: -8px;
    cursor: pointer;
  }
  div.userDetails {
    div {
      display: flex;
    }
  }
`;

export const StyledFilePreview = styled.div`
  position: absolute;
  background: #cdf0d3;
  height: auto;
  color: #716e6e;
  font-weight: 800;
  padding: 10px;
  width: 100%;
  top: -40%;
  display: flex;
  flex-flow: row;
  div#icon {
    flex: 1 1 0%;
    svg {
      font-size: 40px;
    }
  }
  div#right {
    display: flex;
    flex-flow: row;
    margin-left: auto;
    a {
      padding: 10px 12px;
      background: #3a3b3c;
      color: white;
      margin: auto 10px;
      cursor: pointer;
    }
  }
  div#left {
    display: flex;
    flex: 1 1 40%;
    flex-flow: column;
    p {
      margin: 0px;
    }
  }
`;


