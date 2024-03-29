from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.http import Http404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Pokemon
from .serializers import PokemonSerializer


class PokemonListView(APIView):
    # all
    def get(self, request, *args, **kwargs):
        pokemon = Pokemon.objects.all()
        serializer = PokemonSerializer(pokemon, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = PokemonSerializer(data=request.data)
        if serializer.is_valid():
            pokemon_instance = serializer.save()
            copy_request = request.data
            copy_request['id'] = pokemon_instance.id
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                'pokemon_updates',
                {
                    "type": 'send.pokemon.update',
                    "data": {'type': 'create', 'pokemon':copy_request},
                }
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PokemonDetailView(APIView):
    def get_object(self, pk):
        try:
            return Pokemon.objects.get(pk=pk)
        except Pokemon.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        pokemon = self.get_object(pk)
        serializer = PokemonSerializer(pokemon)
        return Response(serializer.data)

    def delete(self, request, pk):
        pokemon = self.get_object(pk)
        pokemon.delete()
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'pokemon_updates',
            {
                "type": 'send.pokemon.update',
                "data": {'type': 'delete', 'id': pk,}
            }
        )
        return Response(status=status.HTTP_204_NO_CONTENT)

    def put(self, request, pk):
        pokemon = self.get_object(pk)
        serializer = PokemonSerializer(pokemon, data=request.data)
        if serializer.is_valid():
            serializer.save()
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                'pokemon_updates',
                {
                    "type": 'send.pokemon.update',
                    "data": {'type': 'update', 'pokemon': request.data},
                }
            )
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
