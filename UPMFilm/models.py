from django.db import models


class Genre(models.Model):
    name = models.CharField(max_length=50)


class Film(models.Model):
    name = models.CharField(max_length=100)
    url = models.URLField()
    description = models.TextField()
    date = models.DateField()
    director = models.CharField(max_length=50)
    actors = models.TextField()
    poster = models.URLField()
    rating = models.FloatField()
    genres = models.ManyToManyField(Genre)
