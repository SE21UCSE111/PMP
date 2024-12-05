# admin.py
from django.contrib import admin
from .models import ProfessorEmail, Project, Profile, Team

admin.site.register(ProfessorEmail)
admin.site.register(Project)
admin.site.register(Profile)
admin.site.register(Team)
