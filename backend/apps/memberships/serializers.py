from rest_framework import serializers
from .models import Membership

class MembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membership
        fields = '__all__'
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']