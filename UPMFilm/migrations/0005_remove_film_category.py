# Generated by Django 3.0.5 on 2020-06-01 17:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('UPMFilm', '0004_film_category'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='film',
            name='category',
        ),
    ]
