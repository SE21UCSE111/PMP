from django.urls import path
from django.views.generic import TemplateView
from django.views.static import serve
from django.conf import settings
from django.conf.urls.static import static
from .views import (
    sign_up_and_login,
    home,
    professor_home_view,
    student_home_view,
    react_app,
    student_data,
    logout_view,
    professor_data,
)

urlpatterns = [
    path('', sign_up_and_login, name='signup_login'),
    path('home/', home, name='home'),
    # Serve React index.html for Professor and Student
    path('professor_home/', serve, {'path': 'profesor/build/index.html', 'document_root': settings.BASE_DIR / 'static'}, name='prof_home'),
    path('student_home/', serve, {'path': 'student/build/index.html', 'document_root': settings.BASE_DIR / 'static'}, name='stud_home'),
    # Redirect based on user role
    path('react_app/', react_app, name='react_app'),
    # API endpoint for student data
    path('api/student_data/', student_data, name='student_data'),
    path('api/professor_data/', professor_data, name='professor_data'),
    # Logout functionality
    path('logout/', logout_view, name='logout'),
]
