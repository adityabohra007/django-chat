import styled from 'styled-components';
//import {tablet, mobile, monitor} from './../../styles/mediaQueries';

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


export const StyledSearchInput = styled.input`
  padding: 10px 10px;
  margin: auto;

  background: transparent;
  border: 1px solid white;
  color: white;
  border: 0;
  border-bottom: 1px solid wheat;
`;
export const StyledSearchWrapper = styled.div`
  padding: 10px 2px;
  display: flex;
  background: rgb(82, 93, 104);
`;
export const StyleList = styled.ul`
  display: flex;
  overflow-y: scroll;
  flex-flow: column;
  margin-bottom: 0px;
  div.tag {
    background: lightgray;
    text-align: center;
  }
  li.listContent {
    display: flex;
    justify-content: space-around;
    background: rgb(231, 234, 238);
    cursor: pointer;
    align-items: center;
    transition-duration: 1s;
    &:hover {
      background: #f2f2f2;
    }
    p {
      margin: auto;
      padding: 15px 10px;
      flex: 4 1 50%;
      word-wrap: anywhere;
    }
    span {
      flex: 1 1 10%;
    }
  }
`;
export const StyledChatLeft = styled.div`
  background: gray;
  display: grid;
  grid-template-rows: 70px auto;
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


