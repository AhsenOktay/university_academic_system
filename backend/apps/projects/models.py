from django.db import models
from core.models import BaseModel
from apps.users.models import User


class Project(BaseModel):

    class Type(models.TextChoices):
        TUBITAK = 'tubitak', 'TÜBİTAK'
        BAP = 'bap', 'BAP'
        EU = 'eu', 'Avrupa Birliği'
        INDUSTRY = 'industry', 'Sanayi'
        OTHER = 'other', 'Diğer'

    class Status(models.TextChoices):
        ONGOING = 'ongoing', 'Devam Ediyor'
        COMPLETED = 'completed', 'Tamamlandı'
        CANCELLED = 'cancelled', 'İptal Edildi'

    title = models.CharField(max_length=500)
    title_en = models.CharField(max_length=500, blank=True)
    project_type = models.CharField(max_length=20, choices=Type.choices)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.ONGOING
    )
    coordinator = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True,
        related_name='coordinated_projects'
    )
    members = models.ManyToManyField(
        User, related_name='projects', blank=True
    )
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    budget = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True
    )
    description = models.TextField(blank=True)
    owner = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True,
        related_name='owned_projects'
    )

    class Meta:
        db_table = 'projects'
        ordering = ['-start_date']
        verbose_name = 'Proje'
        verbose_name_plural = 'Projeler'

    def __str__(self):
        return self.title
