from django.urls import path

from .views import PokemonListView, PokemonDetailView

urlpatterns = [
    path('all/', PokemonListView.as_view(), name='pokemonList'),
    path('all/<int:pk>/', PokemonDetailView.as_view(), name='pokemonDetail'),

]
