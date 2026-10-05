from rest_framework import status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Monitor
from .serializers import MonitorSerializer


@api_view(['GET'])
def root_view(request):
    """
    Root API endpoint.
    GET /api/
    """
    return Response({
        "message": "Distributed API Monitor API"
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def health_check(request):
    """
    Health check endpoint for backend status monitoring.
    GET /api/health/
    """
    return Response({
        "status": "ok",
        "message": "API Monitor backend is running"
    }, status=status.HTTP_200_OK)


class MonitorViewSet(viewsets.ModelViewSet):
    """
    CRUD API for Monitor records.
    GET    /api/monitors/     -> List all monitors
    POST   /api/monitors/     -> Create monitor
    GET    /api/monitors/:id/ -> Retrieve monitor
    PUT    /api/monitors/:id/ -> Full update
    PATCH  /api/monitors/:id/ -> Partial update
    DELETE /api/monitors/:id/ -> Delete monitor
    """
    queryset = Monitor.objects.all().order_by('-created_at')
    serializer_class = MonitorSerializer
