from django.test import TestCase,Client
import json
from collections import OrderedDict
from .models import Room,Message
from main.models import *
from .views import UserList
from django.urls import reverse
from .serializers import *
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.test import force_authenticate
from rest_framework.test import APIRequestFactory,APIClient
client=Client()
class RoomListTest(TestCase):

    def setUp(self):
        self.adi=User.objects.create_user(username="aditya",password="adityapassword")
        self.mohit=User.objects.create_user(username="mohit",password="mohitpassword")

        room=Room.objects.create(name="AdityaGroup")
        room.members.add(self.adi)
        room.members.add(self.mohit)

        room=Room.objects.create(name="BohraFamilyGroup")
        room.members.add(self.adi)
        room.members.add(self.mohit)
        self.valid_payload = {
                'name':"AdityaGroup",
                'members':[1,2],

                }
        self.invalid_payload={
                'name':"",
                'members':[1,2]
                }

    def test_get_room_list(self):
        user_id=self.adi.id
        response = client.get(reverse('django_chatter:room_list',args=(user_id,)))
        room_list = Room.objects.filter(members__id=self.adi.id)
        serializer = RoomSerializer(room_list,many=True)
        self.assertEqual(response.data,serializer.data)
        self.assertEqual(response.status_code,status.HTTP_200_OK)
    def test_valid_create_room(self):
        response=client.post(
                reverse("django_chatter:room_create"),
                data=json.dumps(self.valid_payload),
                content_type="application/json"

                )
        self.assertEqual(response.status_code,status.HTTP_201_CREATED)
    def test_invalid_create_room(self):
        response=client.post(
                reverse("django_chatter:room_create"),
                data=json.dumps(self.invalid_payload),
                content_type="application/json"

                )
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)



class UserTestCase(TestCase):
    def setUp(self):
        self.adi=User.objects.create_user(username="aditya",password="adityapassword")
        self.mohit=User.objects.create_user(username="mohit",password="mohitpassword")
        self.company = Company.objects.create(
                name="TestCompany",
                website="http://www.testcompany.com",
                contact_number="1111111111" ,
                contact_email="testemail@test.com",
                city="test",
                country="test",
                address="test"
                )
        self.usercompany=UserCompany.objects.create(user=self.adi,company=self.company)
        self.seconduc = UserCompany.objects.create(user=self.mohit,company=self.company)
        self.client=APIClient()
        self.client.login(username="aditya",password="adityapassword")


    def test_user_list(self):
        response=self.client.get(reverse('django_chatter:user_list'))
        user = User.objects.filter(usercompany__company=self.adi.usercompany.company)
        serializer=CompanyMemebersSerializer(user,many=True)
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(response.data,serializer.data)

#    def test_user_list_unauth(self):
#        client=Client()
#        response=client.get(reverse('django_chatter:user_list'))
#        user = User.objects.filter(usercompany__company=self.adi.usercompany.company)
#        serializer=CompanyMemebersSerializer(user,many=True)
#        self.assertEqual(response.status_code,400)
#        self.assertNotEqual(response.data,serializer.data)

    def test_user_detail(self):
        pk=self.adi.id
        client=APIClient()
        response =client.get(reverse('django_chatter:user_details',args=(pk,)))
        user=User.objects.filter(id=pk)
        serializer =UserSerializer(user,many=True)
        serializer =json.dumps(serializer.data)
        serializer=json.loads(serializer)
        self.assertEqual(response.data,serializer[0])
        self.assertEqual(response.status_code,status.HTTP_200_OK)


