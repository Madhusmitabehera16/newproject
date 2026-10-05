from django.contrib import admin
from .models import Monitor

@admin.register(Monitor)
class MonitorAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'method',
        'url',
        'interval',
        'timeout',
        'is_active',
        'created_at',
    )
    list_filter = ('is_active', 'method', 'created_at')
    search_fields = ('name', 'url')
    ordering = ('-created_at',)
