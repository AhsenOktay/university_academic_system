from rest_framework import serializers
from .models import Award


class AwardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Award
        fields = '__all__'
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']
