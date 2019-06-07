from django.urls import path
from .views import MainView, search_title, get_body, get_df

urlpatterns = [
    path('', MainView.as_view(), name="home"),
    path('search_title/', search_title, name="search_title"),
    path('get_body/', get_body, name="get_body"),
    path('get_df/', get_df, name="get_df")
]
