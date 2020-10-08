import styled from 'styled-components';

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

