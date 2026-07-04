from django.db import models
from django.utils.text import slugify
from core.models import BaseModel
from apps.users.models import User
class ResearchGroup(BaseModel):
    name = models.CharField(max_length=300)
    name_en = models.CharField(max_length=300, blank=True)
    slug = models.SlugField(unique=True, max_length=200)
    description = models.TextField(blank=True)
    description_en = models.TextField(blank=True)
    logo = models.ImageField(
        upload_to='research_groups/logos/', null=True, blank=True
    )
    founder = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True,
        related_name='founded_groups'
    )
    members = models.ManyToManyField(
        User, related_name='research_groups', blank=True
    )
    is_active = models.BooleanField(default=True)
    owner = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True,
        related_name='owned_groups'
    )
    class Meta:
        db_table = 'research_groups'
        verbose_name = 'Araştırma Grubu'
        verbose_name_plural = 'Araştırma Grupları'
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    def __str__(self):
        return self.name
