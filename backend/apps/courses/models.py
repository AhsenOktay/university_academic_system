from django.db import models
from core.models import BaseModel
from apps.users.models import User

class Course(BaseModel):
    class Level(models.TextChoices):
        UNDERGRADUATE = 'undergraduate', 'Lisans'
        GRADUATE = 'graduate', 'Yüksek Lisans'
        DOCTORATE = 'doctorate', 'Doktora'

    class Semester(models.TextChoices):
        FALL = 'fall', 'Güz'
        SPRING = 'spring', 'Bahar'
        SUMMER = 'summer', 'Yaz'

    code = models.CharField(max_length=20, blank=True)
    name = models.CharField(max_length=300)
    name_en = models.CharField(max_length=300, blank=True)
    level = models.CharField(max_length=20, choices=Level.choices)
    semester = models.CharField(max_length=10, choices=Semester.choices)
    year = models.IntegerField()
    credits = models.IntegerField(null=True, blank=True)
    instructor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='courses')
    owner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='owned_courses')

    class Meta:
        db_table = 'courses'
        ordering = ['-year', 'name']
        verbose_name = 'Ders'
        verbose_name_plural = 'Dersler'

    def __str__(self):
        return f"{self.code} - {self.name} ({self.year})"