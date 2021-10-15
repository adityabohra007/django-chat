import uuid
import time
import os
import asyncio
from django.contrib.auth.models import User
from django.db.models.signals import m2m_changed, post_save, pre_delete, post_delete
from django.conf import settings
from django.db import models
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.contrib.auth.models import User


from django.contrib.auth.models import User
from channels.layers import get_channel_layer
from .serializers_chat import ChatMemberSerializer
import json
from asgiref.sync import async_to_sync


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

    if clients.exists():
        for client in clients:
            group_name = "users_"+str(company)
            try:
                async_to_sync(channel_layer.group_send)(group_name, data)
            except:
                print("Error group_send")
    else:
        print("no one is there for you")


def send_user_remove_status(user):
    ''' Delete to Channels: Removed User update to the chat room'''
    print(user, "send_remove")
    room_list = User.objects.filter(id=user.id).values("room")
    channel_layer = get_channel_layer()
    data = {"type": "send.websocket",
            "message": "remove",
            "update_user": json.loads(json.dumps(ChatMemberSerializer(User.objects.filter(id=user.id), many=True).data))
            }
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

    if clients.exists():
        for client in clients:
            group_name = "users_"+str(company)
            try:
                async_to_sync(channel_layer.group_send)(group_name, data)
            except:
                print("Error group_send")
    else:
        print("no one is there for you")


class Client(models.Model):
    user = models.ForeignKey(User, default=1, on_delete=models.CASCADE)
    last_seen = models.DateTimeField(auto_now_add=True)


def users_status(sender, instance, **kwargs):
    channel_layer = get_channel_layer()
    send_user_status(instance.user)


def update_remove(sender, instance, **kwargs):
    ''' Delete Signal: Removed User update to the chat room'''
    channel_layer = get_channel_layer()
    send_user_remove_status(instance.user)


post_save.connect(users_status, sender=Client)  # post_save user update add
# post_delete user update delete
post_delete.connect(update_remove, sender=Client)


class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL,
                                on_delete=models.CASCADE, related_name='profile')
    last_visit = models.DateTimeField()


# This model is used to give date and time when a message was created/modified.
class DateTimeModel(models.Model):
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Room(DateTimeModel):
    id = models.UUIDField(primary_key=True,
                          default=uuid.uuid4,
                          editable=False)
    members = models.ManyToManyField(settings.AUTH_USER_MODEL)
    name = models.CharField(max_length=100, default="Discussion Room")
    # def __str__(self):
    #     memberset = self.members.all()
    #     members_list = []
    #     for member in memberset:
    #         members_list.append(member.username)

    #     return "("+self.name+") "+", ".join(members_list)

    def group_name(self):
        print("chat_", self.id)


def room_member_status(sender, instance, **kwargs):
    print(instance.id)
    room_id = instance.id
    room_group_name = 'chat_%s' % room_id
    members = instance.members.all()
    print("--", members, room_group_name, "--")
    # user_status(room_group_name)
# m2m_changed.connect(room_member_status,sender=Room.members.through)


def user_status(room_group_name):

    channel_layer = get_channel_layer()
    print("--user_status--")
    data = {"type": "user_status", "message": "members"}
    #async_to_sync(channel_layer.group_send)(room_group_name, data)


class Message(DateTimeModel):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL,
                               on_delete=models.CASCADE, related_name='sender')
    file = models.FileField(null=True, blank=True)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    text = models.TextField(null=True)
    recipients = models.ManyToManyField(settings.AUTH_USER_MODEL,
                                        related_name='recipients')

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return str(self.room.id)+"sender"+self.sender.username

# def new_message(sender,instance,**kwargs):
#    if instance.file is not None:
#        basename = os.path.basename( instance.file.path )
#        channel=get_channel_layer()
#        group_id = 'users_'+str(instance.room.id)
#        print(group_id)
#        data = {"type":"image_message","message":"image-url", 'url': settings.MEDIA_URL + basename,'size' : instance.file.size,}
#        print(data)
#        async_to_sync(channel.group_send)(group_id,data)


# post_save.connect(new_message,sender=Message)

    # def __str__(self):
    #    return f'{self.text} sent by "{self.sender}" in Room "{self.room}"'
