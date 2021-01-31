from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from bulk_update_or_create import BulkUpdateOrCreateQuerySet


class ActionsPrice(models.Model):
    objects = BulkUpdateOrCreateQuerySet.as_manager()
    board_id = models.CharField(max_length=150)
    sec_id = models.CharField(max_length=150, unique=True, primary_key=True)
    short_name = models.CharField(max_length=60)
    secname = models.CharField(max_length=180)
    last_price = models.FloatField()
    last_change = models.FloatField()
    last_change_prcnt = models.FloatField()


class DealResult(models.Model):
    objects = BulkUpdateOrCreateQuerySet.as_manager()
    user = models.ForeignKey(to=User, on_delete=models.deletion.CASCADE)
    financial_code = models.CharField(max_length=150, unique=True, primary_key=True)
    financial_type = models.CharField(max_length=255)
    count = models.IntegerField()
    price = models.FloatField()
    price_one = models.FloatField()


class Deal(models.Model):
    user = models.ForeignKey(to=User, on_delete=models.deletion.CASCADE)
    deal_result = models.ForeignKey(to=DealResult, on_delete=models.deletion.CASCADE)
    agreement_name = models.CharField(max_length=40)
    deal_number = models.CharField(max_length=150)
    conclusion_date = models.DateTimeField()
    payment_date = models.DateTimeField()
    financial_code = models.CharField(max_length=40)
    financial_type = models.CharField(max_length=255)
    market_type = models.CharField(max_length=255)
    operation = models.CharField(max_length=40)
    count = models.IntegerField()
    price = models.FloatField()
    accrued_interest = models.IntegerField()
    deal_volume = models.FloatField()
    currency = models.CharField(max_length=20)
    rate = models.IntegerField()
    trading_system_commission = models.FloatField()
    bank_commission = models.FloatField()
    all_sum = models.FloatField()
    deal_type = models.CharField(max_length=40)


class File(models.Model):
    user = models.ForeignKey(to=User, on_delete=models.deletion.CASCADE)
    file = models.FileField(upload_to='files')
    date = models.DateTimeField(default=timezone.now)
