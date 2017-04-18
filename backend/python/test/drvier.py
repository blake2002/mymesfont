#! /usr/bin/python
#-*- coding:utf-8 -*-
import sys
import json

from urllib import urlencode
from tornado.httpclient import HTTPRequest, HTTPClient

from hite.mes.test.comm import *

def remove_driver(device_id, id):

    url = BASEURL + '/modified_device_driver'
    args = {
        'userId': '1',
        'token': 'xxx',
        'device_id': device_id,
        'itemIds': [id],
    }

    do_post(url, args)

if __name__ == '__main__':
    r = sys.argv[1]

    if r == 'remove':
        device_id = 'GuangDong_YSMT_SXKH1183'
        driver_id = sys.argv[2]
        if len(sys.argv) > 3:
            device_id = sys.argv[3]
        remove_driver(device_id, driver_id)
    else:
        print 'no command'
