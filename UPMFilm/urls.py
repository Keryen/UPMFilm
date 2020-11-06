from django.urls import path
from . import views

urlpatterns = [
    path('', views.do_login, name='index'),
    path('login', views.do_login, name='login'),
    path('logout', views.do_logout, name='logout'),
    path('dashboard', views.dashboard, name='dashboard'),
    path('film/<str:film_name>/', views.get_film, name='get_film'),
    path('video/<str:film_name>/', views.get_video, name='get_video'),
    path('delete_film', views.delete_film, name='delete_film'),
    path('delete_user', views.delete_user, name='delete_user'),
    path('post_film', views.post_film, name='post_film'),
    path('post_user', views.post_user, name='post_user'),
    ]
