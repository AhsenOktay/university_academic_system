from django.db import models
from core.models import BaseModel
from apps.users.models import User


class Thesis(BaseModel):

    class Type(models.TextChoices):
        MASTERS = 'masters', 'Yüksek Lisans'
        PHD = 'phd', 'Doktora'

    title = models.CharField(max_length=500)
    title_en = models.CharField(max_length=500, blank=True)
    thesis_type = models.CharField(max_length=10, choices=Type.choices)
    student = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True,
        related_name='theses'
    )
    advisor = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True,
        related_name='advised_theses'
    )
    year = models.IntegerField()
    abstract = models.TextField(blank=True)
    pdf_file = models.FileField(
        upload_to='theses/pdfs/', null=True, blank=True
    )
    owner = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True,
        related_name='owned_theses'
    )

    class Meta:
        db_table = 'theses'
        ordering = ['-year']
        verbose_name = 'Tez'
        verbose_name_plural = 'Tezler'

    def __str__(self):
        return f"[{self.thesis_type}] {self.title} ({self.year})"
