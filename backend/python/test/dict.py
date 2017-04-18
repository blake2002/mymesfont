#! /usr/bin/python
#-*- coding:utf-8 -*-
import sys
import json

from urllib import urlencode
from tornado.httpclient import HTTPRequest, HTTPClient

from hite.mes.test.comm import *

def template():

    url = BASEURL + '/sys/dict_template'
    args = {
        'userId': 'sljn',
        'token': 'xxx',
    }

    do_get(url, args)

def add():

    url = BASEURL + '/sys/new_dict'
    args = {
        'userId': 'sljn',
        'token': 'xxx',
        'props': [
            {
                "Key": "xx",
                "Value": "xx",
                "Type": "111",
                "Description": "xxx",
                "OrderbyIndex": "0"
            }
        ]
    }

    do_post(url, args)

def modify():

    url = BASEURL + '/sys/modified_dict'
    args = {
        'userId': 'sljn',
        'token': 'xxx',
        'props': [
            {
                "Key": "xx",
                "Type": "111",
                "Modified": {
                    "Key": "222",
                    "Value": "222",
                    "Description": "222",
                }
            }
        ]
    }

    do_post(url, args)

def delete():

    url = BASEURL + '/sys/delete_dict'
    args = {
        'userId': 'sljn',
        'token': 'xxx',
        'dicts':[
            {
                "Key": '222',
                'Type': '111'
            }
        ]
    }

    do_post(url, args)

if __name__ == '__main__':
    r = sys.argv[1]

    url = BASEURL
    args = {
        'token': 'xxx'
    }

    if r == 'list':
        url += '/sys/dict_list'
        args['pageIndex'] = 1
        args['pageSize'] = 15

        do_get(url, args)
    elif r == 'add':
        add()
    elif r == 'modify':
        modify()
    elif r == 'delete':
        delete()
    elif r == 'template':
        template()
    else:
        print 'no command'

