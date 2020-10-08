export const RoomAdd = window.origin + '/chat/api/room/add';
export const AddRoomMembers = room_id =>
  window.origin + '/chat/api/room/' + room_id + '/members/add';
export const ExistingMembers = room_id =>
  window.origin + '/chat/api/room/' + room_id + '/existing/members';
export const RoomMember = room_id =>
  window.origin + '/chat/api/room/' + room_id + '/members';



