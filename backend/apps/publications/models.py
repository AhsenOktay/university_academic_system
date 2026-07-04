from django.db import models
from core.models import BaseModel
from apps.users.models import User

class Publication(BaseModel):
    class Type(models.TextChoices):
        ARTICLE = 'article', 'Makale'
        BOOK = 'book', 'Kitap'
        BOOK_CHAPTER = 'book_chapter', 'Kitap Bölümü'
        CONFERENCE = 'conference', 'Bildiri'
        OTHER = 'other', 'Diğer'

    title = models.CharField(max_length=500)
    title_en = models.CharField(max_length=500, blank=True)
    pub_type = models.CharField(max_length=20, choices=Type.choices)
    authors = models.ManyToManyField(User, related_name='publications', blank=True)
    year = models.IntegerField()
    journal = models.CharField(max_length=300, blank=True)
    doi = models.CharField(max_length=200, blank=True)
    abstract = models.TextField(blank=True)
    keywords = models.CharField(max_length=500, blank=True)
    pdf_file = models.FileField(upload_to='publications/pdfs/', null=True, blank=True)
    owner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='owned_publications')

    class Meta:
        db_table = 'publications'
        ordering = ['-year', '-created_at']
        verbose_name = 'Yayın'
        verbose_name_plural = 'Yayınlar'

    def __str__(self):
        return f"[{self.year}] {self.title}"
