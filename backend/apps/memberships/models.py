from django.db import models
from core.models import BaseModel
from apps.users.models import User

class Membership(BaseModel):
    class Type(models.TextChoices):
        ASSOCIATION = 'association', 'Dernek'
        JOURNAL = 'journal', 'Dergi'
        COMMITTEE = 'committee', 'Komite'
        BOARD = 'board', 'Yönetim Kurulu'
        OTHER = 'other', 'Diğer'

    organization = models.CharField(max_length=300)
    role = models.CharField(max_length=200, blank=True)
    membership_type = models.CharField(max_length=20, choices=Type.choices)
    start_year = models.IntegerField()
    end_year = models.IntegerField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    member = models.ForeignKey(User, on_delete=models.CASCADE, related_name='memberships')
    owner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='owned_memberships')

    class Meta:
        db_table = 'memberships'
        ordering = ['-start_year']
        verbose_name = 'Üyelik'
        verbose_name_plural = 'Üyelikler'

    def __str__(self):
        return f"{self.organization} - {self.member}"