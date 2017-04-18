#! /usr/bin/python
#-*- coding:utf-8 -*-
import sys
import json

from urllib import urlencode
from tornado.httpclient import HTTPRequest, HTTPClient

from hite.mes.test.comm import *

def list():

    url = BASEURL + '/tag_list'
    args = {
        'userId': 'sljn',
        'token': 'xxx',
        'category': 'device',
        'pageIndex': 1,
        'pageSize': 15
    }

    do_get(url, args)

def device_list(tagName):

    url = BASEURL + '/tag_device_list'
    args = {
        'userId': 'sljn',
        'token': 'xxx',
        'tagName': tagName,
        'pageIndex': 1,
        'pageSize': 15
    }

    do_get(url, args)

def member_list(tagName):

    url = BASEURL + '/tag_member_list'
    args = {
        'userId': 'sljn',
        'token': 'xxx',
        'tagName': tagName,
        'pageIndex': 1,
        'pageSize': 15
    }

    do_get(url, args)

def add(tagName):

    url = BASEURL + '/new_tag'
    args = {
        'userId': 'sljn',
        'token': 'xxx',
        'tagName': tagName
    }

    do_post(url, args)

def modify(tagName, newTagName):

    url = BASEURL + '/modified_tag'
    args = {
        'userId': 'sljn',
        'token': 'xxx',
        'tagName': tagName,
        'newTagName': newTagName,
    }

    do_post(url, args)

def delete(tagName):

    url = BASEURL + '/delete_tag'
    args = {
        'userId': 'sljn',
        'token': 'xxx',
        'tagName': tagName
    }

    do_post(url, args)

if __name__ == '__main__':
    r = sys.argv[1]

    if r == 'list':
        list()
    elif r == 'add':
        tagName = sys.argv[2]
        add(tagName)
    elif r == 'modify':
        tagName = sys.argv[2]
        newTagName = sys.argv[3]
        modify(tagName, newTagName)
    elif r == 'delete':
        tagName = sys.argv[2]
        delete(tagName)
    elif r == 'device_list':
        tagName = sys.argv[2]
        device_list(tagName)
    elif r == 'member_list':
        tagName = sys.argv[2]
        member_list(tagName)
    else:
        print 'no command'
