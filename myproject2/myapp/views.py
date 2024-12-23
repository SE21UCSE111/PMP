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

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import Project, Team, CustomUser

@login_required
def create_team(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            try:
                project_id = request.POST.get('project_id')
                member_names = [request.POST.get(f'member{i+1}') for i in range(4)]
                member_names = [name for name in member_names if name]  # Remove empty fields

                project = Project.objects.get(id=project_id)

                # Check if the current user is explicitly included in the list of team members
                current_user = request.user
                if current_user.username not in member_names:
                    return JsonResponse({'success': False, 'message': 'You must include your name in the team list.'}, status=400)

                # Check if the current user is already part of a team for this project
                existing_team = Team.objects.filter(project=project, members=current_user).exists()
                if existing_team:
                    return JsonResponse({'success': False, 'message': 'You are already a member of a team for this project'}, status=400)

                # Create the team and add the user creating the team
                team = Team.objects.create(project=project)
                team.members.add(current_user)  # Add the user creating the team to the team

                # Add other members
                for name in member_names:
                    user = CustomUser.objects.filter(username=name).first()
                    if user:
                        team.members.add(user)

                # Explicitly add the team to the project's teams relationship
                project.teams.add(team)

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

from django.http import JsonResponse
from .models import Project, CustomUser
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required

@login_required
def get_student_projects(request):
    if request.user.role == "student":
        # Fetch projects where the student is a member of a team
        student = request.user
        projects = Project.objects.filter(teams__members=student).distinct()
        print(f"Found {projects.count()} projects for {student.username}")
        
        # Serialize the project data, including the team ID
        projects_data = []
        for project in projects:
            # Find the team(s) associated with this student in the project
            teams = project.teams.filter(members=student)
            for team in teams:
                projects_data.append({
                    "id": project.id,
                    "name": project.name,
                    "description": project.description,
                    "team_id": team.id,  # Include the team ID
                })

        return JsonResponse({"projects": projects_data})
    return JsonResponse({"message": "You are not authorized to view this data"}, status=403)


from django.shortcuts import render
from django.http import JsonResponse
from .models import Project, Team
from django.contrib.auth.decorators import login_required

@login_required
def get_professor_teams(request):
    professor = request.user  # Get the logged-in user (professor)
    
    # Get all projects created by the professor that have at least one team
    projects = Project.objects.filter(created_by=professor).prefetch_related('teams')

    projects_data = []
    
    for project in projects:
        teams = project.teams.all()  # Get all teams associated with the project
        
        if teams.exists():  # Only include projects with teams
            teams_data = []
            for team in teams:
                members = [member.username for member in team.members.all()]
                teams_data.append({
                    'id': team.id,  # Include team_id in the response
                    'members': members,  # List of team members
                    'status': team.status,  # Add the team status to the response
                })
            
            projects_data.append({
                'project_name': project.name,
                'team_count': len(teams_data),  # Indicating how many teams are associated with the project
                'teams': teams_data,  # List of teams with members, ids, and status
            })
    
    return JsonResponse({"status": "success", "projects": projects_data}, safe=False)


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Team
import json

def update_grade(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)  # Parse the JSON data from the frontend
            grade = data.get("grade")  # Get the grade from the request

            # Ensure grade is valid
            if grade not in ["A", "B", "C", "D", "F"]:
                return JsonResponse({"status": "error", "message": "Invalid grade."}, status=400)

            # Find the team (you can use the team ID or other criteria)
            # Assuming you pass the team ID in the request for this example
            team_id = data.get("team_id")  # You may need to pass team ID from frontend
            team = Team.objects.get(id=team_id)

            # Update the team's grade
            team.grade = grade
            team.save()

            return JsonResponse({"status": "success", "message": "Grade updated successfully."})

        except json.JSONDecodeError:
            return JsonResponse({"status": "error", "message": "Invalid JSON data."}, status=400)
        except Team.DoesNotExist:
            return JsonResponse({"status": "error", "message": "Team not found."}, status=404)

    return JsonResponse({"status": "error", "message": "Invalid request method."}, status=405)

from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Team

@api_view(['POST'])
def decline_team(request):
    team_id = request.data.get('team_id')

    if not team_id:
        return Response({"status": "error", "message": "Team ID is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        team = Team.objects.get(id=team_id)
        team.status = 'declined'
        team.save()
        return Response({"status": "success", "message": "Team declined successfully."}, status=status.HTTP_200_OK)
    except Team.DoesNotExist:
        return Response({"status": "error", "message": "Team not found."}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
def accept_team(request):
    team_id = request.data.get('team_id')

    if not team_id:
        return Response({"status": "error", "message": "Team ID is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        team = Team.objects.get(id=team_id)
        team.status = 'accepted'
        team.save()
        return Response({"status": "success", "message": "Team accepted successfully."}, status=status.HTTP_200_OK)
    except Team.DoesNotExist:
        return Response({"status": "error", "message": "Team not found."}, status=status.HTTP_404_NOT_FOUND)


from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import Project

def fetch_project_grades(request, project_id):
    # Retrieve the project by ID
    project = get_object_or_404(Project, id=project_id)

    # Get all teams associated with this project
    teams = project.teams.all()

    # Prepare the response data
    grades_data = []
    for team in teams:
        grades_data.append({
            "grade": team.grade,  # Fetch the grade
        })

    return JsonResponse({
        "status": "success",
        "project_name": project.name,  # Include project name
        "grades": grades_data
    })

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET
from django.shortcuts import get_object_or_404
from .models import Team, Task
import json

def get_todolist(request, team_id):
    try:
        # Retrieve the team object
        team = get_object_or_404(Team, id=team_id)

        # Get tasks for the team including the checked state
        tasks = Task.objects.filter(team=team).values('id', 'description', 'checked')

        return JsonResponse({'tasks': list(tasks)}, status=200)

    except Exception as e:
        return JsonResponse({'message': str(e)}, status=400)
    
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
import json

def manage_todolist(request):
    try:
        if request.method == "POST":
            data = json.loads(request.body)
            team_id = data.get("team_id")
            tasks = data.get("tasks")

            # Retrieve the team object
            team = get_object_or_404(Team, id=team_id)

            for task_data in tasks:
                task_id = task_data.get("id")
                description = task_data.get("description")
                checked = task_data.get("checked", False)

                if task_id:  # Update existing task
                    task = get_object_or_404(Task, id=task_id, team=team)
                    task.description = description
                    task.checked = checked
                    task.save()
                else:  # Create new task
                    if description:  # Ensure non-empty description
                        Task.objects.create(description=description, team=team, checked=checked)

            return JsonResponse({"message": "To-Do List processed successfully."}, status=200)

        return JsonResponse({"message": "Invalid HTTP method."}, status=405)

    except Exception as e:
        return JsonResponse({"message": str(e)}, status=400)

from django.http import JsonResponse
from .models import Comment
from .models import CustomUser  # Ensure you're using the custom user model

def get_comments(request, team_id):
    comments = Comment.objects.filter(team_id=team_id).order_by('-created_at')
    
    comment_list = []
    for comment in comments:
        comment_list.append({
            'id': comment.id,
            'team_id': comment.team_id,
            'user': comment.user.username,  # This works with the CustomUser model
            'text': comment.text,
            'created_at': comment.created_at,
        })

    return JsonResponse({'comments': comment_list})
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

def post_comment(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)  # Parse the JSON data from the request body
            team_id = data.get('team_id')
            comment_text = data.get('comment')

            # Validation
            if not comment_text:
                return JsonResponse({'message': 'Comment cannot be empty.'}, status=400)
            
            if not team_id:
                return JsonResponse({'message': 'Team ID is required.'}, status=400)

            # Assuming the user is authenticated
            user = request.user
            if not user.is_authenticated:
                return JsonResponse({'message': 'User not authenticated.'}, status=401)

            # Create and save the comment
            comment = Comment.objects.create(team_id=team_id, user=user, text=comment_text)

            return JsonResponse({'message': 'Comment posted successfully.'}, status=201)
        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON format.'}, status=400)

