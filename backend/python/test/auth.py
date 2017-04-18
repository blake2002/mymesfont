#! /usr/bin/python
#-*- coding:utf-8 -*-
import sys
import json

from urllib import urlencode
from tornado.httpclient import HTTPRequest, HTTPClient

from hite.mes.test.comm import *

def login(username, password):

    url = BASEURL + '/login'
    args = {
        'username': username,
        'password': password,
        'token': 'xxx'
    }

    do_post(url, args)

def t():

    url = BASEURL + '/t'
    args = {
        'token': 'xxx'
    }

    do_get(url, args)

if __name__ == '__main__':
    r = sys.argv[1]

    if r == 'login':
        login(sys.argv[2], sys.argv[3])
    elif r == 't':
        t()
    else:
        print 'no command'
