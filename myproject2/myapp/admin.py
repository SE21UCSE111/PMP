# admin.py
from django.contrib import admin
from .models import CustomUser, Project

admin.site.register(CustomUser)
admin.site.register(Project)
