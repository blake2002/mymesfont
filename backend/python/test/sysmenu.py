#! /usr/bin/python
#-*- coding:utf-8 -*-
import sys
import json

from urllib import urlencode
from tornado.httpclient import HTTPRequest, HTTPClient

from hite.mes.test.comm import *

def menu_list(parentId):

    url = BASEURL + '/menu_list'
    args = {
        'userId': '1',
        'token': 'xxx',
        'parentId': parentId
    }

    do_get(url, args)

if __name__ == '__main__':
    r = sys.argv[1]

    if r == 'list':
        parent_id = '-1'
        if len(sys.argv) >= 3: parent_id = sys.argv[2]
        menu_list(parent_id)
    else:
        print 'no command'
