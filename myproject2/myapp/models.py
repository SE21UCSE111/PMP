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

class Team(models.Model):
    members = models.ManyToManyField(CustomUser, related_name='teams')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='teams_set')
    grade = models.CharField(max_length=2, choices=[('A', 'A'), ('B', 'B'), ('C', 'C'), ('D', 'D'), ('F', 'F')], blank=True, null=True)

    def __str__(self):
        return f'Team of {len(self.members.all())} members'
