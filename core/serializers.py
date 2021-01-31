from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from core import models
from django.contrib.auth.models import User
from core import utils


class ActionPriceSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.ActionsPrice
        fields = '__all__'


class ResultDealSerializer(serializers.ModelSerializer):

    def to_representation(self, instance):
        data = super().to_representation(instance)
        action_price = utils.get_or_none(models.ActionsPrice, sec_id=data['financial_code'])
        serializer = ActionPriceSerializer(instance=action_price)
        data['price_info'] = serializer.data
        return data

    class Meta:
        model = models.DealResult
        fields = '__all__'


class DealSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Deal
        fields = '__all__'


class SavedFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.File
        fields = '__all__'
        read_only_fields = ('id', 'date')


class AuthSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def update(self, instance, validated_data):
        pass

    def create(self, validated_data):
        pass