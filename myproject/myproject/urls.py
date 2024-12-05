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
from myapp.views import sign_up_and_login, home, react_app, student_data, logout_view, professor_data

urlpatterns = [
    path('', sign_up_and_login, name='signup_login'),
    path('home/', home, name='home'),
    # Serve React index.html for Professor and Student
    path('professor_home/', serve, {'path': 'professor/build/index.html', 'document_root': settings.BASE_DIR / 'static'}, name='prof_home'),
    path('student_home/', serve, {'path': 'student/build/index.html', 'document_root': settings.BASE_DIR / 'static'}, name='stud_home'),
    # Other routes for app functionality
    path('react_app/', react_app, name='react_app'),
    path('api/student_data/', student_data, name='student_data'),
    path('api/professor_data/', professor_data, name='professor_data'),
    path('logout/', logout_view, name='logout'),
]

