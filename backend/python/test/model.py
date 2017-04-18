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
        'userId': 'shiwj',
        'token': 'xxx',
    }
    if args: base_args.update(args)

    do_get(url, base_args)


def post(url, args=None):
    url = BASEURL + url
    base_args = {
        'userId': 'shiwj',
        'token': 'xxx',
    }
    if args: base_args.update(args)

    do_post(url, base_args)

if __name__ == '__main__':
    r = sys.argv[1]

    tModelName = '555'
    tFirstNode = '555555'

    if r == 'syslist':
        get('/system_model_list')
    elif r == 'cuslist':
        get('/custom_model_list')
    elif r == 'template':
        get('/model_template')
    elif r == 'index_template':
        get('/model_nodeindex_template')
    elif r == 'node_template':
        get('/custom_model_node_template')
    elif r == 'detail':
        get('/model_detail', {'modelName': tModelName})
    elif r == 'new_model':
        post('/new_model', {'modelName': tModelName, 'category': 'custom'})
    elif r == 'delete_model':
        post('/delete_model', {'modelName': tModelName})
    elif r == 'modify_model':
        props = {
            "Models": [
                {
                    'ParameterName': 'DataSourceType',
                    'ParameterValue': 'NOSQL'
                }
            ]
        }
        post('/modify_model', {'modelName': tModelName, 'props': props})
    elif r == 'node_detail':
        get('/model_node_detail', {'modelName': tModelName, 'nodeName': tFirstNode})
    elif r == 'new_node':
        post('/new_model_node', {
            'modelName': tModelName,
            'parentName': tModelName,
            'nodeName':tFirstNode
        })
    elif r == 'modify_node':
        props = {
            "ModelNodes": [
                {
                    'ParameterName': 'Description',
                    'ParameterValue': 'ccccc'
                }
            ]
        }
        post('/modify_model_node', {'modelName': tModelName, 'nodeName': tFirstNode, 'props': props})
    elif r == 'delete_node':
        post('/delete_model_node', {'modelName': tModelName, 'nodeName': tFirstNode})
    elif r == 'nodeindex':
        get('/model_nodeindex', {'modelName': tModelName, 'nodeName': tFirstNode})
    elif r == 'upsert_node_index':
        props = [
            {
                'Name': '属性1',
                'Unique': 'true',
                'Global': 'false',
                'Properties': []
            },
            {
                'Name': '属性2',
                'Unique': 'true',
                'Global': 'false',
                'Properties': []
            }
        ]
        post('/upsert_model_nodeindex', {'modelName': tModelName, 'nodeName': tFirstNode, 'props': props})
    elif r == 'nodeindexproperty':
        get('/model_nodeindex_property', {'modelName': tModelName, 'nodeName': tFirstNode})
    elif r == 'nodeproperty':
        get('/model_node_property', {'modelName': tModelName, 'nodeName': tFirstNode})
    elif r == 'upsert_node_property':
        props = [
            {
                'Name': '字段1',
                'Description': 'zizizi1',
                'DataType': 'float',
                'DefaultValue': '1',
                'IsPrimaryKey': 'true',
                'Nullable': 'true',
                'ReadOnly': 'false',
                'Queryable': 'false',
                'QueryType': '=',
                'OrderPriority': '1'
            },
            {
                'Name': '字段2',
                'Description': 'zizizi2',
                'DataType': 'float',
                'DefaultValue': '1',
                'IsPrimaryKey': 'true',
                'Nullable': 'true',
                'ReadOnly': 'false',
                'Queryable': 'false',
                'QueryType': '=',
                'OrderPriority': '2'
            }
        ]
        post('/upsert_model_node_property', {'modelName': tModelName, 'nodeName': tFirstNode, 'props': props})
    elif r == 'cluster_state':
        get('/model_cluster_state_list')

    elif r == 'cluster_state_node':
        node_id = sys.argv[2]
        get('/model_cluster_node_state', {'clusterNodeId': node_id, 'pageIndex':1, 'pageSize':10})
    elif r == 'cluster_template':
        get('/model_cluster_state_template')
    elif r == 'cluster_node_template':
        get('/model_cluster_node_state_template')
    elif r == 'related_node_options':
        get('/model_related_node_options', {'modelType': 'system', 'modelName': '555'})
    else:
        print 'no command'
