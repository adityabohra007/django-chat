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
from django_chatter.models import Room, Message
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
def create_room(user, room_name="demoroom"):
    room = Room.objects.create(name=room_name)
    room.save()
    room.members.add(user)
    room.save()
    print(room)
    return room


@pytest.mark.asyncio
@pytest.mark.django_db(transaction=True)
class TestChatCustomer:
    settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS

    async def test_connect(self):
        communicator, user, room = await self.auth_connect()

    async def auth_connect(self):
        client = Client()
        user = await create_user()
        room = await create_room(user=user)
        client.force_login(user=user)
        communicator = WebsocketCommunicator(
            application=application,
            path='ws/django_chatter/chatrooms/chat/'+str(room.id)+'/',
            headers=[(
                b'cookie',
                f'sessionid={client.cookies["sessionid"].value}'.encode(
                    'ascii')
            )]
        )
        connected, _ = await communicator.connect()
        assert connected is True
        return communicator, user, room

    async def test_new_text_message_valid(self):
        communicator, user, room = await self.auth_connect()
        message = "Hey"
        send_data = {
            'sender': user.username,
            'room_id': str(room.id),
            "message": message,
            "message_type": "text"
        }
        '''data={
                    'type': 'send.websocket',
                    'message_type': 'new_message',
                    'text':"Hey",
                    'date_created': time,
                    'sender__username': self.user.username,
                    'send_id':self.user.id,
                    'room_id': room_id,
                }'''

        await communicator.send_json_to(send_data)

        response = await communicator.receive_json_from()
        response_message = response['text']
        response_room_id = response['room_id']

        assert response['message_type'] == "new_message"
        assert response_message == message
        assert response_room_id == str(room.id)
        assert response['send_id'] == user.id
        assert response['sender__username'] == user.username

    async def test_fetch_message(self):
        communicator, user, room = await self.auth_connect()
        send_data = {
            'room_id': str(room.id),
            'message_type': "fetch",
            'last_fetch_id': 10,
            'fetchCount': 10,
        }
        await communicator.send_json_to(send_data)
        response = await communicator.receive_json_from()

        assert response['message'] == "fetch_message"

    async def test_new_message_image(self):
        communicator, user, room = await self.auth_connect()

        image = open(os.path.abspath("my_first_websocket_image.jpeg"), 'rb')
        image_read = image.read()
        encoded_image = base64.encodebytes(image_read)

        send_data = {
            'sender': user.username,
            'room_id': str(room.id),
            "message_type": "file",
            'file': encoded_image.decode("utf-8"),
            "filename": "AdityaBohra.jpeg"
        }

        await communicator.send_json_to(send_data)
        response = await communicator.receive_json_from()
        response_image = response['file']
        response_image_read = open(
            "/vagrant/greeninfra"+"/media/"+response_image, 'rb').read()
        response_image_encoded = base64.encodebytes(response_image_read)

        assert encoded_image == response_image_encoded
        assert response['text'] == None
        assert response['sender__username'] == user.username
        assert response['sender'] == user.id
        assert response['message'] == "new_message"
