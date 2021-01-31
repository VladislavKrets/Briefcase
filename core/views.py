from django.db.models.expressions import RawSQL
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from core import utils
from core import serializers
from core import models
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.mixins import RetrieveModelMixin, CreateModelMixin, ListModelMixin, DestroyModelMixin
from rest_framework.generics import GenericAPIView


class Auth(APIView):
    # authentication
    def post(self, request):
        data = request.data
        serializer = serializers.AuthSerializer(data=data)
        if not serializer.is_valid():
            return Response(data=serializer.errors, status=status.HTTP_401_UNAUTHORIZED)
        data = serializer.validated_data
        is_user_exist = User.objects.filter(username=data['username']).exists()
        if is_user_exist:
            try:
                user = User.objects.get(username=data['username'], password=data['password'], email=data['username'])
                token = Token.objects.get_or_create(user=user)[0]
                return Response(data={'token': token.key}, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                return Response(data={'error': 'Неверный пароль'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(data={'error': 'Пользователь не существует'}, status=status.HTTP_401_UNAUTHORIZED)

    # registration
    def put(self, request):
        data = request.data
        serializer = serializers.AuthSerializer(data=data)
        if not serializer.is_valid():
            return Response(data=serializer.errors, status=status.HTTP_401_UNAUTHORIZED)
        data = serializer.validated_data
        is_user_exist = User.objects.filter(username=data['username']).exists()
        if is_user_exist:
            return Response(data={'error': 'Пользователь уже существует'}, status=status.HTTP_401_UNAUTHORIZED)
        user = User.objects.create(username=data['username'], password=data['password'], email=data['username'])
        token = Token.objects.get_or_create(user=user)[0]
        return Response(data={'token': token.key}, status=status.HTTP_200_OK)


class FileUploadMixin(CreateModelMixin, GenericAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    parser_classes = (MultiPartParser, FormParser)
    serializer_class = serializers.SavedFileSerializer
    queryset = models.File.objects.all()

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        file = models.File.objects.create(user=request.user, file=instance)
        utils.parse_xls(file.file, request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get(self, request, *args, **kwargs):
        utils.parse_xls('book2.xlsx', request.user)
        return Response(status=status.HTTP_201_CREATED)


class DealMixin(ListModelMixin, GenericAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    serializer_class = serializers.DealSerializer
    queryset = models.Deal.objects.all().annotate(conclusion_date__date=RawSQL('DATE(conclusion_date)', ()))\
        .order_by('-conclusion_date__date', 'financial_code')

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class ResultDealMixin(ListModelMixin, GenericAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    serializer_class = serializers.ResultDealSerializer
    queryset = models.DealResult.objects.filter(count__gt=0, financial_type='Акция')

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)