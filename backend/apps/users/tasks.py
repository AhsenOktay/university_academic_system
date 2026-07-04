import logging
from celery import shared_task
from django.db import connections, OperationalError
from .models import User

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3)
def sync_users_from_school_db(self):
   
    logger.info("DB senkronizasyonu başlıyor...")

    try:
        with connections['school'].cursor() as cursor:
           
            cursor.execute("""
                SELECT
                    id,
                    email,
                    first_name,
                    last_name,
                    role,
                    faculty,
                    department,
                    title
                FROM users
                WHERE is_active = TRUE
            """)
            columns = [col[0] for col in cursor.description]
            school_users = [dict(zip(columns, row)) for row in cursor.fetchall()]

    except OperationalError as exc:
        logger.error(f"❌ Okul DB bağlantı hatası: {exc}")
        raise self.retry(exc=exc, countdown=60)

    
    ROLE_MAP = {
        'personel': User.Role.ACADEMIC,
        'academic': User.Role.ACADEMIC,
        'ogretim_uyesi': User.Role.ACADEMIC,
        'ogrenci': User.Role.STUDENT,
        'student': User.Role.STUDENT,
    }

    school_ids = []
    created = updated = 0

    for row in school_users:
        school_id = str(row['id'])
        school_ids.append(school_id)
        mapped_role = ROLE_MAP.get(row.get('role', ''), User.Role.STUDENT)

        user, was_created = User.objects.update_or_create(
            school_id=school_id,
            defaults={
                'email': row['email'],
                'first_name': row['first_name'],
                'last_name': row['last_name'],
                'role': mapped_role,
                'faculty': row.get('faculty') or '',
                'department': row.get('department') or '',
                'title': row.get('title') or '',
                'is_active': True,
            }
        )

        if was_created:
            temp_pass = User.generate_temp_password()
            user.set_password(temp_pass)
            user.temp_password = temp_pass  
            user.must_change_password = True
            user.save(update_fields=['password', 'temp_password', 'must_change_password'])
            created += 1
            logger.info(f"✅ Yeni kullanıcı: {user.email}")
        else:
            updated += 1

  
    deactivated = User.objects.filter(
        school_id__isnull=False,
        is_active=True
    ).exclude(
        school_id__in=school_ids
    ).update(is_active=False)

    logger.info(
        f"✅ Senkronizasyon tamamlandı → "
        f"Yeni: {created} | Güncellendi: {updated} | Pasif: {deactivated}"
    )
