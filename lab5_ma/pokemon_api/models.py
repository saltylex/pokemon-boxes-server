from django.db import models


class Pokemon(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    sprite = models.CharField(max_length=100)
    date = models.CharField(max_length=100, null=True, blank=True)
    place = models.CharField(max_length=100, null=True, blank=True)
    game = models.CharField(max_length=100, null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    caught = models.BooleanField()
    dexNo = models.IntegerField(null=True, blank=True)
