from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import root_view, health_check, MonitorViewSet

router = DefaultRouter()
router.register(r'monitors', MonitorViewSet, basename='monitor')

urlpatterns = [
    path('', root_view, name='api-root'),
    path('health/', health_check, name='api-health'),
    path('', include(router.urls)),
]
