import React, {useEffect, useState} from 'react';
import {StyleWebsocketStatus, StyledDataList} from './style';

const ChatList = props => {
  return (
    <StyledDataList>
      {status}
      {dataList}
    </StyledDataList>
  );
};
export default ChatList;
