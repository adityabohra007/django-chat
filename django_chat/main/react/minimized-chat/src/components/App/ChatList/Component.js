import React from "react";
//import {} from './styles.js'
import { StyleWebsocketStatus, StyledDataList } from "./styles";

const Component = (props) => {
  return (
    <StyledDataList>
      {props.status}
      {props.dataList}
    </StyledDataList>
  );
};
export default Component;
