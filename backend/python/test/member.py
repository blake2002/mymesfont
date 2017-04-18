#! /usr/bin/python
#-*- coding:utf-8 -*-
import sys
import json

from urllib import urlencode
from tornado.httpclient import HTTPRequest, HTTPClient

from hite.mes.test.comm import *

def member_list():

    url = BASEURL + '/member_list'
    args = {
        'userId': 'sljn',
        'token': 'xxx',
        'regionId': '130',
        'cateFilter': 'all',
        'pageIndex': 1,
        'pageSize': 10
    }

    do_get(url, args)

def member_count():

    url = BASEURL + '/member_count'
    args = {
        'userId': 'sljn',
        'token': 'xxx',
        'regionId': 130,
    }

    do_get(url, args)

def member_detail():

    url = BASEURL + '/member_detail'
    args = {
        'userId': 'sljn',
        'token': 'xxx',
        'memberId': 'ttt'
    }

    do_get(url, args)

def member_belongs():

    url = BASEURL + '/member_belongs'
    args = {
        'userId': '1',
        'token': 'xxx',
        'memberId': 'sljn'
    }

    do_get(url, args)

def template():

    url = BASEURL + '/user_template'
    args = {
        'userId': '1',
        'token': 'xxx',
    }

    do_get(url, args)

def concerned(member_id):

    url = BASEURL + '/concern_member'
    args = {
        'userId': 'sljn',
        'token': 'xxx',
        'memberId': member_id
    }

    do_post(url, args)

def append(member_id, region_id):

    url = BASEURL + '/member_belongs'
    args = {
        'userId': 'sljn',
        'token': 'xxx',
        'operate': 'append',
        'regionId': region_id,
        'memberIds': [member_id]
    }

    do_post(url, args)

def remove(member_id, region_id):

    url = BASEURL + '/member_belongs'
    args = {
        'userId': 'sljn',
        'token': 'xxx',
        'operate': 'remove',
        'regionId': region_id,
        'memberIds': [member_id]
    }

    do_post(url, args)


if __name__ == '__main__':
    r = sys.argv[1]

    if r == 'list':
        member_list()
    elif r == 'count':
        member_count()
    elif r == 'belongs':
        member_belongs()
    elif r == 'detail':
        member_detail()
    elif r == 'template':
        template()
    elif r == 'concern':
        member_id = sys.argv[2]
        concerned(member_id)
    elif r == 'append':
        member_id = sys.argv[2]
        region_id = sys.argv[3]
        append(member_id, region_id)
    elif r == 'remove':
        member_id = sys.argv[2]
        region_id = sys.argv[3]
        remove(member_id, region_id)
    else:
        print 'no command'
