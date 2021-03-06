from django.db.models import Sum

from core import models
from openpyxl import load_workbook
import pandas as pd
import numpy as np
import requests
from datetime import datetime


def parse_xls_sber_deals(file, user):
    dataset = pd.read_excel(file)
    deals_list = []
    dataset = dataset[['Код финансового инструмента',
                       'Номер сделки',
                       'Тип финансового инструмента',
                       'Тип рынка',
                       'Операция',
                       'Количество',
                       'Цена',
                       'Сумма зачисления/списания']]
    dataset['Количество'] = np.where(dataset['Операция'] == 'Покупка',
                                     dataset['Количество'],
                                     -dataset['Количество'])
    dataset['Сумма зачисления/списания'] = np.where(dataset['Операция'] == 'Покупка',
                                                    -dataset['Сумма зачисления/списания'],
                                                    dataset['Сумма зачисления/списания'])
    dataset = dataset.groupby(['Код финансового инструмента',
                               'Тип финансового инструмента',
                               'Номер сделки',
                               'Цена'],
                              as_index=False).sum()
    for index, row in dataset.iterrows():
        if models.Deal.objects.filter(user=user, deal_number=row['Номер сделки']).exists():
            count = 0
            price = 0
        else:
            curr_deal = get_or_none(models.DealResult, user=user, financial_code=row['Код финансового инструмента'])
            count = curr_deal.count if curr_deal else 0
            price = curr_deal.price if curr_deal else 0
        deal = models.DealResult(
            user=user,
            financial_code=row['Код финансового инструмента'],
            financial_type=row['Тип финансового инструмента'],
            count=row['Количество'] + count,
            price=-row['Сумма зачисления/списания'] - price,
            price_one=row['Цена']
        )
        deals_list.append(deal)
    models.DealResult.objects.filter(user=user) \
        .bulk_update_or_create(deals_list,
                               match_field='financial_code',
                               update_fields=['count', 'price', 'price_one'])
    deals_list = []
    dataset = None
    wb = load_workbook(filename=file)
    sheet_ranges = wb.active
    i = 2
    while sheet_ranges[f'A{i}'].value:
        if sheet_ranges[f'H{i}'].value == 'Покупка':
            all_sum = -sheet_ranges[f'Q{i}'].value
        else:
            all_sum = sheet_ranges[f'Q{i}'].value
        deal = models.Deal(agreement_name=sheet_ranges[f'A{i}'].value,
                           deal_result=models.DealResult.objects.get(user=user,
                                                                     financial_code=sheet_ranges[f'E{i}'].value),
                           deal_number=sheet_ranges[f'B{i}'].value,
                           conclusion_date=sheet_ranges[f'C{i}'].value,
                           payment_date=sheet_ranges[f'D{i}'].value,
                           financial_code=sheet_ranges[f'E{i}'].value,
                           financial_type=sheet_ranges[f'F{i}'].value,
                           market_type=sheet_ranges[f'G{i}'].value,
                           operation=sheet_ranges[f'H{i}'].value,
                           count=sheet_ranges[f'I{i}'].value,
                           price=sheet_ranges[f'J{i}'].value,
                           accrued_interest=sheet_ranges[f'K{i}'].value,
                           deal_volume=sheet_ranges[f'L{i}'].value,
                           currency=sheet_ranges[f'M{i}'].value,
                           rate=sheet_ranges[f'N{i}'].value,
                           trading_system_commission=sheet_ranges[f'O{i}'].value,
                           bank_commission=sheet_ranges[f'P{i}'].value,
                           all_sum=all_sum,
                           deal_type=sheet_ranges[f'R{i}'].value,
                           user=user)
        deals_list.append(deal)
        i += 1
    models.Deal.objects.filter(user=user).bulk_update_or_create(deals_list, match_field='deal_number',
                                                                update_fields=['count', 'price', 'all_sum'])
    user_addition = models.UserAddition.objects.get(user=user)
    total_in_actions = models.Deal.objects.filter(user=user).aggregate(Sum('all_sum'))
    user_addition.total_price = user_addition.all_sum + total_in_actions['all_sum__sum']
    user_addition.save()


def parse_xls_sber_enrollment(file, user):
    dataset = pd.read_excel(file)
    dataset['Сумма'] = np.where(dataset['Зачисление на'].notnull(),
                                dataset['Сумма'],
                                -dataset['Сумма'])
    total_sum = dataset['Сумма'].sum()
    total_in_actions = models.Deal.objects.filter(user=user).aggregate(Sum('all_sum'))
    user_addition = models.UserAddition.objects.get(user=user)
    user_addition.all_sum = total_sum
    user_addition.total_price = total_sum + total_in_actions['all_sum__sum']
    print(total_sum)
    print(total_in_actions)
    user_addition.save()


def get_or_none(model, **kwargs):
    try:
        return model.objects.get(**kwargs)
    except model.DoesNotExist:
        return None
