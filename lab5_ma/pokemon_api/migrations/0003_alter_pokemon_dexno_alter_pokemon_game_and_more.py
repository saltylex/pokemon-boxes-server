# Generated by Django 4.2.8 on 2024-01-07 12:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pokemon_api', '0002_alter_pokemon_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pokemon',
            name='dexNo',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='pokemon',
            name='game',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='pokemon',
            name='notes',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='pokemon',
            name='place',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]