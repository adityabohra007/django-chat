from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from django.http import HttpResponseRedirect, JsonResponse, Http404,HttpResponse
from django.contrib.auth import logout, get_user_model
from django.core.exceptions import PermissionDenied
from django.conf import settings
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic.base import TemplateView
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger


from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from rest_framework import generics
from rest_framework import mixins

from .serializers import *
from .models import Room, Message
from .utils import create_room
from .forms import *
import json
from django.contrib.auth.models import User
# import the logging library
import logging


import os


from django.views import generic
from django.views.decorators.http import require_POST

@require_POST
def upload( request ):

#     # The assumption here is that jQuery File Upload
#     # has been configured to send files one at a time.
#     # If multiple files can be uploaded simulatenously,
#     # 'file' may be a list of files.
     file = upload_receive( request )
     user = User.objects.get(id=request.POST['user_id'])
     room = Room.objects.get(id=request.POST['room_id'])
     print(user,"-",request.POST['room_id'])

     instance = Message(room=room , file = file , sender=user)
     instance.save()

     basename = os.path.basename( instance.file.path )

     file_dict = {
         'name' : basename,
         'size' : file.size,

         'url': settings.MEDIA_URL + basename,
         'thumbnailUrl': settings.MEDIA_URL + basename,

        #  'deleteUrl': reverse('jfu_delete', kwargs = { 'pk': instance.pk }),
        #  'deleteType': 'POST',
		 }
     return UploadResponse(request,file_dict)


# Get an instance of a logger
logger = logging.getLogger(__name__)

def import_base_template():
	try:
		return settings.CHATTER_BASE_TEMPLATE
	except AttributeError as e:
		try:
			if settings.CHATTER_DEBUG == True:
				logger.info("django_chatter.views: "
				"(Optional) settings.CHATTER_BASE_TEMPLATE not found. You can "
				"set it to point to your base template in your settings file.")
		except AttributeError as e:
			logger.info("django_chatter.views: "
			"(Optional) settings.CHATTER_BASE_TEMPLATE not found. You can "
			"set it to point to your base template in your settings file.")
			logger.info("django_chatter.views: to turn off this message, set "
			"your settings.CHATTER_DEBUG to False.")
		return 'django_chatter/base.html'


class IndexView(LoginRequiredMixin, View):


		def get(self, request, *args, **kwargs):
			rooms_list = Room.objects.filter(members=request.user).order_by('-date_modified')
			if rooms_list.exists():
				latest_room_uuid = rooms_list[0].id
				return HttpResponseRedirect(
					reverse('django_chatter:chatroom')
				)
			else:
				# create room with the user themselves
				user = get_user_model().objects.get(username=request.user)
				room_id = create_room([user])
				return HttpResponseRedirect(
					reverse('django_chatter:chatroom', args=[room_id])
				)




class AddMemberView(LoginRequiredMixin,View):
	form_class = UsersForm
	template_name = 'django_chatter/add_member.html'
	def get_context_data(self, **kwargs):
		context = super( Home, self ).get_context_data( **kwargs )
		context['accepted_mime_types'] = ['image/*']
		return context
	def get(self, request, *args, **kwargs):
		users = User.objects.all()
		room_id = kwargs['uuid']
		form = self.form_class(users=users)
		url = reverse('django_chatter:add_member', args=[room_id])
		return render(request, self.template_name, {'form': form,'url':url})

	def post(self, request, *args, **kwargs):
		users = User.objects.all()
		room_id = kwargs['uuid']
		form = self.form_class(users=users,data=request.POST)
		if form.is_valid():
			members = form.cleaned_data['users']
			room = Room.objects.get(pk=room_id)
			room.members.set( members)
			room.save()

			return HttpResponseRedirect(reverse('django_chatter:chatroom', args=[room_id]))
# This fetches a chatroom given the room ID if a user diretly wants to access the chat.
class ChatRoomView(LoginRequiredMixin, TemplateView):
	template_name = 'django_chatter/chat-window.html'

	# This gets executed whenever a room exists
	'''def get_context_data(self, **kwargs):
		context = super().get_context_data(**kwargs)
		uuid = kwargs.get('uuid')
		try:
			room = Room.objects.get(id=uuid)
			user=get_user_model().objects.get(username=self.request.user)
		except Exception as e:
			logger.exception("\n\nException in django_chatter.views.ChatRoomView:\n")
			raise Http404("Sorry! What you're looking for isn't here.")
		all_members = room.members.all()
		if user in all_members:
			latest_messages_curr_room = room.message_set.filter()[:50]
			if latest_messages_curr_room.exists():
				message = latest_messages_curr_room[0]
				message.recipients.add(user)
			if all_members.count() == 1:
				room_name = "Notes to Yourself"
			else:
				room_name = room.name
			#context['room_uuid_json'] = kwargs.get('uuid')
			context['latest_messages_curr_room'] = list(latest_messages_curr_room)
			#context['room_name'] = room_name
			context['room'] = room
			context['base_template'] = import_base_template()
			#context['room_report'] = ReportChat.objects.get(chat_room=room)

			# Add rooms with unread messages
			rooms_list = Room.objects.filter(members=self.request.user)\
				.order_by('-date_modified')[:10]
			rooms_with_unread = []
			# Go through each list of rooms and check if the last message was unread
			# and add each last message to the context
			for room in rooms_list:
				try:
					message = room.message_set.all().order_by('-id')[0]
				except IndexError as e:
					continue
				if self.request.user not in message.recipients.all():
					rooms_with_unread.append(room.id)
			context['rooms_list'] = rooms_list
			context['rooms_with_unread'] = rooms_with_unread

			return context
		else:
			raise Http404("Sorry! What you're looking for isn't here.")'''


#The following functions deal with AJAX requests
@login_required
def users_list(request):
	if (request.is_ajax()):
		data_array = []
		for user in get_user_model().objects.all():
			data_dict = {}
			data_dict['id'] = user.pk
			data_dict['text'] = user.username
			data_array.append(data_dict)
		return JsonResponse(data_array, safe=False)


@login_required
def get_chat_url(request):
	user = get_user_model().objects.get(username=request.user)
	target_user = get_user_model().objects.get(pk=request.POST.get('target_user'))

	'''
	AI-------------------------------------------------------------------
		Use the util room creation function to create room for one/two
		user(s). This can be extended in the future to add multiple users
		in a group chat.
	-------------------------------------------------------------------AI
	'''
	if (user == target_user):
		room_id = create_room([user])
	else:
		room_id = create_room([user, target_user])
	return HttpResponseRedirect(
		reverse('django_chatter:chatroom', args=[room_id])
	)

# Ajax request to fetch earlier messages
@login_required
def get_messages(request, uuid):
	if request.is_ajax():
		room = Room.objects.get(id=uuid)
		if request.user in room.members.all():
			messages = room.message_set.all()
			page = request.GET.get('page')

			paginator = Paginator(messages, 20)
			try:
				selected = paginator.page(page)
			except PageNotAnInteger:
				selected = paginator.page(1)
			except EmptyPage:
				selected = []
			messages_array = []
			for message in selected:
				dict = {}
				dict['sender'] = message.sender.username
				dict['message'] = message.text
				dict['received_room_id'] = uuid
				dict['date_created'] = message.date_created.strftime("%d %b %Y %H:%M:%S %Z")
				messages_array.append(dict)

			return JsonResponse(messages_array, safe=False)

		else:
			return Http404("Sorry! We can't find what you're looking for.")
	else:
		return Http404("Sorry! We can't find what you're looking for.")



#Api
class RoomListView(generics.ListAPIView):
    def get_queryset(self):
        rooms=Room.objects.filter(members__id=self.kwargs['user_id'])
        print(rooms)
        return rooms
    serializer_class = RoomSerializer

class  RoomApiView(generics.CreateAPIView):
    serializer_class = RoomCreateSerializer

class  RoomMemberView(generics.ListAPIView):
    serializer_class= RoomMemberDetailSerializer

    def get_queryset(self):
        print("hell")
        member=Room.objects.get(id=self.kwargs['pk']).members.all()
        print("hell no")
        company=User.objects.get(id=self.request.user.id).usercompany.company
        print(company)
        query=User.objects.exclude(id__in=member).filter(usercompany__company=company)
        print(query)
        return query
    def get(self,*args,**kwargs):
        serializer=UserSerializer(self.get_queryset(),many=True)
        return Response(serializer.data)


class AddRoomMemberView(generics.CreateAPIView):
    serializer_class= RoomMemberDetailSerializer
    def post(self,*args,**kwargs):
        query=Room.objects.filter(id=self.kwargs['pk'])
        print(self.request.data['members'])
        members=self.request.data['members']

        for member in members:
            query.get().members.add(member)
        print(query)
        return Response(self.serializer_class(query,many=True).data)

class UserList(generics.ListAPIView):
    def get_queryset(self):
        queryset=User.objects.filter(usercompany__company=self.request.user.usercompany.company)
        return queryset
    serializer_class = CompanyMemebersSerializer

class UserDetails(generics.RetrieveAPIView):
    def get_queryset(self):
        query=User.objects.filter(id=self.kwargs['pk'])
        print(query)
        print("upper is in view ")
        return query

    serializer_class=UserSerializer


class ExistingRoomMember(generics.ListAPIView):
    serializer_class = RoomMemberDetailSerializer
    def get_queryset(self):
        query= Room.objects.filter(id=self.kwargs['pk'])
        return query




def index(request):
    return render(request,'base.html',{})



















