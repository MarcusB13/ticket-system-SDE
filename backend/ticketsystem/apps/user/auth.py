import jwt
from django.conf import settings
from django.utils.translation import gettext as _
from rest_framework import authentication, exceptions
from rest_framework.authtoken.models import Token

from .models import User


class CustomTokenAuthentication(authentication.BaseAuthentication):
    """
    Add this header:
    Authorization: Token <Token>
    """

    keyword = "Token"
    model = None

    def authenticate(self, request):
        jwtKey = request.COOKIES.get("jwt")
        print(jwtKey)
        if jwtKey is None:
            return None

        try:
            userDetails = jwt.decode(jwtKey, settings.SECRET_KEY, algorithms="HS256")
        except:
            msg = _("Invalid Login")
            raise exceptions.AuthenticationFailed(msg)

        if (
            not userDetails
            or not userDetails.get("user_id")
            or not userDetails.get("token")
        ):
            msg = _("Invalid Login Credentials")
            raise exceptions.AuthenticationFailed(msg)

        user = User.objects.get(id=userDetails.get("user_id"))
        if not user:
            msg = _("Invalid Login Credentials")
            raise exceptions.AuthenticationFailed(msg)

        if not user.is_active:
            msg = _("User is not active")
            raise exceptions.AuthenticationFailed(msg)

        userToken = Token.objects.filter(user=user).first()
        if not userToken:
            msg = _("Invalid Token")
            raise exceptions.AuthenticationFailed(msg)

        token = userDetails.get("token")
        if token != userToken.key:
            msg = _("Invalid Token")
            raise exceptions.AuthenticationFailed(msg)

        return (user, token)
