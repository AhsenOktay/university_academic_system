from rest_framework import serializers
from .models import ResearchGroup


class ResearchGroupSerializer(serializers.ModelSerializer):
    members_count = serializers.SerializerMethodField()

    class Meta:
        model = ResearchGroup
        fields = '__all__'
        read_only_fields = ['id', 'slug', 'owner', 'created_at', 'updated_at']

    def get_members_count(self, obj):
        return obj.members.count()