import styled from 'styled-components';

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


