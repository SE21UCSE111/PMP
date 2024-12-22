from django.urls import path
from django.views.generic import TemplateView
from django.views.static import serve
from django.conf import settings
from django.conf.urls.static import static
from .views import (
    sign_up_and_login,
    logout_view,
    list_professors,
    ProfessorUpdateView,
    create_project,
    professor_projects,
    view_projects,
    create_team,
    validate_student,get_student_projects, get_professor_teams, update_grade, decline_team, fetch_project_grades, get_todolist, manage_todolist, post_comment, get_comments
    )

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
    path('api/decline_team/', decline_team, name='decline_team'),
    path('api/project/<int:project_id>/grades/', fetch_project_grades, name='fetch_project_grades'),
    path('api/get_todolist/<int:team_id>/', get_todolist, name='get_todolist'),
    path('api/manage_todolist/', manage_todolist, name='manage_todolist'),
    path('get_comments/<int:team_id>/', get_comments, name='get_comments'),
    path('post_comment/', post_comment, name='post_comment'),
   # Logout functionality
    path('api/logout/', logout_view, name='logout'),
]
