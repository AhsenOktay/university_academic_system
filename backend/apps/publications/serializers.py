from rest_framework import serializers
from .models import Publication
from apps.users.serializers import UserSerializer


class PublicationSerializer(serializers.ModelSerializer):
    authors_detail = UserSerializer(source='authors', many=True, read_only=True)

    class Meta:
        model = Publication
        fields = '__all__'
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']
