# models.py
from django.db import models
from django.contrib.auth.models import User


class ProfessorEmail(models.Model):
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.email


class Project(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    prerequisites = models.TextField(blank=True, null=True)  # Prerequisites for the project
    max_teams = models.IntegerField(default=1)  # Maximum number of teams allowed for the project
    max_students_per_team = models.IntegerField(default=5)  # Maximum number of students in each team
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    professors = models.ManyToManyField(User, related_name='mentored_projects', blank=True)  # Professors mentoring this project

    def __str__(self):
        return self.name


class Profile(models.Model):
    DEPARTMENT_CHOICES = [
        ('CSE', 'Computer Science and Engineering'),
        ('ECE', 'Electronics and Communication Engineering'),
        ('PHY', 'Physics'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=[('professor', 'Professor'), ('student', 'Student')])
    department = models.CharField(max_length=3, choices=DEPARTMENT_CHOICES, blank=True, null=True)  # Department field
    projects = models.ManyToManyField(Project, related_name='profiles', blank=True)  # Link to projects

    def __str__(self):
        return f'{self.user.username} Profile'

class Team(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    students = models.ManyToManyField(User, related_name='teams', blank=True)
    
    def __str__(self):
        return f'{self.name} - {self.project.name}'
