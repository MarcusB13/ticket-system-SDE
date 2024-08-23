import datetime

import jwt
from django.conf import settings
from django.shortcuts import get_object_or_404, render
from django.utils.decorators import method_decorator
from django.utils.translation import gettext_lazy as _
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Company, User
from .serializers import UserCreatorSerializer, UserSerializer


@method_decorator(csrf_exempt, name="dispatch")
class SignUpView(APIView):
    """ """

    permission_classes = (IsAuthenticated,)
    authentication_classes = ()
    serializer_class = None

    def post(self, request, *args, **kwargs):
        inputData = request.data
        password = inputData.get("password")
        password2 = inputData.pop("password2")
        if password != password2 or not password:
            data = {"error": "Passwords do not match"}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserCreatorSerializer(data=inputData)
        if serializer.is_valid():
            serializer.save()
            user = User.objects.get(username=inputData.get("username"))
            user.set_password(password)
            user.save()

            token = Token.objects.create(user=user)
            payload = {
                "user_id": user.id,
                "exp": datetime.datetime.now() + datetime.timedelta(days=1),
                "iat": datetime.datetime.now(),
                "token": token.key,
            }
            jwtToken = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

            response = Response()
            response.set_cookie("jwt", jwtToken)
            response.data = serializer.data
            return response
        return Response(
            {"error": serializer.error_messages}, status=status.HTTP_400_BAD_REQUEST
        )


@method_decorator(csrf_exempt, name="dispatch")
class LoginView(APIView):
    """ """

    permission_classes = ()
    authentication_classes = ()
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        inputData = request.data
        user = get_object_or_404(User, username=inputData.get("username"))
        if not user.check_password(inputData.get("password")):
            data = {"error": "Invalid password"}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

        token = Token.objects.get(user=user)
        payload = {
            "user_id": user.id,
            "exp": datetime.datetime.now() + datetime.timedelta(days=1),
            "iat": datetime.datetime.now(),
            "token": token.key,
        }
        jwtToken = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

        response = Response()
        response.set_cookie("jwt", jwtToken)
        response.data = self.serializer_class(user).data
        return response


class UpdateUseView(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        user = request.user
        inputData = request.data
        serializer = self.serializer_class(user, data=inputData, partial=True)
        if serializer.is_valid():
            serializer.save()

            companies = inputData.get("company")
            user.company.clear()
            for companyUuid in companies:
                company = Company.objects.filter(uuid=companyUuid).first()
                if not company:
                    continue
                user.company.add(company)

            return Response(serializer.data)
        return Response(
            {"error": serializer.error_messages}, status=status.HTTP_400_BAD_REQUEST
        )
