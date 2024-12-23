from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser

class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)
    role = forms.ChoiceField(
        choices=[('student', 'Student'), ('professor', 'Professor')],
        required=True
    )

    class Meta:
        model = CustomUser
        fields = ['role', 'username', 'email', 'password1', 'password2']

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        user.role = self.cleaned_data['role']
        user.set_password(self.cleaned_data['password1'])  # Ensure hashing
        if commit:
            user.save()
        return user

from django import forms
from .models import Project

class ProjectCreationForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = ['name', 'description']
