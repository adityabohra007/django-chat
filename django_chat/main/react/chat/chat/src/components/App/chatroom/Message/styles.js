import styled from 'styled-components';


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

