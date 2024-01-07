from rest_framework import serializers

from .models import Pokemon


class PokemonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pokemon
        fields = ('id', 'name', 'type', 'sprite', 'date', 'place', 'game', 'notes', 'caught', 'dexNo')
