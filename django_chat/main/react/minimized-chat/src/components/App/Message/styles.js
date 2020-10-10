import styled from 'styled-components';
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


