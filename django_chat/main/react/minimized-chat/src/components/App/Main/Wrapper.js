import React, { useEffect, useState } from "react";
import Component from "./Component";
const Wrapper = (props) => {
  var chat_url = (room_id) => {
    let ws_or_wss = window.location.protocol == "https:" ? "wss://" : "ws://";
    let websocket_url =
      ws_or_wss +
      window.location.host +
      "/ws/django_chatter/chatrooms/chat/" +
      room_id +
      "/";
    return websocket_url;
  };
  const messages = [
    {
      //room_name:"Room",
      //user:users,
      message: [
        {
          id: 1,
          sender__username: "Aditya",
          sender_id: 1,
          time: "2012/12/22",
          text: "This is me",
        },
      ],
    },
  ];
  const user = JSON.parse(document.getElementById("username").textContent);
  const [userName, setUserName] = useState(user);
  const [isUserlist, setIsUserList] = useState(true);
  const [userList, setUserList] = useState([]);
  const [messageList, setMessageList] = useState(messages);
  const [roomName, setRoomName] = useState("Room");
  const [roomId, setRoomId] = useState();
  const [chatLoading, setChatLoading] = useState("false");
  const [chatsocketURL, setChatsocketurl] = useState(chat_url(roomId));
  const [chatsocket, setChatsocket] = useState();
  const [moreAvailable, setMoreAvailable] = useState(true);
  const [lastmessageId, setlastmessageId] = useState(0);
  const [messageSave, setMessageSave] = useState("");
  const [MemberReference, setMemeberReference] = useState([]);
  const [latestRef, setLatestRef] = useState([]);

  const minimizeChat = () => {
    var liveWrapper = document.getElementById("live-chat");
    if (liveWrapper.classList.contains("chat-close")) {
      liveWrapper.classList.remove("chat-close");
      liveWrapper.style.bottom = "0px";
    } else {
      liveWrapper.classList.add("chat-close");
      liveWrapper.style.bottom =
        "-" + document.querySelector("#chat").offsetHeight + "px";
    }
  };

  const chatWebsocket = () => {
    console.log(chatsocketURL);
    var chatws = new WebSocket(chatsocketURL);
    console.debug("chatws", chatws);
    setChatsocket(chatws);

    chatws.onopen = function () {
      console.info("chat is open");
      const sending_data = JSON.stringify({
        message_type: "fetch",
        room_id: roomId,
        last_fetch_id: lastmessageId,
        fetchCount: 10,
      });
      console.debug(sending_data);
      console.debug(chatws);
      chatws.send(sending_data);
      console.debug("sent data ");
    };

    chatws.onerror = function () {
      console.error("chat is error");
      setChatLoading(false);
    };
    chatws.onclose = function () {
      console.info("chatws is now closed");
    };
    chatws.onmessage = function (response) {
      console.log("message is coming");
      const parsed = JSON.parse(response.data);
      console.info(parsed);
      if (parsed.message == "fetch_message") {
        const messages = parsed.data_message;
        console.log("messages");
        console.log(messages);
        if (messages.length == 0) {
          setMessageList([{}]);
        } else {
          setMessageList(messages);
        }
        setMoreAvailable(parsed.moreAvailable);
        setlastmessageId(parsed.last_fetch);
      } else if ((parsed.message = "new_message")) {
        console.log(parsed);
        setMessageList((prevState) => [...prevState, parsed]);
      }
      setChatLoading(false);
    };
  };

  const handleMessageChange = (event) => {
    var value = event.target.value;
    try {
      const matched = value.match(stringReg);
      console.log(matched);
    } catch {
      console.log("error");
    }
    setMessageSave(value);
  };
  const handleSendMessage = (event) => {
    event.preventDefault();
    if (chatsocket.readyState == chatsocket.OPEN) {
      var sending_data = JSON.stringify({
        message_type: "text",
        message: messageSave,
        sender: userName,
        room_id: roomId,
      });
      chatsocket.send(sending_data);
      setMessageSave("");
    }
  };

  const handleMessageClick = (event) => {
    var target = event.target;
    var isBlock =
      target.parentElement.parentElement.childNodes.item(2).style.display ==
      "block";
    if (isBlock) {
      target.parentElement.parentElement.childNodes.item(2).style.display =
        "none";
    } else {
      target.parentElement.parentElement.childNodes.item(2).style.display =
        "block";
    }
  };
  const handleHeaderClick = (event) => {
    var target = event.target;
    minimizeChat();
  };
  const handleBackClick = (event) => {
    setIsUserList(true);
  };
  const handleSelectRoom = (room_id) => {
    var room_data = userList.filter((data) => data.id == room_id);
    if (room_data.length) {
      setRoomName(room_data[0].name);
      setRoomId(room_data[0].id);
      setChatsocketurl(chat_url(room_data[0].id));
      setIsUserList(false);
      setChatLoading(true);
    } else {
      console.log("no room of this name found");
    }
  };

  let userId = "";
  try {
    userId = JSON.parse(document.querySelector("#user_id").textContent);
  } catch (TypeError) {
    userId = "1";
  }
  const findLatestMessageID = () => {
    try {
      var selector = document.querySelector("#message_list div div");
      return selector.getAttribute("data-id");
    } catch (SyntaxError) {
      return 0;
    }
  };

  /* fetch api rooms */
  const FETCH_ROOM_URL = window.origin + "/chat/api/" + userId + "/rooms";
  //    const FETCH_ROOM_URL = "http://localhost:8081" + '/chat/api/' + userId + '/rooms';
  console.log(FETCH_ROOM_URL);

  const fetchRoomData = () => {
    fetch(FETCH_ROOM_URL)
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setUserList(result);
      });
  };

  useEffect(() => {
    console.log(user);
    fetchRoomData();
  }, []);

  useEffect(() => {
    if (chatLoading == true && roomId) {
      chatWebsocket();
    }
  }, [roomId]);

  useEffect(() => {
    try {
      console.log(chatsocket.readyState);
      console.log(")))))))))))))))))");
    } catch {
      console.log("error");
    }
  }, [chatsocket]);
  return (
    <Component
      {...props}
      isUserlist={isUserlist}
      userList={userList}
      roomName={roomName}
      messageList={messageList}
      userName={userName}
      messageSave={messageSave}
      handleSelectRoom={handleSelectRoom}
      handleBackClick={handleBackClick}
      handleHeaderClick={handleHeaderClick}
      handleMessageClick={handleMessageClick}
      handleSendMessage={handleSendMessage}
      handleMessageChange={handleMessageChange}
    />
  );
};

export default Wrapper;
