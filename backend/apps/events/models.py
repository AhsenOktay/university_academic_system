from django.db import models
from core.models import BaseModel
from apps.users.models import User


class Event(BaseModel):

    class Type(models.TextChoices):
        CONFERENCE = 'conference', 'Konferans'
        SEMINAR = 'seminar', 'Seminer'
        WORKSHOP = 'workshop', 'Workshop'
        PANEL = 'panel', 'Panel'
        SYMPOSIUM = 'symposium', 'Sempozyum'
        OTHER = 'other', 'Diğer'

    class Role(models.TextChoices):
        ORGANIZER = 'organizer', 'Organizatör'
        SPEAKER = 'speaker', 'Konuşmacı'
        PARTICIPANT = 'participant', 'Katılımcı'
        CHAIR = 'chair', 'Oturum Başkanı'

    title = models.CharField(max_length=500)
    title_en = models.CharField(max_length=500, blank=True)
    event_type = models.CharField(max_length=20, choices=Type.choices)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.ORGANIZER)
    location = models.CharField(max_length=300, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    description = models.TextField(blank=True)
    url = models.URLField(blank=True)
    image = models.ImageField(upload_to='events/', null=True, blank=True)
    organizer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events')
    owner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='owned_events')

    class Meta:
        db_table = 'events'
        ordering = ['-start_date']
        verbose_name = 'Etkinlik'
        verbose_name_plural = 'Etkinlikler'

    def __str__(self):
        return f"{self.title} ({self.start_date})"