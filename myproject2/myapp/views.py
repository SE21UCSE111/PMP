from django.contrib.auth import login, authenticate, logout
from django.shortcuts import redirect
from .forms import CustomUserCreationForm
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import CustomUser, Project
from rest_framework.permissions import IsAuthenticated
from .forms import CustomUserCreationForm
from django.views.decorators.csrf import csrf_exempt

@api_view(['POST'])
def sign_up_and_login(request):
    if 'signup' in request.POST:
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            return Response({'message': 'Sign up successful! You can now log in.'}, status=201)
        else:
            return Response({'errors': form.errors}, status=400)

    elif 'login' in request.POST:
        username = request.POST.get('username')
        password = request.POST.get('password')
        print(f"Login attempt - Username: {username}, Password: {password}")

        user = authenticate(request, username=username, password=password)
        if user:
            print(f"Authenticated user: {user.username}")
            login(request, user)
            return Response({'message': 'Login successful!', 'role': user.role}, status=200)
        else:
            print("Authentication failed.")
            return Response({'errors': 'Invalid username or password.'}, status=400)

# In your Django views.py

from django.http import JsonResponse, HttpResponse
from django.views import View
from .models import CustomUser
import json

def list_professors(request):
    try:
        professors = CustomUser.objects.filter(role='professor')
        usernames = [professor.username for professor in professors]
        return JsonResponse({'status': 'success', 'professors': usernames})
    except CustomUser.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'No professors found.'})

class ProfessorUpdateView(View):
    def get(self, request):
        response = HttpResponse(content_type="text/event-stream")
        response['Cache-Control'] = 'no-cache'
        response['Connection'] = 'keep-alive'
        
        # Listen for changes to the professor list
        professors = CustomUser.objects.filter(role='professor')
        usernames = [professor.username for professor in professors]
        response.write(f"data: {json.dumps(usernames)}\n\n")
        
        return response

from .forms import ProjectCreationForm
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import authentication_classes
from .authentication import CsrfExemptSessionAuthentication
from django.views.decorators.csrf import csrf_exempt

@api_view(['POST'])
def create_project(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            try:
                # Access the form data
                name = request.data.get('name')
                description = request.data.get('description')

                # Validate and create the project
                form = ProjectCreationForm({'name': name, 'description': description})
                if form.is_valid():
                    project = form.save(commit=False)
                    project.created_by = request.user  # request.user should be a CustomUser instance
                    project.save()
                    return Response({'success': True, 'project_id': project.id}, status=status.HTTP_201_CREATED)
                else:
                    errors = {field: form.errors.get(field, []) for field in form.errors}
                    return Response({'success': False, 'errors': errors}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({'success': False, 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'success': False, 'error': 'User not authenticated.'}, status=status.HTTP_403_FORBIDDEN)

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import redirect
from django.contrib.auth import logout

def logout_view(request):
    if request.method == 'POST':
        logout(request)  # Logs out the user
        return JsonResponse({'message': 'Logout successful'}, status=200)
    
from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import Project

@login_required
def professor_projects(request):
    # Ensure the user is authenticated
    if not request.user.is_authenticated:
        return JsonResponse({"error": "User not authenticated"}, status=403)

    projects = Project.objects.filter(created_by=request.user)
    response_data = []
    
    for project in projects:
        teams = project.teams.all().values()  # Assuming a related name like 'teams' in the Project model
        project_data = {
            "id": project.id,
            "name": project.name,
            "description": project.description,
            "teams": list(teams)
        }
        response_data.append(project_data)
    
    return JsonResponse(response_data, safe=False)


from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

from .models import Project, CustomUser  # Import CustomUser if it's in a different module

def view_projects(request, username):
    professor = get_object_or_404(CustomUser, username=username)  # Get professor by username
    projects = Project.objects.filter(created_by=professor).values()  # Get projects by professor
    return JsonResponse({"status": "success", "projects": list(projects)}, safe=False)


from django.http import JsonResponse
from .models import Project, Team, CustomUser
from django.views.decorators.csrf import csrf_exempt

def create_team(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            try:
                csrf_token = request.POST.get('csrfmiddlewaretoken')  # Get the CSRF token
                project_id = request.POST.get('project_id')
                member_names = [request.POST.get(f'member{i+1}') for i in range(4)]
                member_names = [name for name in member_names if name]  # Remove empty fields

                project = Project.objects.get(id=project_id)

                # Check if the current user is already part of a team for this project
                current_user = request.user
                existing_team = Team.objects.filter(project=project, members=current_user).exists()
                if existing_team:
                    return JsonResponse({'success': False, 'message': 'You are already a member of a team for this project'}, status=400)

                # Add team members
                team = Team.objects.create(project=project)
                for name in member_names:
                    user = CustomUser.objects.filter(username=name).first()
                    if user:
                        team.members.add(user)

                return JsonResponse({'success': True, 'message': 'Team created successfully'})
            except Exception as e:
                return JsonResponse({'success': False, 'message': str(e)}, status=400)
        else:
            return JsonResponse({'success': False, 'message': 'Authentication required'}, status=401)
    return JsonResponse({'success': False, 'message': 'Invalid request method'}, status=405)



from django.http import JsonResponse
from .models import CustomUser
from django.views.decorators.http import require_GET

@require_GET
def validate_student(request):
    username = request.GET.get("username", "")
    exists = CustomUser.objects.filter(username=username, role="student").exists()
    return JsonResponse({"exists": exists})

