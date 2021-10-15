import json

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.contrib.auth.models import User

from .models import Client
from .serializers_chat import ChatMemberSerializer


def send_user_status(user):
    room_list = User.objects.filter(id=user.id).values("room")
    channel_layer = get_channel_layer()
    data = {"type": "send.websocket",
            "message": "update",
            "update_user": json.loads(json.dumps(ChatMemberSerializer(User.objects.filter(id=user.id), many=True).data))
            }
    print("send_user_utils")
    try:
        print(data)
        # time.sleep(5)
        company = user.usercompany.company.id
        print(company)
        clients = None
    except:
        print("yo found the prob")

    try:
        clients = Client.objects.filter(user__usercompany__company=company)
        print("from custom_utils send update")
        print(clients)
    except:
        clients = Client.objects.all()
        print(clients)
        print("client error")

    '''if clients.exists():
        for client in clients:
            group_name="users_"+str(company)
            try:
                async_to_sync(channel_layer.group_send)(group_name, data)
            except:
                print("Error group_send")
    else:
        print("no one is there for you")
    '''


def send_user_remove_status(user):
    ''' Delete to Channels: Removed User update to the chat room'''
    print(user, "send_remove")
    room_list = User.objects.filter(id=user.id).values("room")
    channel_layer = get_channel_layer()
    data = {"type": "send.websocket",
            "message": "remove",
            "update_user": json.loads(json.dumps(ChatMemberSerializer(User.objects.filter(id=user.id), many=True).data))
            }
    print("room_list", room_list.exists())
    if room_list.exists():
        for room in room_list:
            group_name = "users_"+str(room['room'])
            try:
                async_to_sync(channel_layer.group_send)(group_name, data)
                print("sent data")
            except:
                print("Error group_send")
    else:
        print("no room")
