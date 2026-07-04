from django.db import models
from core.models import BaseModel
from apps.users.models import User


class Award(BaseModel):

    title = models.CharField(max_length=300)
    given_by = models.CharField(max_length=300)
    recipient = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='awards'
    )
    year = models.IntegerField()
    description = models.TextField(blank=True)
    owner = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True,
        related_name='owned_awards'
    )

    class Meta:
        db_table = 'awards'
        ordering = ['-year']
        verbose_name = 'Ödül'
        verbose_name_plural = 'Ödüller'

    def __str__(self):
        return f"{self.title} — {self.recipient} ({self.year})"
