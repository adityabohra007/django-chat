from django.urls import path

from . import consumers

websocket_urlpatterns = [
    path('demo', consumers.DemoConsumer),
    path('ws/django_chatter/chatrooms/chat/<str:room_uuid>/', consumers.ChatConsumer),
    path('ws/django_chatter/chatrooms/user/', consumers.StatusConsumer),
    path('ws/django_chatter/users/<str:username>/', consumers.AlertConsumer)
]
