import pytest
from channels.testing import WebsocketCommunicator
from django.test import Client
from channels.testing import HttpCommunicator
from .consumers import StatusConsumer
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async
from django_chatter.models import Room,Message
from realtime import settings
from realtime.routing import application
TEST_CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
    },
}


#@pytest.mark.asyncio
#async def test_status_consumer_is_live():

#    communicator = HttpCommunicator(StatusConsumer,"GET",'/ws/django_chatter/chatrooms/user/68806125-2e23-4a93-903e-a1846fed920f')
#    response = await communicator.get_response()
#    assert response["body"]==b"test response"
#    assert response["status"] == 200

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

#@pytest.mark.asyncio
#@pytest.mark.django_db(transaction=True)
#class TestWebsockets:
'''    async def test_authorized_user_can_connect(self,settings):
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        client = Client()
        user =  await create_user()
        room= await create_room(user=user)
        client.force_login(user=user)
        communicator = WebsocketCommunicator(
                    application =application,
                    path='/ws/django_chatter/chatrooms/user/'+str(room.id)+'/',
                    headers=[(
                          b'cookie',
                          f'sessionid={client.cookies["sessionid"].value}'.encode('ascii')
                            )]
                    )
#        response = await communicator.get_response()
#        assert response['status']==200
        connected,_ = await communicator.connect()
        assert connected is True
        await communicator.disconnect()'''

async def auth_connect(user,room):
        client =Client()
        client.force_login(user=user)
        communicator=WebsocketCommunicator(
                application = application,
                path='/ws/django_chatter/chatrooms/user/'+str(room.id)+'/',
                headers=[(
                          b'cookie',
                          f'sessionid={client.cookies["sessionid"].value}'.encode('ascii')
                            )]
                    )
        connected,_= await communicator.connect()
        assert connected is True
        return communicator



@pytest.mark.asyncio
@pytest.mark.django_db(transaction=True)
class TestStatusWebSocket:

    async def test_status_connect(self,settings):
        await print("test_status_connect")
        settings.CHANNEL_LAYERS=TEST_CHANNEL_LAYERS
        user=await create_user()
        room=await create_room(user)
        communicator =await auth_connect(user,room)
        response = await communicator.receive_json_from()
        data = response.get('message')
        assert "users" == data
        data_send={"message_type":"text","message":"fetch"}
        await communicator.send_json_to(data_send)
        response_two = await communicator.receive_json_from()

        assert response_two['message']=="te"



'''@pytest.mark.asyncio
@pytest.mark.django_db(transaction=True)
class TestDemoWebsockets:
    async def test_demo_server(self,settings):
        settings.CHANNEL_LAYERS=TEST_CHANNEL_LAYERS
        communicator = WebsocketCommunicator(
                    application,
                    path='demo',

                )
        connected, subprotocol = await communicator.connect()
        assert connected
#        response = await communicator.receive_from()
        #assert response == 'test'
        #await communicator.disconnect()'''
