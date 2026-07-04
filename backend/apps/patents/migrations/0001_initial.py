

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Patent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('title', models.CharField(max_length=500)),
                ('patent_no', models.CharField(blank=True, max_length=100)),
                ('application_date', models.DateField()),
                ('grant_date', models.DateField(blank=True, null=True)),
                ('status', models.CharField(choices=[('applied', 'Başvuru Yapıldı'), ('pending', 'İncelemede'), ('granted', 'Onaylandı'), ('rejected', 'Reddedildi')], default='applied', max_length=20)),
                ('description', models.TextField(blank=True)),
                ('inventors', models.ManyToManyField(blank=True, related_name='patents', to=settings.AUTH_USER_MODEL)),
                ('owner', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='owned_patents', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Patent',
                'verbose_name_plural': 'Patentler',
                'db_table': 'patents',
                'ordering': ['-application_date'],
            },
        ),
    ]
