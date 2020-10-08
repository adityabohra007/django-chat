import React from 'react';

import {StyledBtn} from './../styles';
const AddRoom = props => {
  return (
    <>
      <div
        style={{
          gridRow: '2/3',
          padding: 'inherit',
          display: 'flex',
          flexFlow: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <h3 style={{textAlign: 'center'}}>Select Room to Show Messages</h3>

        <StyledBtn href="#" onClick={props.onClick}>
          Create New Room
        </StyledBtn>
      </div>
    </>
  );
};

export default AddRoom;
