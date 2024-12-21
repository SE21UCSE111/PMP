"""
URL configuration for myproject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from django.views.generic import TemplateView
from django.views.static import serve
from django.conf import settings
from django.conf.urls.static import static
from myapp.views import sign_up_and_login, logout_view, list_professors,ProfessorUpdateView, create_project,professor_projects, view_projects, create_team, validate_student,get_student_projects, get_professor_teams, update_grade
urlpatterns = [
    path('api/sign_up_and_login/', sign_up_and_login, name='signup_login'),
    path('api/list-professors/', list_professors, name='list-professors'),
    path('api/professor-updates/', ProfessorUpdateView.as_view(), name='professor-updates'),
    path('api/create_project/', create_project, name='create_project'),
    path('api/professor-projects/', professor_projects, name='professor-projects'),
    path('api/view-projects/<str:username>/', view_projects, name='view_projects'),
    path('api/create-team/', create_team, name='create_team'),
    path("api/validate-student/", validate_student, name="validate-student"),
    path('api/professor-projects/<int:project_id>/', professor_projects, name='professor-project-details'),  # For detailed project view
    path('api/student-projects/', get_student_projects, name='student-projects'),
    path('api/professor_teams/', get_professor_teams, name='get_professor_teams'),
    path('api/update_grade/', update_grade, name='update_grade'),

    path('api/logout/', logout_view, name='logout'),
]

