#! /usr/bin/python
#-*- coding:utf-8 -*-
import sys
import json

from urllib import urlencode
from tornado.httpclient import HTTPRequest, HTTPClient

BASEURL = 'http://localhost:8020/mes_manager_api'

def do_print(data):
    print 'response:'
    print json.dumps(data, indent=1)


def do_get(url, args):

    if args:
        args = [k + '=' + str(v) for k,v in args.items()]
        url = url + '?' + '&'.join(args)

    http_client = HTTPClient()
    print 'Get request: %s' % url
    request = HTTPRequest(url=url, method='GET')

    response = http_client.fetch(request)
    result = json.loads(response.body)
    do_print(result)

def do_post(url, args):

    http_client = HTTPClient()
    print 'Post request: %s' % url
    args = json.dumps(args)
    print 'Post arguments: %s' % args
    request = HTTPRequest(url=url, method='POST', body=args, headers={"Content-Type":"application/json", "Content-Length": len(args)})

    response = http_client.fetch(request)
    result = json.loads(response.body)
    do_print(result)

def group_options():

    url = BASEURL + '/dict_options'
    args = {
        'userId': '1',
        'token': 'xxx',
        'categroy': 'group'
    }

    do_get(url, args)

def flowchart_options():

    url = BASEURL + '/dict_options'
    args = {
        'userId': '1',
        'token': 'xxx',
        'categroy': 'flowchart'
    }

    do_get(url, args)

def driver_options():

    url = BASEURL + '/dict_options'
    args = {
        'userId': '1',
        'token': 'xxx',
        'categroy': 'driver'
    }

    do_get(url, args)

def duty_options():

    url = BASEURL + '/dict_options'
    args = {
        'userId': '1',
        'token': 'xxx',
        'categroy': 'duty_type'
    }

    do_get(url, args)

def test_api():

    url = BASEURL + '/test_api'
    args = {
        'userId': '1',
        'token': 'xxx',
    }

    do_get(url, args)

if __name__ == '__main__':
    r = sys.argv[1]
    if r == 'group': group_options()
    elif r == 'flowchart': flowchart_options()
    elif r == 'driver': driver_options()
    elif r == 'duty': duty_options()
    elif r == 'test': test_api()

