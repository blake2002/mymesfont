#! /usr/bin/python
#-*- coding:utf-8 -*-
import sys
import json

from urllib import urlencode
from tornado.httpclient import HTTPRequest, HTTPClient

from hite.mes.test.comm import *

def user_list(keyword=''):

    url = BASEURL + '/user_list'
    args = {
        'userId': '1',
        'token': 'xxx',
        'departmentId': -1,
        'cateFilter': 'all',
        'keyword': keyword,
        'pageIndex': 1,
        'pageSize': 10
    }

    do_get(url, args)

def user_count():

    url = BASEURL + '/user_count'
    args = {
        'userId': '1',
        'token': 'xxx',
        'departmentId': '-1'
    }

    do_get(url, args)

def user_detail(user_id):

    url = BASEURL + '/user_detail'
    args = {
        'userId': '1',
        'token': 'xxx',
        'deptUserId': user_id
    }

    do_get(url, args)

def user_belongs():

    url = BASEURL + '/user_belongs'
    args = {
        'userId': '1',
        'token': 'xxx',
        'deptUserId': 'ttt'
    }

    do_get(url, args)

def add_user(user_id):

    url = BASEURL + '/new_user'
    props = [
        {
            'ParameterName': 'UserID',
            'ParameterValue': user_id
        },
        {
            'ParameterName': 'Name',
            'ParameterValue': user_id
        },
        {
            'ParameterName': 'PassWord',
            'ParameterValue': '111'
        },
        {
            'ParameterName': 'Enable',
            'ParameterValue': 'true'
        },
        {
            'ParameterName': 'Tel',
            'ParameterValue': '11'
        },
        {
            'ParameterName': 'Email',
            'ParameterValue': '11'
        },
        {
            'ParameterName': 'WeixinID',
            'ParameterValue': '11'
        },
        {
            'ParameterName': 'EnableMessage',
            'ParameterValue': 'true'
        },
        {
            'ParameterName': 'EnableEmail',
            'ParameterValue': 'true'
        },
        {
            'ParameterName': 'EnableWeixin',
            'ParameterValue': 'true'
        },
        {
            'ParameterName': 'NO',
            'ParameterValue': '111'
        }
    ]
    args = {
        'userId': 'sljn',
        'token': 'xxx',
        'departmentId': '-1',
        'props': {"NSUsers":props}
    }

    do_post(url, args)

def modify_user(user_id):

    url = BASEURL + '/modified_user'
    props = [
        {
            'ParameterName': 'Enable',
            'ParameterValue': 'false'
        },
        {
            'ParameterName': 'Tel',
            'ParameterValue': '222'
        },
        {
            'ParameterName': 'Email',
            'ParameterValue': '222'
        },
        {
            'ParameterName': 'Top',
            'ParameterValue': '1'
        }

    ]
    args = {
        'userId': 'sljn',
        'token': 'xxx',
        'deptUserId': user_id,
        'props': {"NSUsers":props}
    }

    do_post(url, args)

def delete_user(user_id):

    url = BASEURL + '/delete_user'
    args = {
        'userId': 'sljn',
        'token': 'xxx',
        'deptUserIds': [user_id],
    }

    do_post(url, args)

def template():

    url = BASEURL + '/user_template'
    args = {
        'userId': '1',
        'token': 'xxx',
    }

    do_get(url, args)

def append(user_id, dept_id):

    url = BASEURL + '/user_belongs'
    args = {
        'userId': 'sljn',
        'token': 'xxx',
        'deptUserIds': [user_id],
        'departmentId': dept_id,
        'operate': 'append'
    }

    do_post(url, args)

def remove(user_id, dept_id):

    url = BASEURL + '/user_belongs'
    args = {
        'userId': 'sljn',
        'token': 'xxx',
        'deptUserIds': [user_id],
        'departmentId': dept_id,
        'operate': 'remove'
    }

    do_post(url, args)


if __name__ == '__main__':
    r = sys.argv[1]

    if r == 'list':
        keyword = ''
        if len(sys.argv) > 2:
            keyword = sys.argv[2]
        user_list(keyword)
    elif r == 'count':
        user_count()
    elif r == 'belongs':
        user_belongs()
    elif r == 'detail':
        user_id = sys.argv[2]
        user_detail(user_id)
    elif r == 'template':
        template()
    elif r == 'add':
        user_id = sys.argv[2]
        add_user(user_id)
    elif r == 'modify':
        user_id = sys.argv[2]
        modify_user(user_id)
    elif r == 'delete':
        user_id = sys.argv[2]
        delete_user(user_id)
    elif r == 'append':
        user_id = sys.argv[2]
        dept_id = sys.argv[3]
        append(user_id, dept_id)
    elif r == 'remove':
        user_id = sys.argv[2]
        dept_id = sys.argv[3]
        remove(user_id, dept_id)
    else:
        print 'no command'
