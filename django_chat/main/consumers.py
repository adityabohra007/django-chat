'''AI--------------------------------------------------------------------------
    Django Imports
--------------------------------------------------------------------------AI'''
from django.contrib.auth import get_user_model
from django.db import connection


'''AI--------------------------------------------------------------------------
    Third-party Imports
--------------------------------------------------------------------------AI'''
from channels.generic.websocket import AsyncJsonWebsocketConsumer,JsonWebsocketConsumer
from channels.db import database_sync_to_async
import bleach


'''AI--------------------------------------------------------------------------
    App Imports
--------------------------------------------------------------------------AI'''
from .models import Room, Message,Client
from .serializers_chat import ChatMemberSerializer
from django.contrib.auth.models import User

'''AI--------------------------------------------------------------------------
    Python Imports
--------------------------------------------------------------------------AI'''
import json
from uuid import UUID
from datetime import datetime

'''
AI-------------------------------------------------------------------
    Database Access methods below
-------------------------------------------------------------------AI
'''

import base64
import os
@database_sync_to_async
def get_room(room_id, multitenant=False, schema_name=None):
    if multitenant:
        if not schema_name:
            raise AttributeError("Multitenancy support error: \
                scope does not have multitenancy details added. \
                did you forget to add ChatterMTMiddlewareStack to your routing?")
        else:
            from django_tenants.utils import schema_context
            with schema_context(schema_name):
                return Room.objects.get(id=room_id)
    else:
        return Room.objects.get(id=room_id)


'''
AI-------------------------------------------------------------------
    1. Select the Room
    2. Select the user who sent the message
    3. Select the message to be saved
    4. Save message
    5. Set room update time to message date_modified
-------------------------------------------------------------------AI
'''
@database_sync_to_async
def save_message(room, sender, text, multitenant=False, schema_name=None):
    print("saving message")
    if multitenant:
        if not schema_name:
            raise AttributeError("Multitenancy support error: \
                scope does not have multitenancy details added. \
                did you forget to add ChatterMTMiddlewareStack to your routing?")
        else:
            from django_tenants.utils import schema_context
            with schema_context(schema_name):
                new_message = Message(room=room, sender=sender, text=text)
                new_message.save()
                new_message.recipients.add(sender)
                new_message.save()
                room.date_modified = new_message.date_modified
                room.save()
                return new_message.date_created
    else:
        new_message = Message(room=room, sender=sender, text=text)
        new_message.save()
        new_message.recipients.add(sender)
        new_message.save()
        room.date_modified = new_message.date_modified
        room.save()
        return new_message.date_created

@database_sync_to_async
def save_client(user):
    if Client.objects.filter(user=user).exists():
        print("already in client")
    else:
        try:
            create_client = Client(user=user)
            print("in save client")
            print(create_client)
            create_client.save()
        except:
            print("what the hell")
@database_sync_to_async
def remove_client(user):
    try:
        query=Client.objects.filter(user=user)
        print(query)
        if query.exists():
            print("exist")
            deleted=query.delete()
            print("deleted",deleted)
        else:
            print("doesnot exist")

    except:
        print("remove_client_error")
def get_user_list(roomid):
    pass




class DemoConsumer(AsyncJsonWebsocketConsumer):

    async def connect(self):
        await self.accept()
        await self.channel_layer.send(self.channel_name,{"message":"yo"})

    async def disconnect(self):
        await self.close()








class StatusConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        try:
#            self.room_id = self.scope['url_route']['kwargs']['room_uuid']
            print("Added")
            self.user = self.scope['user']
            self.company_id=self.user.usercompany.company.id
            print(self.company_id)
            self.room_group = "users_"+str(self.company_id)
            print(self.room_group)

#            if self.room_id and
            if self.room_group:
                await self.channel_layer.group_add(self.room_group, self.channel_name)
                await self.accept()
                await save_client(self.user)
            else:
                await self.close()
        except:
            print("error")

    async def receive_json(self,data):
        print(data)
        if data['type']=="test":
            print("fetch")
            await self.channel_layer.send(self.channel_name,{'type':"send.websocket",'message':'tested'})
        if data['type']=="fetch.status":
            self.room__id=data['room_id']
            print(self.room__id)
            await self.members_status()


    async def members_status(self):

                data  = {"type":"send.websocket",
                         'message':'users',
                         'all_members':await self.all_method(),
                         'live_members':await self.live_method()}
                print(data)
                await self.channel_layer.send(self.channel_name,data)



    async def live_method(self):
        serializer=ChatMemberSerializer(User.objects.filter(room__id=self.room__id).exclude(client__id=None),many=True).data
        return json.loads(json.dumps(serializer))

    async def all_method(self):
        serializer=ChatMemberSerializer(User.objects.filter(room__id=self.room__id),many=True).data
        return json.loads(json.dumps(serializer))


    async def disconnect(self,close_code):
        print("disconnect")
        await self.channel_layer.group_discard(
            self.room_group,
            self.channel_name
        )
        await remove_client(self.user)

    async def send_websocket(self, event):
        print("send",event)
        await self.send_json(event)






class ChatConsumer(AsyncJsonWebsocketConsumer):

    '''
    AI-------------------------------------------------------------------
        WebSocket methods below
    -------------------------------------------------------------------AI
    '''
    async def connect(self):
        print(self.scope)
        self.user = self.scope['user']
        self.moreAvailable=True
        self.last_fetch=0
        self.room_username_list = [] # Cache room usernames to send alerts

        self.schema_name = self.scope.get('schema_name', None)
        self.multitenant = self.scope.get('multitenant', False)
        #self.room_id=self.scope['kwargs']['url']['room_uuid']
        room_id = self.scope['url_route']['kwargs']['room_uuid']

#        room_id=""
#        for param in self.scope['path'].split('/'):
#            try:
#                room_id = UUID(param, version=4)
#                break
#            except ValueError:
#                pass

        # Check if the user connecting to the room's websocket belongs in the room
        try:
            self.room = await get_room(room_id, self.multitenant, self.schema_name)
            if self.multitenant:
                from django_tenants.utils import schema_context
                with schema_context(self.schema_name):
                    if self.user in self.room.members.all():
                        self.room_group_name = 'chat_%s' % self.room.id
                        await self.channel_layer.group_add(
                            self.room_group_name,
                            self.channel_name
                        )
                        await self.accept()
                        await print("accepted")
                        #await save_client(self.user)

                        for user in self.room.members.all():
                            self.room_username_list.append(user.username)
                    else:
                        await self.disconnect(403)
            else:
                if self.user in self.room.members.all():
                    self.room_group_name = 'chat_%s' % self.room.id
                    await self.channel_layer.group_add(
                        self.room_group_name,
                        self.channel_name
                    )
                    await self.accept()
                    #await save_client(self.user)
                    for user in self.room.members.all():
                        self.room_username_list.append(user.username)
                else:
                    await self.disconnect(403)
        except Exception as ex:
            raise ex
            await self.disconnect(500)

    async def image_message(self,event):
        await self.send(event)
        print("sent",event)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        #await remove_client(self.user)


    async def fetch_messages(self,room_id,last_fetch,fetch_count):
        data=None
        if last_fetch:
            data =Room.objects.get(id=self.room.id).message_set.filter(id__lt=last_fetch).order_by('date_modified')
        else:
            data= Room.objects.get(id=self.room.id).message_set.filter().order_by('date_modified')
        if data.count()-fetch_count>=1:
            self.moreAvailable=True
        else:
            self.moreAvailable=False
        messages=data.values('id','text','date_created','sender', 'sender_id','sender__username','file')[:]
        newdic=[]
        temp_last_fetch=self.last_fetch
        for message in messages:
            if message['id']<temp_last_fetch or temp_last_fetch==0:
                temp_last_fetch=message['id']
            message['date_created']=message['date_created'].strftime('%m/%d/%Y %H:%M:%S %p')
            newdic.append(message)
        return newdic

    async def saveFile(self,result,filename):
        print("saveImage")
        message=Message(room=self.room,sender=self.user)
        from  django.core.files.images import File
        message.file.save(await self.FileName(filename),File(result),save=True)
        message.save()
        message.recipients.add(self.user)
        print(message)
        return message

    async def FileName(self,filename):
        import random
        import string
        from django.utils import timezone
        now=timezone.now()
        #name="IMG-"+now.strftime("%Y-%m-%d-%M-%s")+"-"+str(self.user.username)+".jpeg"
        filename=filename.split(".")
        name,ext="-".join(filename[:-1]),filename[-1]
        name="-".join([name,now.strftime("%Y-%m-%d-%M-%s")])
        filename=".".join([name,ext])

        print(filename)
        check=Message.objects.filter(file=filename)
        if check.exists():
            return FileName()
        return filename


    async def receive_json(self, data):
        message_type= data['message_type']
        if message_type=="document":
            pass


        if message_type=="file":
            print("what is up ----")
            from  django.core.files.temp import NamedTemporaryFile
            result=NamedTemporaryFile(delete=True)
            result.write(base64.b64decode(data['file']))
            result.flush()
            filename=data['filename']
            message =await self.saveFile(result,filename)
            time = message.date_created.strftime("%d %b %Y %H:%M:%S %Z")

            new_message={
                    'id' : message.id,
                    'type': 'send.websocket',
                    'message': 'new_message',
                    'text':message.text,
                    'date_created': time,
                    'sender__username': message.sender.username,
                    'file':message.file.name,
                    'sender':message.sender.id,
                }
            try:
                await self.channel_layer.group_send(self.room_group_name,new_message)#{"type":"send.websocket'})
            except:
                print("Not valid decode")

        if message_type=="fetch":
            room_id = data['room_id']
            self.last_fetch = data['last_fetch_id']
            fetch_count=data['fetchCount']
            messages=await self.fetch_messages(room_id,self.last_fetch,fetch_count);
            data  = {
                    "type":"send.websocket",
                    'message':'fetch_message',
                    'last_fetch':self.last_fetch,
                    'data_message':messages,
                    'moreAvailable':self.moreAvailable
                    };
            await self.channel_layer.send(self.channel_name,data)


        #Message Received
        if message_type == "text":
            print("got something ----- ",data,(data['sender'] != self.user.username),(data['room_id'] != str(self.room.id)))
            try:
                if (data['sender'] != self.user.username) or (data['room_id'] != str(self.room.id)):
                    await print("in sender check")
                    await self.disconnect(403)
            except:
                await print("first except")
            message_type = data['message_type']
            print(message_type)
            message = data['message']
            room_id = data['room_id']

            # Clean code off message if message contains code
            self.message_safe = bleach.clean(message)

            # try:
            #     # room = await self.get_room(room_id)
            #     room_group_name = 'chat_%s' % room_id
            # except Exception as ex:
            #     raise ex
            #     await self.disconnect(500)

            time = await save_message(self.room,
                                    self.user,
                                    self.message_safe,
                                    self.multitenant,
                                    self.schema_name
                                    )

            time = time.strftime("%d %b %Y %H:%M:%S %Z")

            try:
                data={
                    'type': 'send.websocket',
                    'message_type': 'new_message',
                    'text': self.message_safe,
                    'date_created': time,
                    'sender__username': self.user.username,
                    'send_id':self.user.id,
                    'room_id': room_id,
                }
                await self.channel_layer.group_send(self.room_group_name,data)
            except:
                await print("in 1")
            '''try:
                for username in self.room_username_list:
                    if username != self.user.username:
                        await self.channel_layer.group_send(
                        f'user_{username}',
                        {
                            'type': 'receive_json',
                            'message_type': 'text',
                            'message': self.message_safe,
                            'date_created': time,
                            'sender': self.user.username,
                            'room_id': room_id,
                        }
                    )
            except:
                print("what the hell")'''
            print("2 here---")




    async def send_websocket(self, event):
        #print("send",event)
        await self.send_json(event)

class AlertConsumer(AsyncJsonWebsocketConsumer):
    '''
    AI-------------------------------------------------------------------
        WebSocket methods below
    -------------------------------------------------------------------AI
    '''
    async def connect(self):
        self.user = self.scope['user']
        self.user_group_name = f'user_{self.user.username}'
        await self.channel_layer.group_add(
            self.user_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.user_group_name,
            self.channel_name
        )

    async def receive_json(self, text_data):
        await self.channel_layer.group_send(
                        self.user_group_name,
                        {
                            'type': 'alert_message',
                            'message_type': 'text',
                        }
        )

        await self.accept()





    async def alert_message(self, event):
        await self.send_json(event['data'])

