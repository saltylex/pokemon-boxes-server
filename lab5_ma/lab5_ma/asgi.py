"""
ASGI config for lab5_ma project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
from django.urls import path

from pokemon_api import consumers

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lab5_ma.settings')
application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket':
        AuthMiddlewareStack(URLRouter([
            path('ws/pokemon', consumers.PokemonConsumer.as_asgi()),
        ])),
})
