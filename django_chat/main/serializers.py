from rest_framework import serializers
from .models import Room, Message, Client
from django.contrib.auth.models import User
#from main.models import UserCompany,Company


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id']


# class CompanySerializer(serializers.ModelSerializer):
#     class Meta:
#         model=Company
#         fields=["name","city","country"]

# class UserCompanySerializer(serializers.ModelSerializer):
#     company = CompanySerializer()
#     class Meta:
#         model =UserCompany
#         fields=['company']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'usercompany']


class MemberDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "usercompany"]


class RoomMemberDetailSerializer(serializers.ModelSerializer):
    members = MemberDetailsSerializer(many=True)

    class Meta:
        model = Room
        fields = ['id', 'name', 'members']


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'name', 'members']


class RoomCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'name', 'members']

    def create(self, validated_data):
        members = validated_data.pop('members')
        instance = Room.objects.create(**validated_data)
        for member in members:
            instance.members.add(member)
        return instance


class RoomMemberSerializer(serializers.ModelSerializer):
    members = MemberSerializer(many=True, read_only=True)

    class Meta:
        model = Room
        fields = ['id', 'name', 'members']


class RoomListSerializer(serializers.ModelSerializer):
    member = serializers.HyperlinkedRelatedField(
        many=True,
        read_only=True,
        view_name="user-detail"

    )

    class Meta:
        model = Room
        fields = ('id', 'name')


class UserRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields: '__all__'


class CompanyMemebersSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]


class NewMessageSerializer(serializers.Serializer):
    #id= serializers.IntegerField()
    requesttype = serializers.CharField()
    message_type = serializers.CharField()
    text = serializers.CharField()
    date_created = serializers.DateTimeField()
    sendername = serializers.CharField()
    senderid = serializers.IntegerField()
    roomid = serializers.CharField()
