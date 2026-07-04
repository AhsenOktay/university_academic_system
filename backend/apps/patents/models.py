from django.db import models
from core.models import BaseModel
from apps.users.models import User


class Patent(BaseModel):

    class Status(models.TextChoices):
        APPLIED = 'applied', 'Başvuru Yapıldı'
        PENDING = 'pending', 'İncelemede'
        GRANTED = 'granted', 'Onaylandı'
        REJECTED = 'rejected', 'Reddedildi'

    title = models.CharField(max_length=500)
    patent_no = models.CharField(max_length=100, blank=True)
    inventors = models.ManyToManyField(
        User, related_name='patents', blank=True
    )
    application_date = models.DateField()
    grant_date = models.DateField(null=True, blank=True)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.APPLIED
    )
    description = models.TextField(blank=True)
    owner = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True,
        related_name='owned_patents'
    )

    class Meta:
        db_table = 'patents'
        ordering = ['-application_date']
        verbose_name = 'Patent'
        verbose_name_plural = 'Patentler'

    def __str__(self):
        return self.title
