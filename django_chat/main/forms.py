from django.forms import ModelForm, Form
from django import forms
from django.contrib.auth.models import User
from .models import *
import datetime


class UsersForm(forms.Form):

    users = forms.MultipleChoiceField(widget=forms.CheckboxSelectMultiple,
                                      )

    def __init__(self, users, *args, **kwargs):
        super(UsersForm, self).__init__(*args, **kwargs)
        self.fields['users'].choices = [
            (choice.pk, choice) for choice in users]
