from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, authenticate, logout
from django.shortcuts import render, redirect
from .forms import CustomUserCreationForm
from .models import Profile
from django.conf import settings  # Import settings
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response

PROFESSOR_EMAILS = settings.PROFESSOR_EMAILS  # Access the list from settings

def react_app(request):
    # Ensure the user is logged in before accessing the React app
    if not request.user.is_authenticated:
        return redirect('signup_login')  # Redirect to the login page if not authenticated
    
    # Redirect user to the React app based on their role
    profile = getattr(request.user, 'profile', None)
    
    if profile is None:  # If profile doesn't exist, create one
        email = request.user.email
        role = 'professor' if email in settings.PROFESSOR_EMAILS else 'student'
        profile = Profile.objects.create(user=request.user, role=role)
    
    # Redirect based on the role
    if profile.role == 'professor':
        return redirect('prof_home')  # Redirect to professor dashboard (React page)
    else:
        return redirect('stud_home')  # Redirect to student dashboard (React page)


# Sign-up and Login logic
def sign_up_and_login(request):
    signup_form = CustomUserCreationForm()  # Initialize the signup form
    login_form = AuthenticationForm()  # Initialize the login form

    if request.method == 'POST':
        if 'signup' in request.POST:  # If the user is signing up
            form = CustomUserCreationForm(request.POST)
            if form.is_valid():
                user = form.save()  # Save the user without logging them in
                # Check if the profile already exists
                if not hasattr(user, 'profile'):
                    email = user.email
                    role = 'professor' if email in settings.PROFESSOR_EMAILS else 'student'
                    Profile.objects.create(user=user, role=role)  # Create the profile if it doesn't exist
                return redirect('signup_login')  # Redirect to the login page after successful sign-up
            else:
                print(form.errors)  # Debugging output
        elif 'login' in request.POST:  # If the user is logging in
            form = AuthenticationForm(request, data=request.POST)
            if form.is_valid():
                user = form.get_user()
                login(request, user)  # Log in the user manually
                return redirect('home')  # Redirect to home after successful login
            else:
                print("Login failed:", form.errors)

    else:
        signup_form = CustomUserCreationForm()
        login_form = AuthenticationForm()

    return render(request, 'registration/signup_login.html', {
        'signup_form': signup_form,
        'login_form': login_form
    })

# Home view
def home(request):
    # Ensure the user is authenticated
    if not request.user.is_authenticated:
        return redirect('signup_login')  # Redirect to login if not authenticated

    try:
        profile = request.user.profile  # Try to access the user's profile
    except Profile.DoesNotExist:  # If the profile does not exist
        # Dynamically determine the role based on the user's email or other information
        email = request.user.email

        # Set role based on email
        if email in settings.PROFESSOR_EMAILS:
            role = 'professor'
        else:
            role = 'student'

        # Create the Profile for the user with the determined role
        profile = Profile.objects.create(user=request.user, role=role)

    # Redirect to the react_app view, which will then route based on the role
    return redirect('react_app')  # This will trigger the react_app view

# Professor home view
def professor_home_view(request):
    return redirect('http://localhost:3001/')  # Redirecting to React Home Page

# Student home view (redirecting to React frontend)
def student_home_view(request):
    return redirect('http://localhost:3000/')  # Redirecting to React Home Page

# API to get user data (username, email, etc.)
@api_view(['GET'])
def student_data(request):
    user = request.user
    if user.profile.role == 'student':  # Ensure the user is a student
        data = {
            'username': user.username,
            'email': user.email,
            # Add any other fields you want
        }
        return Response(data)
    return Response({'error': 'Not a student'}, status=403)

@api_view(['GET'])
def professor_data(request):
    user = request.user
    if user.profile.role == 'professor':  # Ensure the user is a professor
        data = {
            'username': user.username,
            'email': user.email,
            # Add any additional fields relevant to professors
        }
        return Response(data)
    return Response({'error': 'Not a professor'}, status=403)

# Logout view
def logout_view(request):
    logout(request)  # Log out the user
    return redirect('signup_login')  # Redirect to the login page after logging out
