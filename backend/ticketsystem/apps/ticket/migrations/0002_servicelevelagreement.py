# Generated by Django 4.2.3 on 2024-08-21 11:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("user", "0001_initial"),
        ("ticket", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="ServiceLevelAgreement",
            fields=[
                (
                    "basemodel_ptr",
                    models.OneToOneField(
                        auto_created=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        parent_link=True,
                        primary_key=True,
                        serialize=False,
                        to="user.basemodel",
                    ),
                ),
                ("product", models.CharField(max_length=128)),
                ("max_respnse_time", models.IntegerField()),
                ("max_resolution_time", models.IntegerField()),
                ("is_accepted", models.BooleanField(default=False)),
            ],
            bases=("user.basemodel",),
        ),
    ]
