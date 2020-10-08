import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {
  StyledSearchInput,
  StyleList,
  StyledChatLeft,
  StyledSearchWrapper,
} from './styles';
import {FETCH_ROOM_URL} from './api';
let userId = '';
try {
  userId = JSON.parse(document.querySelector('#user_id').textContent);
} catch (TypeError) {
  userId = '1';
}
export const ChatLeft = props => {
  const data = [
    {name: 'Adifgvmfdv', url: 'sbrgb', type: 'room'},
    {name: 'Aditya', url: 'criiov', type: 'user'},
    {name: 'Mohit', url: 'blah', type: 'user'},
  ];
  const [statusData, setStatusdata] = useState({isFetching: true});
  const [listData, setListData] = useState([]);
  const [searchList, setSearchlist] = useState(listData);
  const [searchString, setSearchString] = useState('');
    const fetchRoomData = () => {
      fetch(FETCH_ROOM_URL(userId))
        .then(res => res.json())
        .then(result => {
          console.log(result);
          setListData(result);
          setSearchlist(result);
        });
    };
  useEffect(() => {
    fetchRoomData();
  }, []);
  useEffect(() => {
      console.log("props.refresh"+props.refresh)
      if(props.refresh){
          console.log("refreshing ...........")
          fetchRoomData();
          props.dataRefreshed();
      }
  }, [props.refresh]);
  const searchIn = event => {
    const {name, value} = event.target;
    console.log(name, value);
    setSearchString(value);
    if (value) {
      setSearchlist(listData.filter(data => data.name.includes(value)));
    } else {
      setSearchlist(listData);
    }
  };

  return (
    <StyledChatLeft>
      <StyledSearchWrapper>
        <StyledSearchInput
          type="text"
          id="search"
          value={searchString}
          placeholder="Search"
          onChange={searchIn}
          name="search"
        />
      </StyledSearchWrapper>

      <StyleList>
        <div className="tag">Rooms</div>
        {searchList.map(single =>
          single.members.length >= 3 ? (
            <ChatSelectName
              type="room"
              onClick={props.onClick}
              room_name={single.name}
              room_id={single.id}
            />
          ) : (
            ''
          ),
        )}

        <div className="tag">Users</div>
        {searchList.map(single =>
          single.members.length == 2 ? (
            <ChatSelectName
              type="user"
              onClick={props.onClick}
              room_name={single.name}
              room_id={single.id}
            />
          ) : (
            ''
          ),
        )}
      </StyleList>
    </StyledChatLeft>
  );
};

const ChatSelectName = props => {
  const classType =
    props.type == 'room' ? 'listContent room ' : 'listContent user';
  return (
    <li className={classType}>
      <p onClick={props.onClick} data-id={props.room_id}  >{props.room_name}</p>
    </li>
  );
ChatSelectName.propTypes ={
    room_id:PropTypes.string,
    room_name:PropTypes.string,
    onClick:PropTypes.func,
    }
};
