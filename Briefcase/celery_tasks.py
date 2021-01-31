import os

from celery import Celery
from datetime import datetime, timedelta
from Briefcase import settings
import requests

# set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Briefcase.settings')

app = Celery('Briefcase', broker='redis://localhost')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)


@app.on_after_finalize.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(1800, parse_current_price.s(), name='update prices every hour')


@app.task
def parse_current_price():
    from core import models

    actions = []
    securities = ','.join(models.DealResult.objects.filter(financial_type='Акция')
                          .distinct('financial_code') \
                          .values_list('financial_code', flat=True))
    while True:
        try:
            result = requests \
                .get(f'http://iss.moex.com/iss/engines/stock/markets/shares/boards/TQBR/securities.json?'
                     f'securities={securities}') \
                .json()
            securities_data = result['securities']['data']
            market_data = result['marketdata']['data']
            for i in range(len(securities_data)):
                price = models.ActionsPrice(board_id=securities_data[i][1],
                                            sec_id=securities_data[i][0],
                                            short_name=securities_data[i][2],
                                            secname=securities_data[i][9],
                                            last_price=market_data[i][12],
                                            last_change=market_data[i][13],
                                            last_change_prcnt=market_data[i][14])
                actions.append(price)
            break
        except requests.ConnectionError:
            pass
    models.ActionsPrice.objects.bulk_update_or_create(actions, match_field='sec_id',
                                                      update_fields=['last_price',
                                                                     'last_change',
                                                                     'last_change_prcnt'])
