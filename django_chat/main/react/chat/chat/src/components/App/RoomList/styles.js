import styled from 'styled-components';
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

