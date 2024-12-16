from rest_framework import serializers
from .models import Project, CustomUser  # Ensure CustomUser is imported

class ProjectSerializer(serializers.ModelSerializer):
    created_by = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())

    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'created_by']
