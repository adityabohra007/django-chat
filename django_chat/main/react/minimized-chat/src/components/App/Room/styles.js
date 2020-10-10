import styled from 'styled-components';
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

