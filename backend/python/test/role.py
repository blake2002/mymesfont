#! /usr/bin/python
#-*- coding:utf-8 -*-
import sys
import json

from urllib import urlencode
from tornado.httpclient import HTTPRequest, HTTPClient

from hite.mes.test.comm import *

def role_list():

    url = BASEURL + '/sys/role_list'
    args = {
        'userId': 'shiwj',
        'token': 'xxx',
        'pageIndex': 1,
        'pageSize': 10
    }

    do_get(url, args)

def template():

    url = BASEURL + '/sys/role_template'
    args = {
        'userId': 'shiwj',
        'token': 'xxx',
    }

    do_get(url, args)

def listtemplate():

    url = BASEURL + '/sys/role_list_template'
    args = {
        'userId': 'shiwj',
        'token': 'xxx',
    }

    do_get(url, args)

def detail(role_id):

    url = BASEURL + '/sys/role_detail'
    args = {
        'userId': 'shiwj',
        'token': 'xxx',
        'roleId': role_id
    }

    do_get(url, args)

def add():

    url = BASEURL + '/sys/add_role'
    args = {
        'userId': 'shiwj',
        'token': 'xxx',
        'props': {
            'Roles':[
                {
                    'ParameterName': 'ID',
                    'ParameterValue': 'superUser'
                },
                {
                    'ParameterName': 'Name',
                    'ParameterValue': 'superUser'
                },
                {
                    'ParameterName': 'Enable',
                    'ParameterValue': 'true'
                },
                {
                    'ParameterName': 'Area',
                    'ParameterValue': ['-1']
                },
                {
                    'ParameterName': 'Organization',
                    'ParameterValue': ['-1']
                },
            ]
        }
    }

    do_post(url, args)

def modify():

    url = BASEURL + '/sys/modified_role'
    args = {
        'userId': 'shiwj',
        'token': 'xxx',
        'roleId': 'shiwjTest',
        'props': {
            'Roles':[
                {
                    'ParameterName': 'Area',
                    'ParameterAddValue': ['25']
                },
                {
                    'ParameterName': 'Organization',
                    'ParameterAddValue': ['f2497a69-e27a-464a-bee6-a38ad549515b']
                },
            ]
        }
    }

    do_post(url, args)

def delete():

    url = BASEURL + '/sys/delete_role'
    args = {
        'userId': 'shiwj',
        'token': 'xxx',
        'roleIds': ['aaa', 'bbbb'],
    }

    do_post(url, args)

def get_menu_auth():

    url = BASEURL + '/sys/role_auth_for_menu'
    args = {
        'userId': 'shiwj',
        'token': 'xxx',
        'roleId': 'shiwjTest',
    }

    do_get(url, args)

def post_menu_auth():

    url = BASEURL + '/sys/role_auth_for_menu'
    args = {
        'userId': 'shiwj',
        'token': 'xxx',
        'roleId': 'shiwjTest',
        'addMenuIds': ["DeviceList", "MemberList", "MoveDownFromRegionTree", "AddChildrenFromDepartmentTree", "ModifyFromDepartmentTree",                             "DeleteFromDepartmentTree", "MoveUpFromDepartmentTree", "MoveDownFromDepartmentTree", "ModifyDeviceBtn", "EnableDeviceBtn",                    "DeviceProperty", "NewDevice", "NewDeviceBtn", "DeviceUIConfig", "DeleteDevice", "MoveDevice", "AddMember", "RemoveMember", "MoveMember",      "AddUserBtn", "ModifyUserBtn", "DeleteUserBtn", "EnableUserBtn", "MoveUserBtn", "NewUser", "ModifyUser", "NSDevices", "NSDevicesDriver",       "NSDevicesVarInfo", "NSDevicesAlarmInfo", "NSDeviceUIOverview1", "NSDeviceUIRunState1", "NSDeviceUIFault1", "NSDeviceUIParam1",                "NSDeviceFlowChart1", "NSDutyCard1", "NewDeviceSaveBtn", "NSDeviceUIOverview", "NSDeviceUIRunState", "NSDeviceUIFault", "NSDeviceUIParam", "NSDeviceFlowChart", "NSDutyCard", "NewUserSaveBtn", "UserSaveBtn", "NSDeviceSaveBtn", "NSDevicesDriverAddBtn",                                "NSDevicesDriverRemoveBtn", "NSDevicesDriverLogicDeviceAddBtn", "NSDevicesDriverLogicDeviceRemoveBtn", "NSDevicesDriverDataBlockAddBtn",       "NSDevicesDriverDataBlockRemoveBtn", "NSDevicesDriverSaveBtn", "NSDevicesVarInfoAddBtn", "NSDevicesVarInfoDeleteBtn", "NSDevicesVarInfoMoveUpBtn", "NSDevicesVarInfoMoveDownBtn", "NSDevicesVarInfoMoveSaveBtn", "NSDevicesAlarmInfoAddBtn",                         "NSDevicesAlarmInfoDeleteBtn", "NSDevicesAlarmInfoMoveUpBtn", "NSDevicesAlarmInfoMoveDownBtn", "NSDevicesAlarmInfoMoveSaveBtn",                "NSDeviceUIOverviewAddBtn", "NSDeviceUIOverviewRemoveBtn", "NSDeviceUIOverviewMoveUpBtn", "NSDeviceUIOverviewMoveDownBtn",                     "NSDeviceUIOverviewSaveBtn", "NSDeviceUIRunStateAddBtn", "NSDeviceUIRunStateRemoveBtn", "NSDeviceUIRunStateMoveUpBtn",                         "NSDeviceUIRunStateMoveDownBtn", "NSDeviceUIRunStateSaveBtn", "NSDeviceUIFaultAddBtn", "NSDeviceUIFaultRemoveBtn",                             "NSDeviceUIFaultMoveUpBtn", "NSDeviceUIFaultMoveDownBtn", "NSDeviceUIFaultSaveBtn", "NSDeviceUIParamAddBtn", "NSDeviceUIParamRemoveBtn",       "NSDeviceUIParamMoveUpBtn", "NSDeviceUIParamMoveDownBtn", "NSDeviceUIParamSaveBtn", "NSDeviceFlowChartAddBtn",                                 "NSDeviceFlowChartRemoveBtn", "NSDeviceFlowChartMoveUpBtn", "NSDeviceFlowChartMoveDownBtn", "NSDeviceFlowChartSaveBtn",                        "NSDutyCardAddBtn", "NSDutyCardRemoveBtn", "NSDutyCardSaveBtn", "DeviceManager", "AddChildrenFromRegionTree", "NewUserBtn",                    "MoveUpFromRegionTree", "UserManager", "OrgManager", "DeleteFromRegionTree"],
        'removeMenuIds': ''
    }

    do_post(url, args)

def privilege():

    url = BASEURL + '/privileges'
    args = {
        'userId': 'shiwj',
        'token': 'xxx',
        'roleId': 'shiwjTest',
    }

    do_get(url, args)

if __name__ == '__main__':
    r = sys.argv[1]

    if r == 'list':
        role_list()
    elif r == 'template':
        template()
    elif r == 'listtemplate':
        listtemplate()
    elif r == 'detail':
        role_id = sys.argv[2]
        detail(role_id)
    elif r == 'add':
        add()
    elif r == 'modify':
        modify()
    elif r == 'delete':
        delete()
    elif r == 'menu_auth':
        get_menu_auth()
    elif r == 'post_menu_auth':
        post_menu_auth()
    elif r == 'privilege':
        privilege()
    else:
        print 'no command'
