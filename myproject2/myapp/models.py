from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    role = models.CharField(max_length=50, blank=True, null=True)
    
    # Change related_name to avoid clashes
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_set',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_set',
        blank=True
    )

    def __str__(self):
        return self.username

class Project(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='projects')
    teams = models.ManyToManyField(
        'Team',
        related_name='projects',
        blank=True
    )

    def __str__(self):
        return self.name

from django.db import models

class Team(models.Model):
    members = models.ManyToManyField(CustomUser, related_name='teams')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='teams_set')
    grade = models.CharField(max_length=2, choices=[('A', 'A'), ('B', 'B'), ('C', 'C'), ('D', 'D'), ('F', 'F')], blank=True, null=True)
    status = models.CharField(
        max_length=10,
        choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('declined', 'Declined')],
        default='pending',
    )

    def __str__(self):
        return f'Team of {len(self.members.all())} members, Status: {self.status}'

    
from django.db import models
from django.contrib.auth.models import User

# In models.py

class Task(models.Model):
    description = models.CharField(max_length=255)
    team = models.ForeignKey('Team', related_name='tasks', on_delete=models.CASCADE)
    checked = models.BooleanField(default=False)  # New field for checked state
    
    def __str__(self):
        return self.description

from django.db import models
from .models import CustomUser  # Import the custom user model

class Comment(models.Model):
    team_id = models.IntegerField()
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # Use CustomUser instead of User
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.username} on team {self.team_id}"
