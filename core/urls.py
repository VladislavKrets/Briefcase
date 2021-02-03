from django.urls import path

from core import views

urlpatterns = [
    path('auth/', views.Auth.as_view()),
    path('upload_file/', views.FileUploadMixin.as_view()),
    path('deals/', views.DealMixin.as_view()),
    path('briefcase/', views.ResultDealMixin.as_view()),
    path('total_price/', views.TotalPrice.as_view()),
]