from rest_framework import serializers
from .models import Thesis


class ThesisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thesis
        fields = '__all__'
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']
