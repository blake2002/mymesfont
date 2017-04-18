#! /usr/bin/python
#-*- coding:utf-8 -*-
import sys
import json

from urllib import urlencode
from tornado.httpclient import HTTPRequest, HTTPClient

from hite.mes.test.comm import *

def device_list(id):

    url = BASEURL + '/device_list'
    args = {
        'userId': '1',
        'token': 'xxx',
        'regionId': id,
        'cateFilter': 'all',
        'pageIndex': 1,
        'pageSize': 15
    }

    do_get(url, args)

def device_count(id):

    url = BASEURL + '/device_count'
    args = {
        'userId': 'sljn',
        'token': 'xxx',
        'regionId': id,
    }

    do_get(url, args)

def device_detail(id):

    url = BASEURL + '/device_detail'
    args = {
        'userId': 'sljn',
        'token': 'xxx',
        'deviceId': id
    }

    do_get(url, args)

def device_belongs(id):

    url = BASEURL + '/device_belongs'
    args = {
        'userId': '1',
        'token': 'xxx',
        'deviceId': id
    }

    do_get(url, args)

def device_baseinfo(id):

    url = BASEURL + '/device_attribute'
    args = {
        'userId': '1',
        'token': 'xxx',
        'deviceId': id,
        'categroy': 'NSDevices'
    }

    do_get(url, args)

def device_driver(id):

    url = BASEURL + '/device_attribute'
    args = {
        'userId': '1',
        'token': 'xxx',
        'deviceId': id,
        'categroy': 'NSDevicesDriver'
    }

    do_get(url, args)

def device_vars(id):

    url = BASEURL + '/device_attribute'
    args = {
        'userId': '1',
        'token': 'xxx',
        'deviceId': id,
        'categroy': 'NSDevicesVarInfo'
    }

    do_get(url, args)

def device_alarms(id):

    url = BASEURL + '/device_attribute'
    args = {
        'userId': '1',
        'token': 'xxx',
        'deviceId': id,
        'categroy': 'NSDevicesAlarmInfo'
    }

    do_get(url, args)

def device_flowchart(id):

    url = BASEURL + '/device_ui'
    args = {
        'userId': '1',
        'token': 'xxx',
        'deviceId': id,
        'categroy': 'NSDeviceFlowChart'
    }

    do_get(url, args)

def device_overview(id):

    url = BASEURL + '/device_ui'
    args = {
        'userId': '1',
        'token': 'xxx',
        'deviceId': id,
        'categroy': 'NSDeviceUIOverview'
    }

    do_get(url, args)

def device_dutycard(id):

    url = BASEURL + '/device_ui'
    args = {
        'userId': '1',
        'token': 'xxx',
        'deviceId': id,
        'categroy': 'NSDutyCard'
    }

    do_get(url, args)

def device_driver_config(id):

    url = BASEURL + '/device_driver_config'
    args = {
        'userId': '1',
        'token': 'xxx',
        'driverId': id,
    }

    do_get(url, args)

def modify_device(id):
    url = BASEURL + '/modified_device'

    args = {
        'userId': '1',
        'token': 'xxx',
        'deviceId': 'aaa',
        'props': {'aa': 'bb', 'cc': 'dd'}
    }

    do_post(url, args)

def device_template():
    url = BASEURL + '/device_template'

    args = {
        'userId': '1',
        'token': 'xxx',
        'categroy': 'NSDevices'
    }

    do_get(url, args)

def device_var_template():
    url = BASEURL + '/device_template'

    args = {
        'userId': '1',
        'token': 'xxx',
        'categroy': 'NSDevicesVarInfo'
    }

    do_get(url, args)

def device_concern(device_id):
    url = BASEURL + '/concern_device'

    args = {
        'userId': 'sljn',
        'token': 'xxx',
        'deviceId': device_id
    }

    do_post(url, args)

def device_unconcern(device_id):
    url = BASEURL + '/unconcern_device'

    args = {
        'userId': '1',
        'token': 'xxx',
        'deviceId': device_id
    }

    do_post(url, args)

def tag(device_ids, tagNames):
    url = BASEURL + '/tag_device'

    args = {
        'userId': 'sljn',
        'token': 'xxx',
        'deviceIds': device_ids,
        'tagNames': tagNames
    }

    do_post(url, args)

def untag(devices, tagNames):
    url = BASEURL + '/untag_device'

    args = {
        'userId': 'sljn',
        'token': 'xxx',
        'deviceIds': device_ids,
        'tagNames': tagNames
    }

    do_post(url, args)

def get(url, args=None):
    url = BASEURL + url
    base_args = {
        'userId': '1',
        'token': 'xxx',
    }
    if args: base_args.update(args)

    do_get(url, base_args)

if __name__ == '__main__':
    r = sys.argv[1]

    if r == 'list':
        region_id = '125'
        if len(sys.argv) > 2: region_id = sys.argv[2]
        device_list(region_id)
    elif r == 'count':
        region_id = '125'
        if len(sys.argv) > 2: region_id = sys.argv[2]
        device_count(region_id)
    elif r == 'detail':
        device_id = 'GuangDong_YSMT_SXKH1183'
        if len(sys.argv) > 2: device_id = sys.argv[2]
        device_detail(device_id)
    elif r == 'device_belongs':
        device_id = 'GuangDong_YSMT_SXKH1183'
        if len(sys.argv) > 2: device_id = sys.argv[2]
        device_belongs(device_id)
    elif r == 'baseinfo':
        device_id = 'GuangDong_YSMT_SXKH1183'
        if len(sys.argv) > 2: device_id = sys.argv[2]
        device_baseinfo(device_id)
    elif r == 'driver':
        device_id = 'GuangDong_YSMT_SXKH1183'
        device_id = '阿道夫'
        if len(sys.argv) > 2: device_id = sys.argv[2]
        device_driver(device_id)
    elif r == 'vars':
        device_id = 'GuangDong_YSMT_SXKH1183'
        if len(sys.argv) > 2: device_id = sys.argv[2]
        device_vars(device_id)
    elif r == 'alarm':
        device_id = 'GuangDong_YSMT_SXKH1183'
        if len(sys.argv) > 2: device_id = sys.argv[2]
        device_alarms(device_id)
    elif r == 'overview':
        device_id = 'GuangDong_YSMT_SXKH1183'
        if len(sys.argv) > 2: device_id = sys.argv[2]
        device_overview(device_id)
    elif r == 'flowchart':
        device_id = 'GuangDong_YSMT_SXKH1183'
        if len(sys.argv) > 2: device_id = sys.argv[2]
        device_flowchart(device_id)
    elif r == 'dutycard':
        device_id = 'GuangDong_YSMT_SXKH1183'
        if len(sys.argv) > 2: device_id = sys.argv[2]
        device_dutycard(device_id)
    elif r == 'driver_config':
        driver_id = 'ModbusRTU'
        if len(sys.argv) > 2: driver_id = sys.argv[2]
        device_driver_config(driver_id)
    elif r == 'modify':
        device_id = 'GuangDong_YSMT_SXKH1183'
        if len(sys.argv) > 2: device_id = sys.argv[2]
        modify_device(device_id)
    elif r == 'template':
        device_template()
    elif r == 'device_var_template':
        device_var_template()
    elif r == 'concern':
        device_id = 'GuangDong_YSMT_SXKH1183'
        if len(sys.argv) > 2: device_id = sys.argv[2]
        device_concern(device_id)
    elif r == 'unconcern':
        device_id = 'GuangDong_YSMT_SXKH1183'
        if len(sys.argv) > 2: device_id = sys.argv[2]
        device_unconcern(device_id)
    elif r == 'tag':
        device_ids = ['12311231', '231']
        tagNames = ['ttt', 'ddd']
        tag(device_ids, tagNames)
    elif r == 'untag':
        device_ids = ['12311231', '231']
        tagNames = ['ttt', 'ddd']
        untag(device_ids, tagNames)
    elif r == 'checkPort':
        get('/check_driver_com_port', {'deviceId':'Australia_latrobe_RXRC1015', 'comPort':'COM43'})
    else:
        print 'no command'
