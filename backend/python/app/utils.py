#! /bin/env python
#-*- coding:utf-8 -*-
import json, sys
import os, base64
import datetime, time, re
from functools import partial

from hite.mes.comm import config


REDIS_DEVICE_UI = 'Global.DeviceUI'

DEVICE_DRIVER_OPTIONS = {
    'ModbusRTU': 'NetSCADA6.RTDB.Drivers.NSModbusRTU',
    'NSSecpTCP': 'NetSCADA6.RTDB.Drivers.NSSecpTCP',
    'OmronHostLink': 'NetSCADA6.RTDB.Drivers.NSOmronHostLink',
    'ModbusTCP': 'NetSCADA6.RTDB.Drivers.NSModbusTCP',
    'NSSiemensS7E-1200': 'NetSCADA6.RTDB.Drivers.NSSiemensS7E',
    'NSSiemensS7E-300': 'NetSCADA6.RTDB.Drivers.NSSiemensS7E',
    'NSSiemensS7E-400': 'NetSCADA6.RTDB.Drivers.NSSiemensS7E',
    'NSSiemensS7E-1500': 'NetSCADA6.RTDB.Drivers.NSSiemensS7E'
}

DEVICE_DRIVER_PLC_OPTIONS = {
    "0": "1200",
    "1": "1500",
    "2": "300",
    "3": "400"
}

def load_device_vars(device_id, version, models):
    sub_vars = []
    dev = config.hget_item(REDIS_DEVICE_UI, device_id)
    if not dev:
        return sub_vars

    dev = json.loads(dev)
    local_version = dev.keys()[0]
    if version != local_version:
        print 'device_id:'+device_id+', version:'+version+', local_version:'+local_version
        return 'device_info_out_of_date'

    device_info = dev.get(local_version)
    model_list = models[:]

    if 'NSDeviceStatusComm' in model_list:
        sub_vars = ["ISRUNNING", "ONLINE"]
        model_list.remove('NSDeviceStatusComm')

    for m in model_list:
        vs = device_info.get(m)
        if not vs: continue
        sub_vars.extend(vs)

    return sub_vars

def get_timestamp():
    stamp = time.time()
    return str(int(stamp))

# 将字符串转换为日期格式
def format_str2timestamp(d, f):
    return datetime.datetime.strptime(d, f)

# 将日期格式转换为字符串
def format_timestamp2str(d, f):
    return d.strftime(f);

# 生成日期时间队列
def genDateLine(start_time, end_time, sp_type='second', sp_value=3, date_format='%Y%m%d%H%M%S'):
    st = format_str2timestamp(start_time, date_format)
    et = format_str2timestamp(end_time, date_format)

    datelist = [st]
    while (True):
        if sp_type == 'second':
            st = st + datetime.timedelta(seconds=3)

        if st >= et: break
        datelist.append(st)
    datelist.append(et)

    datelist = [format_timestamp2str(d, date_format) for d in datelist]
    return datelist

# 整理日期列表
def format_history_value(valist, datelist):
    rlist = []
    dv = 0
    for d in datelist:
        d = format_str2timestamp(d, '%Y%m%d%H%M%S')
        for va in valist:
            t = va.keys()[0]
	    tf = format_str2timestamp(t[:-4], '%Y-%m-%d %H:%M:%S')
            print d, tf
	    if (d - tf).seconds <= 3:
                dv = va[t]
                rlist.append(dv)
                break
        rlist.append(dv)

    return rlist

# 获取tail=true的节点信息
def loadTreeNodeByTailisTrue(boTree, groupName):
    tailList = []

    if isinstance(boTree, dict):
        groups = boTree.get(groupName)
        if groups is None: return

        if groups['Tail'] is True: tailList.append(groups['ID'])
        if groupName in groups:
            l = loadTreeNodeByTailisTrue(groups[groupName], groupName)
            if l is not None: tailList.extend(l)

    elif isinstance(boTree, list):
        for g in boTree:
            if g['Tail'] is True: tailList.append(g['ID'])

        if groupName in g:
            l = loadTreeNodeByTailisTrue(g[groupName], groupName)
            if l is not None: tailList.extend(l)

    return tailList

if __name__ == '__main__':
    t = { u'Area': { u'Enable': u'true', u'Name': u'\u5730\u7403', u'zh_CN': u'\u5730\u7403', u'Area': [{ u'Enable': u'true', u'Name': u'\u4e2d\u56fd', u'zh_CN': u'\u4e2d\u56fd', u'Area': [{ u'Enable': u'true', u'Name': u'\u5e7f\u4e1c\u7701', u'zh_CN': u'\u5e7f\u4e1c', u'Area': [{ u'Enable': u'true', u'Name': u'\u63ed\u9633\u5e02', u'zh_CN': u'\u63ed\u9633\u5e02', u'Tail': True, u'Role': u'shiwjTest;', u'en_US': u'jieyangshi', u'Type': u'NSCitys', u'ID': u'150' }], u'Tail': False, u'en_US': u'GuangDong', u'Type': u'NSStations', u'ID': u'129' }, { u'Enable': u'true', u'Name': u'\u5b89\u5fbd\u7701', u'zh_CN': u'\u5b89\u5fbd\u7701', u'Area': [{ u'Enable': u'true', u'Name': u'\u5b89\u5e86\u5e02', u'zh_CN': u'\u5b89\u5e86\u5e02', u'Tail': True, u'Role': u'shiwjTest;', u'en_US': u'anqingshi', u'Type': u'NSCitys', u'ID': u'85' }], u'Tail': False, u'en_US': u'anhuisheng', u'Type': u'NSStations', u'ID': u'59' }, { u'Enable': u'true', u'Name': u'\u7518\u8083\u7701', u'zh_CN': u'\u7518\u8083\u7701', u'Area': [{ u'Enable': u'true', u'Name': u'\u5170\u5dde\u5e02', u'zh_CN': u'\u5170\u5dde\u5e02', u'Area': [{ u'Enable': u'true', u'Name': u'\u5170\u5927\u4e8c\u9662', u'zh_CN': u'', u'Tail': True, u'Role': u'shiwjTest;', u'en_US': u'', u'Type': u'NSCompanys', u'ID': u'659' }], u'Tail': False, u'en_US': u'lanzhoushi', u'Type': u'NSCitys', u'ID': u'617' }], u'Tail': False, u'en_US': u'gansusheng', u'Type': u'NSStations', u'ID': u'610' }, { u'Enable': u'true', u'Name': u'\u5317\u4eac\u5e02', u'zh_CN': u'\u5317\u4eac', u'Area': [{ u'Enable': u'true', u'Name': u'\u5317\u4eac\u5e02', u'zh_CN': u'\u5317\u4eac\u5e02', u'Area': [{ u'Enable': u'true', u'Name': u'\u5317\u4eac\u535a\u5927\u5f00\u62d3\u70ed\u529b', u'zh_CN': u'', u'Tail': True, u'Role': u'shiwjTest;', u'en_US': u'', u'Type': u'NSCompanys', u'ID': u'121' }], u'Tail': False, u'en_US': u'beijingshi', u'Type': u'NSCitys', u'ID': u'87' }], u'Tail': False, u'en_US': u'BeiJing', u'Type': u'NSStations', u'ID': u'86' }], u'Tail': False, u'en_US': u'China', u'Type': u'NSCountrys', u'ID': u'58' }], u'Tail': False, u'en_US': u'Earth', u'Type': u'NSPlanets', u'ID': u'-1' } }
    l = loadTreeNodeByTailisTrue(t, 'Area')
    print l
    print json.dumps(l)

    '''
    datelist = genDateLine('20160209000000', '20160210235959')
    print datelist

    f = open('/home/sljn/hiteInstall/fuanda/hite/app/ttt.txt', 'r')
    lines = f.readlines()
    f.close()

    val = json.loads(lines[0])
    result_list = {}
    for k, v in val.get('DeviceVarValues').items():
        for d in v:
       	    for k1, v1 in d.items():
                if k1 not in ('PageIndex', 'PageSize', 'TotalNum'):
                    print k1
                    result_list[k1] = format_history_value(v1, datelist)
    print result_list
    '''
