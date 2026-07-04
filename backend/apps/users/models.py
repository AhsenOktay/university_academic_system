import secrets
import string
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.contrib.auth.signals import user_logged_in
from django.db import models


class UserManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email adresi zorunludur.')
        email = self.normalize_email(email)
        extra_fields.pop('is_staff', None)
        extra_fields.pop('is_superuser', None)
        extra_fields.pop('must_change_password', None)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('user_type', 'superadmin')
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):

    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=50, blank=True, default='')
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255, db_column='password_hash')
    first_name = models.CharField(max_length=100, blank=True, default='')
    last_name = models.CharField(max_length=100, blank=True, default='')
    user_type = models.CharField(max_length=30, blank=True, default='academic')
    is_active = models.BooleanField(default=True)
    created_by = models.IntegerField(null=True, blank=True)
    updated_by = models.IntegerField(null=True, blank=True)
    create_date = models.DateTimeField(auto_now_add=True)
    update_date = models.DateTimeField(auto_now=True)
    profile_image_url = models.CharField(max_length=500, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    is_email_verified = models.BooleanField(default=False, null=True)
    email_verified_at = models.DateTimeField(null=True, blank=True)
    language_code = models.CharField(max_length=5, blank=True, null=True)
    gender = models.CharField(max_length=10, blank=True, null=True)
    title = models.CharField(max_length=100, blank=True, default='')
    faculty = models.CharField(max_length=200, blank=True, default='')
    department = models.CharField(max_length=200, blank=True, default='')

    @property
    def is_staff(self):
        return self.user_type in ('superadmin', 'admin')

    @is_staff.setter
    def is_staff(self, value):
        pass

    @property
    def is_superuser(self):
        return self.user_type == 'superadmin'

    @is_superuser.setter
    def is_superuser(self, value):
        pass

    @property
    def last_login(self):
        return None

    @last_login.setter
    def last_login(self, value):
        pass

    @property
    def must_change_password(self):
        return False

    @must_change_password.setter
    def must_change_password(self, value):
        pass

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        db_table = 'users'
        managed = False
        verbose_name = 'Kullanıcı'
        verbose_name_plural = 'Kullanıcılar'

    def __str__(self):
        return f"{self.first_name} {self.last_name} <{self.email}>"

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    def get_short_name(self):
        return self.first_name

    def has_perm(self, perm, obj=None):
        return self.user_type == 'superadmin'

    def has_module_perms(self, app_label):
        return self.user_type == 'superadmin'

    def save(self, *args, **kwargs):
        from django.db import connection
        update_fields = kwargs.get('update_fields')
        if update_fields is not None and 'last_login' in update_fields:
            return
        if self.pk:
           
            with connection.cursor() as cursor:
                cursor.execute("SELECT password_hash FROM public.users WHERE id = %s", [self.pk])
                row = cursor.fetchone()
                current_hash = row[0] if row else None
                new_hash = self.password if self.password != current_hash else current_hash
                cursor.execute("""
                    UPDATE public.users SET
                        email = %s,
                        first_name = %s,
                        last_name = %s,
                        user_type = %s,
                        is_active = %s,
                        profile_image_url = %s,
                        title = %s,
                        faculty = %s,
                        department = %s,
                        password_hash = %s,
                        update_date = NOW(),
                        updated_by = (SELECT user_id FROM public.user_schemas WHERE schema_name = current_user)
                    WHERE id = %s
                """, [
                    self.email,
                    self.first_name,
                    self.last_name,
                    self.user_type,
                    self.is_active,
                    self.profile_image_url,
                    self.title,
                    self.faculty,
                    self.department,
                    new_hash,
                    self.pk,
                ])
        
        else:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO public.users (
                        username, email, password_hash, first_name, last_name,
                        user_type, is_active, create_date, update_date, created_by
                    ) VALUES (
                        %s, %s, %s, %s, %s, %s, %s, NOW(), NOW(),
                        (SELECT user_id FROM public.user_schemas WHERE schema_name = current_user)
                    ) RETURNING id
                """, [
                    self.username or self.email,
                    self.email,
                    self.password,
                    self.first_name,
                    self.last_name,
                    self.user_type,
                    self.is_active,
                ])
                self.pk = cursor.fetchone()[0]

    @property
    def role(self):
        return self.user_type

    @staticmethod
    def generate_temp_password(length=12):
        alphabet = string.ascii_letters + string.digits
        return ''.join(secrets.choice(alphabet) for _ in range(length))



from django.contrib.auth.models import update_last_login
user_logged_in.disconnect(update_last_login)