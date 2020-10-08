/*
AI-------------------------------------------------------------------
	The majority of WebSocket events will take place in this
	JS file.

	Depends on:
		dateFormatter.js
		websocketHelpers.js
-------------------------------------------------------------------AI
*/

//Global variable to modify HREF to tailor to secure or non-secure connections.
var ws_or_wss = window.location.protocol == "https:" ? "wss://" : "ws://";

websocket_url = ws_or_wss + window.location.host
	+'/ws/django_chatter/chatrooms/user/' + room_id + '/';



/*
AI-------------------------------------------------------------------
	The following opens a websocket with the current URL,
	sends messages to that websocket, receives and processes messages
	that are sent back from the server.
-------------------------------------------------------------------AI
*/
var liveSocket =  new WebSocket(
	websocket_url
);
//Notify when the websocket is connected.
liveSocket.onopen = function(e) {
	console.log('User live connected.');
}

/*
AI-------------------------------------------------------------------
	When a message is received:
	1) Parse the message.
	2) Find out who the sender is.
	3) Store the message text.
	4) If there is a warning, store it.
	5) If the message is sent by the user logged into the session,
		apply the correct classes to the message so it's displayed
		to the right.
	6) If the message is sent by a different user, apply the correct
		classes to the message so it's displayed to the left.
	7) If there are warnings in step 5 and 6, append it to the dialog
		after the corresponding message.
	8) Clear the input textarea for the current user to send a new
		chat message.
	9) After the messages have been rendered, scroll down to the bottom
		of the dialog to the latest messages that have been sent.
-------------------------------------------------------------------AI
*/
liveSocket.onmessage=function(e) {
	console.log(e);
	var data = JSON.parse(e.data);
	var message = data['message'];
	var received_room_id = data['room_id'];
    var date_created = dateFormatter(data['date_created']);
    console.log("Out")
	// Below fills the members list if message is users
if(message==="users"){
    console.log("Users")
var list_user = ""
for(i in data["all_members"]){
     console.log(data["all_members"][i])
     var color="5px #ff0036 solid"
     if(i in data["live_members"]){color="5px #07ff00 solid"}
     var user_div="<div style=\"display:flex;background:#dff3ec;margin:0px 2px \" id=\""+i+" \"><div class=\"mx-2 my-2\" style=\"border-radius: 50%;border:"+color+" ;width: 2px;height: 2px;min-width: 10px;\"></div><span>"+data["all_members"][i]+"</span>&nbsp;&nbsp;</div>"
     console.log(user_div);
    list_user+=user_div;
}
 $("#member-list").append(list_user);


}
member_list=$("#member-list >div")
if(message==="update"){
      for(i in data['update_user']){
	      console.log(typeof(i))
	      for(j=0;j<member_list.length;j++){
                      deep=member_list.eq(j)
		      console.log(typeof(deep.attr("id")));
		      console.log(deep.attr("id").trim())
		      if(deep.attr("id").trim()==i){console.log("eureka")
			deep.find("div").css("border","solid").css("border-color","#07ff00").css("border-width","5px")
		      }

	      }
      }
}
if(message==="remove"){
	for(i in data['update_user']){
		console.log(typeof(i))
		for(j=0;j<member_list.length;j++){
					deep=member_list.eq(j)
			console.log(typeof(deep.attr("id")));
			console.log(deep.attr("id").trim())
			if(deep.attr("id").trim()==i){console.log("eureka")
		  deep.find("div").css("border","solid").css("border-color","#ff0036").css("border-width","5px")
			}

		}
	}
}
}

//Notify when the websocket closes abruptly.
liveSocket.onclose=function() {
	console.log('WebSocket disconnected.');
	//setTimeout(function(){startWebSocket(websocket_url)}, 5000);
}

//When the enter key is pressed on the textarea, trigger a click
//on the Send button.
