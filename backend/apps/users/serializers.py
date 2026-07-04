from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()
    must_change_password = serializers.SerializerMethodField()
    title = serializers.SerializerMethodField()
    faculty = serializers.SerializerMethodField()
    department = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name',
            'user_type', 'role', 'title', 'faculty', 'department',
            'must_change_password', 'is_active', 'is_staff', 'is_superuser',
            'profile_image_url',
        ]
        read_only_fields = ['id', 'email']

    def get_full_name(self, obj): return obj.get_full_name()
    def get_role(self, obj): return obj.user_type
    def get_must_change_password(self, obj): return getattr(obj, 'must_change_password', False)
    def get_title(self, obj): return getattr(obj, 'title', '')
    def get_faculty(self, obj): return getattr(obj, 'faculty', '')
    def get_department(self, obj): return getattr(obj, 'department', '')

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)
    new_password_confirm = serializers.CharField(required=True)

    def validate(self, data):
        if data['new_password'] != data['new_password_confirm']:
            raise serializers.ValidationError('Yeni şifreler eşleşmiyor.')
        return data

class BASTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        data['must_change_password'] = getattr(self.user, 'must_change_password', False)
        return data