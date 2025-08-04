from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings


def set_default_documento(apps, schema_editor):
    """Set a default value for the documento field in existing records."""
    EmailVerificationCode = apps.get_model('users', 'EmailVerificationCode')
    for code in EmailVerificationCode.objects.all():
        # Use the user's documento if exists, otherwise use a default value
        if hasattr(code, 'user') and code.user:
            code.documento = code.user.documento
        else:
            code.documento = '00000000'  # Default value for old records
        code.save()


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('users', '0009_auto_20250803_2142'),
    ]

    operations = [
        # Add new fields
        migrations.AddField(
            model_name='emailverificationcode',
            name='documento',
            field=models.CharField(default='00000000', max_length=20),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='emailverificationcode',
            name='email',
            field=models.EmailField(default='old@example.com', max_length=254),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='emailverificationcode',
            name='verified',
            field=models.BooleanField(default=False),
        ),
        
        # Set the email field from the user's email
        migrations.RunSQL(
            """
            UPDATE users_emailverificationcode
            SET email = (
                SELECT email FROM users_usuario 
                WHERE users_usuario.id = users_emailverificationcode.user_id
            )
            """,
            reverse_sql=migrations.RunSQL.noop,
        ),
        
        # Set default values for the documento field
        migrations.RunPython(set_default_documento, reverse_code=migrations.RunPython.noop),
        
        # Remove the old user foreign key
        migrations.RemoveField(
            model_name='emailverificationcode',
            name='user',
        ),
        
        # Add indexes
        migrations.AlterModelOptions(
            name='emailverificationcode',
            options={'ordering': ['-created_at']},
        ),
        migrations.AddIndex(
            model_name='emailverificationcode',
            index=models.Index(fields=['email', 'documento', 'code'], name='users_email_email_9c3f4d_idx'),
        ),
    ]
