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

export const StyledDataList = styled.div`
  height: 252px;
  overflow-y: auto;
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


