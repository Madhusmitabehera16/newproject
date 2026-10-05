from rest_framework import serializers
from .models import Monitor

class MonitorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Monitor
        fields = [
            'id',
            'name',
            'url',
            'method',
            'interval',
            'timeout',
            'is_active',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Monitor name must not be empty.")
        return value.strip()

    def validate_interval(self, value):
        if value < 10:
            raise serializers.ValidationError("Check interval must be at least 10 seconds.")
        return value

    def validate_timeout(self, value):
        if value < 1:
            raise serializers.ValidationError("Timeout must be at least 1 second.")
        return value

    def validate_method(self, value):
        normalized = value.upper()
        valid_methods = [choice[0] for choice in Monitor.HTTP_METHOD_CHOICES]
        if normalized not in valid_methods:
            raise serializers.ValidationError(
                f"Invalid HTTP method '{value}'. Supported methods: {', '.join(valid_methods)}."
            )
        return normalized

    def validate(self, attrs):
        # Additional cross-field validation
        interval = attrs.get('interval', self.instance.interval if self.instance else 60)
        timeout = attrs.get('timeout', self.instance.timeout if self.instance else 30)
        if timeout >= interval:
            raise serializers.ValidationError({
                "timeout": "Timeout must be less than the check interval."
            })
        return attrs
