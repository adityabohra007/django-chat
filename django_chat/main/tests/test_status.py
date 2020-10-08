import pytest
import json
import os
import base64
from channels.testing import WebsocketCommunicator
from django.test import Client
from channels.testing import HttpCommunicator
from ..consumers import StatusConsumer
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async
from django_chatter.models import Room,Message
from realtime import settings
from realtime.routing import application
from django.contrib.auth.models import User
from ..serializers_chat import ChatMemberSerializer
#from ..models import Client as client
from channels.generic.websocket import (
    AsyncJsonWebsocketConsumer,
    AsyncWebsocketConsumer,
    JsonWebsocketConsumer,
    WebsocketConsumer,
)
TEST_CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
    },
}


@database_sync_to_async
def create_user(
    *,
    username='rider@example.com',
    password='pAssw0rd!',
):
    # Create user.
    user = get_user_model().objects.create_user(
        username=username,
        password=password
    )

    user.save()
    return user
@database_sync_to_async
def create_room(user,room_name="demoroom"):
    room=Room.objects.create(name=room_name)
    room.save()
    room.members.add(user)
    room.save()
    print(room)
    return room

@pytest.mark.asyncio
@pytest.mark.django_db(transaction=True)
class TestWebsockets:
    async def test_authorized_user_can_connect(self,settings):
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        communicator,user=await self.auth_connect()
#        assert response['status']==200
        await communicator.disconnect()

    async def test_send(self,settings):
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        communicator,user=await self.auth_connect()
        await communicator.send_json_to({
            "type":"test"
            })
        response = await communicator.receive_json_from()
        data = response['message']
        assert data == 'tested'
        await communicator.disconnect()


    async def all_method(self):
        serializer=ChatMemberSerializer(User.objects.filter(room__id=self.room.id),many=True).data
        return json.loads(json.dumps(serializer))

    async def live_method(self):
        serializer=ChatMemberSerializer(User.objects.filter(room__id=self.room.id).exclude(client__id=None),many=True).data
        return json.loads(json.dumps(serializer))


    async def test_members_status(self):
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        communicator,user=await self.auth_connect()
        await communicator.send_json_to({
            "room_id":str(self.room.id),

            "type":"fetch.status"
            })
        response = await communicator.receive_json_from()
        message = response['message']
        all_members=response['all_members']
        live_members=response['live_members']
        assert message == 'users'
        assert all_members == await self.all_method()
        assert live_members ==await  self.live_method()
        await communicator.disconnect()


    async def auth_connect(self):
        client =Client()
        user =  await create_user()
        self.room= await create_room(user=user)
        client.force_login(user=user)
        communicator=WebsocketCommunicator(
                application = application,
                path='/ws/django_chatter/chatrooms/user/',
                headers=[(
                          b'cookie',
                          f'sessionid={client.cookies["sessionid"].value}'.encode('ascii')
                            )]
                    )
        connected,_= await communicator.connect()
        assert connected is True
        return communicator,user



