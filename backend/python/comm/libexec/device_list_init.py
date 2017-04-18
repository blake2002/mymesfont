#! /bin/env python
#-*- coding:utf-8 -*-
import os, sys, json

from fuanda.hite import config

'''
{
    "device_id_1": {
        "V1.0": {
            "NSDeviceUIOverview": ["变量名@RelatedVar", ""], //概览
            "NSDeviceUIRunState": ["", ""], //运行状态
            "NSDeviceUIFault": ["", ""], //机组故障
            "NSDeviceUIParam": ["", ""], //机组参数
            "NSDeviceUIRTChart": ["", ""], //实时曲线
            "NSDeviceUIHisChart": ["", ""], //历史曲线
        },
        "V2.0": {
            ...
        },
        ...
    },
    "device_id_2": {
        ...
    }
    ...
}
'''

DEFAULT_DEVICE_PARAMS_TYPE = ['NSDeviceUIOverview', 'NSDeviceUIRunState', 'NSDeviceUIFault', 'NSDeviceUIParam', 'NSDeviceUIRTChart', 'NSDeviceUIHisChart']

def load_base_config():
    global GLOBAL_DEVICE_LIST

    print 'loading base config ...'
    GLOBAL_DEVICE_LIST = {}

    project_dir = config.project_dir

    file_dir = project_dir+'NSDevicesInfo/Default'
    for dr in os.listdir(file_dir):
        #print root, dirs, files
        device_id = dr
        for d in os.listdir(file_dir+'/'+dr):
            device_v = d
            with open(file_dir+'/'+dr+'/'+d+'/DeviceInfo.json') as jsonfile:
                json_data = json.load(jsonfile)
                print json_data
                for key in json_data: pass
            break
        break

    print 'complete!'

if __name__ == '__main__':

    load_base_config()
