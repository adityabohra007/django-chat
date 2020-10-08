import React, {useEffect, useState} from 'react';
import {socketUtils} from './../Common/socketutils';
import MemberStatus from './MemberStatus';
import utils from './../Common/utils';


const MemberStatusContainer=(props)=>{
const [userDetailSelected, setUserDetailsSelected] = useState();
const [userDetailData, setUserDetailData] = useState();

  const handleUserDetailsClose = () => {
    setUserDetailsSelected(false);
    setUserDetailData('');
  };
  // const handleShowUserDetails = userdata => {
  //   console.log('Details');
  //   fetch(userDetail(userdata))
  //     .then(res => res.json())
  //     .then(res => {
  //       setUserDetailData(res);
  //       setUserDetailsSelected(true);
  //     });
  // };

// // {userDetailSelected ? (
//         <UserDetail onClose={handleUserDetailsClose} data={userDetailData} />
      // ) : (
      //   ''
      // )}
// onClick={handleShowUserDetails}
return(
    <>
              <MemberStatus members={props.memberList}  />
</>
)
}
export default MemberStatusContainer;
