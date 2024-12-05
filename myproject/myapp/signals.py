# signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Profile
from django.conf import settings  # Import settings

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        # Create the profile when a new user is created
        email = instance.email
        if email in settings.PROFESSOR_EMAILS:  # Use settings.PROFESSOR_EMAILS
            role = 'professor'
        else:
            role = 'student'
        Profile.objects.create(user=instance, role=role)


@receiver(post_save, sender=User)
def save_profile(sender, instance, **kwargs):
    instance.profile.save()
