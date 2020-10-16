from django.urls import path
from . import views

# Defined namespace for use on all templates
app_name = 'django_chatter'

urlpatterns = [
	path('', views.IndexView.as_view(), name = "index"),
	path('chat', views.ChatRoomView.as_view(), name = "chatroom"),
#	path('chat/<str:uuid>/add/', views.AddMemberView.as_view(), name = "add_member"),

        path('mini',views.index),
        path('fullpage',views.fullpage,name = "fullpage"),
	#AJAX paths
	path('ajax/users-list/', views.users_list, name = "users_list"),
	path('ajax/get-chat-url/', views.get_chat_url, name = "get_chat_url"),
	path('ajax/get-messages/<str:uuid>/', views.get_messages, name="get_messages"),

        path('api/<int:user_id>/rooms',views.RoomListView.as_view(),name="room_list"),
        path('api/room/add',views.RoomApiView.as_view(),name="room_create"),
        path('api/room/<str:pk>/members',views.RoomMemberView.as_view(),name="room_member"),
        path('api/room/<str:pk>/members/add',views.AddRoomMemberView.as_view(),name="add_room_member"),


        path('api/company/users',views.UserList.as_view(),name="user_list"),
        path('api/user/<int:pk>/details',views.UserDetails.as_view(),name="user_details"),

        path('api/room/<str:pk>/existing/members',views.ExistingRoomMember.as_view(),name="existing_members"),

]
