from rest_framework import serializers
from .models import Patent


class PatentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patent
        fields = '__all__'
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']
