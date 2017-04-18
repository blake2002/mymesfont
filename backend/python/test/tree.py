#! /usr/bin/python
#-*- coding:utf-8 -*-
import sys
import json

from urllib import urlencode
from tornado.httpclient import HTTPRequest, HTTPClient

from hite.mes.test.comm import *

def region_tree():

    url = BASEURL + '/region_tree'
    args = {
        'userId': '1',
        'token': 'xxx',
    }

    do_get(url, args)

def search_region_tree():

    url = BASEURL + '/search_region_tree'
    args = {
        'userId': '1',
        'token': 'xxx',
        'searchTarget': 'device',
        'keyword': '1',
        'top': -1,
        'pageIndex': 1,
        'pageSize': 10
    }

    do_get(url, args)

def region_children():

    url = BASEURL + '/region_children'
    args = {
        'userId': '1',
        'token': 'xxx',
        'parentId': '-1'
    }

    do_get(url, args)

def country_options():

    url = BASEURL + '/region_tree_options'
    args = {
        'userId': '1',
        'token': 'xxx',
        'nodeType': 'NSCountrys',
        'pageIndex': 1,
        'pageSize': 15
    }

    do_get(url, args)

def station_options(parent_id):

    url = BASEURL + '/region_tree_options'
    args = {
        'userId': '1',
        'token': 'xxx',
        'nodeType': 'NSStations',
        'parentId': parent_id,
        'pageIndex': 1,
        'pageSize': 15
    }

    do_get(url, args)

def city_options(parent_id):

    url = BASEURL + '/region_tree_options'
    args = {
        'userId': '1',
        'token': 'xxx',
        'nodeType': 'NSCitys',
        'parentId': parent_id,
        'pageIndex': 1,
        'pageSize': 15
    }

    do_get(url, args)

def region_forefather(region_id):

    url = BASEURL + '/region_tree_forefather'
    args = {
        'userId': '1',
        'token': 'xxx',
        'regionId': region_id,
    }

    do_get(url, args)

def search_department_tree():

    url = BASEURL + '/search_department_tree'
    args = {
        'userId': '1',
        'token': 'xxx',
        'keyword': '1',
        'top': -1,
        'pageIndex': 1,
        'pageSize': 10
    }

    do_get(url, args)

def department_tree():

    url = BASEURL + '/department_tree'
    args = {
        'userId': '1',
        'token': 'xxx',
    }

    do_get(url, args)

def department_children():

    url = BASEURL + '/department_children'
    args = {
        'userId': '1',
        'token': 'xxx',
        'parentId': '-1'
    }

    do_get(url, args)

if __name__ == '__main__':
    r = sys.argv[1]

    if r == 'region_tree':
        region_tree()
    if r == 'search1':
        search_region_tree()
    if r == 'search2':
        search_department_tree()
    elif r == 'region_children':
        region_children()
    elif r == 'countrys':
        country_options()
    elif r == 'stations':
        parent_id = sys.argv[2]
        station_options(parent_id)
    elif r == 'citys':
        parent_id = sys.argv[2]
        city_options(parent_id)
    elif r == 'forefather':
        region_id = sys.argv[2]
        region_forefather(region_id)
    elif r == 'department_tree':
        department_tree()
    elif r == 'department_children':
        department_children()
    else:
        print 'no command'
