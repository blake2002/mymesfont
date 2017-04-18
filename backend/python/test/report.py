#! /usr/bin/python
#-*- coding:utf-8 -*-
import sys
import json

from urllib import urlencode
from tornado.httpclient import HTTPRequest, HTTPClient

from hite.mes.test.comm import *

def get(url, args=None):

    url = BASEURL + url
    base_args = {
        'userId': '1',
        'token': 'xxx',
    }
    if args: base_args.update(args)

    do_get(url, base_args)


def post(url, args=None):
    url = BASEURL + url
    base_args = {
        'userId': '1',
        'token': 'xxx',
    }
    if args: base_args.update(args)

    do_post(url, base_args)

if __name__ == '__main__':
    r = sys.argv[1]

    if r == 'dirs':
        post('/report_dirs', {"parent": "", "name": "aa"})
    elif r == 'dlist':
        id = sys.argv[2]
        post('/report_designtime_list', {"id": id})
    elif r == 'rlist':
        id = sys.argv[2]
        post('/report_runtime_list', {"id": id})
    elif r == 'create':
        parent = sys.argv[2]
        name = sys.argv[3]
        post('/report_create_dir', {"parent": parent, 'name': name})
    elif r == 'upload':
        post('/report_upload', {"path": '', 'dirId': '11', 'files':})
    else:
        print 'no command'
