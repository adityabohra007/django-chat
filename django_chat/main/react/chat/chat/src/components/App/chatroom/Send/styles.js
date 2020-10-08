import styled from 'styled-components';
export const StyledInput = styled.textarea`
  border: 0px;
  padding: 10px;
  resize: none;
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

