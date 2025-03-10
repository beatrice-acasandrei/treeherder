# Generated by Django 3.2.13 on 2022-05-30 11:02
from django.db import migrations, models

from treeherder.perf.utils import TRIAGE_DAYS, calculate_time_to


def update_summary_triage_due_date(apps, schema_editor):
    PerformanceAlertSummary = apps.get_model('perf', 'PerformanceAlertSummary')

    for row in PerformanceAlertSummary.objects.all():
        row.triage_due_date = calculate_time_to(row.created, due_days=TRIAGE_DAYS)
        row.save()


class Migration(migrations.Migration):
    dependencies = [
        ('perf', '0046_restore_cascade_perf_datum_deletion'),
    ]

    operations = [
        migrations.AddField(
            model_name='performancealertsummary',
            name='triage_due_date',
            field=models.DateTimeField(default=None, null=True),
        ),
        migrations.RunPython(
            update_summary_triage_due_date,
            reverse_code=migrations.RunPython.noop,
        ),
    ]
