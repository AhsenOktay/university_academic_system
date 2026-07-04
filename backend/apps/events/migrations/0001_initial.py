

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
            name='Event',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('title', models.CharField(max_length=500)),
                ('title_en', models.CharField(blank=True, max_length=500)),
                ('event_type', models.CharField(choices=[('conference', 'Konferans'), ('seminar', 'Seminer'), ('workshop', 'Workshop'), ('panel', 'Panel'), ('symposium', 'Sempozyum'), ('other', 'Diğer')], max_length=20)),
                ('role', models.CharField(choices=[('organizer', 'Organizatör'), ('speaker', 'Konuşmacı'), ('participant', 'Katılımcı'), ('chair', 'Oturum Başkanı')], default='organizer', max_length=20)),
                ('location', models.CharField(blank=True, max_length=300)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField(blank=True, null=True)),
                ('description', models.TextField(blank=True)),
                ('url', models.URLField(blank=True)),
                ('organizer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='events', to=settings.AUTH_USER_MODEL)),
                ('owner', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='owned_events', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Etkinlik',
                'verbose_name_plural': 'Etkinlikler',
                'db_table': 'events',
                'ordering': ['-start_date'],
            },
        ),
    ]
