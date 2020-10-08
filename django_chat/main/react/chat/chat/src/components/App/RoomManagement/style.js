import styled from 'styled-components';
import {tablet, mobile, monitor} from '../../../styles/mediaQueries';

export const StyledAddMember = styled.div`
  width: 100%;
  height: 100%;
  background: #cccccc9e;
  box-shadow: 1px 1px 1px 1px gray;
  z-index: 1;
  position: absolute;
  #addMemberDialog {
    position: relative;
    width: 70%;
    height: 70%;
    background: white;
    left: 15%;
    top: 15%;
    border-radius: 10px;
    .dialog-body {
      padding: 10px;
      display: flex;
      flex-flow: column;
      form {
        display: flex;
        flex-flow: column;
        margin-bottom: 10px;
        div.basic-multi-select {
          margin-bottom: 10px;
        }

        a {
          justify-self: center;
          align-self: center;
        }
      }
    }
  }
`;
export const StyledRoomFormWrapper = styled.div`
  width: 300px;
  position: absolute;
  right: 0px;
  background: rgb(50, 130, 184);
  height: 100%;
  h4 {
    font-weight: 600;
    color: white;
    text-align: center;
  }
  #addroom-close {
    display: flex;
    justify-content: right;
    svg {
      font-size: 20px;
      cursor: pointer;
    }
  }
`;
export const StyledRoomForm = styled.form`
  padding: 10px;
  div.inputWrapper {
    display: flex;
    flex-flow: column;
    margin-bottom: 10px;
    label {
      color: white;
      font-weight: 800;
    }
    .addRoomButtonWrapper {
      margin-top: 20%;
      a {
      }
    }
  }
`;


