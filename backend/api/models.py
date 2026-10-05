from django.db import models
from django.core.validators import MinValueValidator

class Monitor(models.Model):
    HTTP_METHOD_CHOICES = [
        ('GET', 'GET'),
        ('POST', 'POST'),
        ('PUT', 'PUT'),
        ('PATCH', 'PATCH'),
        ('DELETE', 'DELETE'),
        ('HEAD', 'HEAD'),
        ('OPTIONS', 'OPTIONS'),
    ]

    name = models.CharField(max_length=255, help_text="Human-readable monitor name")
    url = models.URLField(max_length=2048, help_text="Target URL to probe")
    method = models.CharField(
        max_length=10,
        choices=HTTP_METHOD_CHOICES,
        default='GET',
        help_text="HTTP request method"
    )
    interval = models.PositiveIntegerField(
        default=60,
        validators=[MinValueValidator(10)],
        help_text="Check cadence in seconds (minimum 10s)"
    )
    timeout = models.PositiveIntegerField(
        default=30,
        validators=[MinValueValidator(1)],
        help_text="Request timeout in seconds (minimum 1s)"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether monitor polling is active"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Monitor'
        verbose_name_plural = 'Monitors'

    def __str__(self):
        return f"{self.name} ({self.method} {self.url})"
