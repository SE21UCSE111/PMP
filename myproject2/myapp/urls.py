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
    view_projects
    )

urlpatterns = [
    path('api/sign_up_and_login/', sign_up_and_login, name='signup_login'),
    path('api/list-professors/', list_professors, name='list-professors'),
    path('api/professor-updates/', ProfessorUpdateView.as_view(), name='professor-updates'),
    path('api/create_project/', create_project, name='create_project'),
    path('api/professor-projects/', professor_projects, name='professor-projects'),
    path('api/view-projects/<str:username>/', view_projects, name='view_projects'),

   # Logout functionality
    path('api/logout/', logout_view, name='logout'),
]
