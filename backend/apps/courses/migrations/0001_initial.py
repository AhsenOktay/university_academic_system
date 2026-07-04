

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
            name='Course',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('code', models.CharField(blank=True, max_length=20)),
                ('name', models.CharField(max_length=300)),
                ('name_en', models.CharField(blank=True, max_length=300)),
                ('level', models.CharField(choices=[('undergraduate', 'Lisans'), ('graduate', 'Yüksek Lisans'), ('doctorate', 'Doktora')], max_length=20)),
                ('semester', models.CharField(choices=[('fall', 'Güz'), ('spring', 'Bahar'), ('summer', 'Yaz')], max_length=10)),
                ('year', models.IntegerField()),
                ('credits', models.IntegerField(blank=True, null=True)),
                ('instructor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='courses', to=settings.AUTH_USER_MODEL)),
                ('owner', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='owned_courses', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Ders',
                'verbose_name_plural': 'Dersler',
                'db_table': 'courses',
                'ordering': ['-year', 'name'],
            },
        ),
    ]
