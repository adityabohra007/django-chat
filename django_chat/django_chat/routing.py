from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import main.routing

ASGI_APPLICATION = "realtime.routing.application"

application = ProtocolTypeRouter({
  'websocket': AuthMiddlewareStack(
    URLRouter(
    main.routing.websocket_urlpatterns # send websocket requests to chatter's urls
    )
  )
})
