#! /bin/env python
#-*- coding:utf-8 -*-
import json, sys, urllib
import os, base64, datetime
from functools import partial

from tornado.gen import coroutine

from hite.mes.comm import config
from hite.mes.comm.log import logger

from hite.mes.comm.handler import HiteHandler, HandlerError

from hite.mes.comm import utils
from hite.mes.comm.DataModelApi import region as region_api

from hite.mes.app.utils import DEVICE_DRIVER_PLC_OPTIONS, DEVICE_DRIVER_OPTIONS


# 配置管理平台: 新增设备驱动
class AddNewDeviceDriver(HiteHandler):
    @coroutine
    def post(self):
        try:
            self.post_init('_ID', 'props', 'categroy')

            self.driver_props = self.props.get(self.categroy)
            self.props_content = []

            # 组织请求结构体
            for driver in self.driver_props:
                driver_id = driver.get('_ID')
                if driver_id is None:
                    driver_id = utils.gen_unique_id()
                    self.props_content.append({
                        'Type': 'Add',
                        'Position': self._ID,
                        'NodeType': self.categroy,
                        'Props': {
                            'DriverID': driver['DriverID'],
                            '_ID': driver_id
                        }
                    })
                logic_device_list = driver.get('NSDriverLogicDevice')
                for logic_device in logic_device_list:
                    logic_device_id = logic_device.get('_ID')
                    if logic_device_id is None:
                        logic_device_id = utils.gen_unique_id()
                        self.props_content.append({
                            'Type': 'Add',
                            'Position': driver_id,
                            'NodeType': 'NSDriverLogicDevice',
                            'Props': {
                                'DriverDeviceID': logic_device['DriverDeviceID'],
                                '_ID': logic_device_id
                            }
                        })
                    # 通讯参数
                    communicate_params = logic_device.get('NSDevicesCommunicateParameter')
                    for c_param in communicate_params:
                        if '_ID' not in c_param:
                            self.props_content.append({
                                'Type': 'Add',
                                'Position': logic_device_id,
                                'NodeType': 'NSDevicesCommunicateParameter',
                                'Props': {
                                    '_ID': utils.gen_unique_id(),
                                    'ParameterName': c_param['ParameterName'],
                                    'ParameterValue': c_param['ParameterValue']

                                }
                            })
                    # 数据块
                    communicate_datablocks = logic_device.get('NSDevicesCommunicateDataBlock')
                    for c_datablock in communicate_datablocks:
                        datablock_id = c_datablock.get('_ID')
                        if datablock_id is None:
                            datablock_id = utils.gen_unique_id()
                            self.props_content.append({
                                'Type': 'Add',
                                'Position': logic_device_id,
                                'NodeType': 'NSDevicesCommunicateDataBlock',
                                'Props': {
                                    'DataBlockID': c_datablock.get('DataBlockID'),
                                    '_ID': datablock_id
                                }
                            })
                            # 数据块参数
                            datablock_params = c_datablock.get('NSDevicesCommunicateDataBlockParameter')
                            for d_param in datablock_params:
                                if '_ID' not in d_param:
                                    self.props_content.append({
                                        'Type': 'Add',
                                        'Position': datablock_id,
                                        'NodeType': 'NSDevicesCommunicateDataBlockParameter',
                                        'Props': {
                                            '_ID': utils.gen_unique_id(),
                                            'ParameterName': d_param['ParameterName'],
                                            'ParameterValue': d_param['ParameterValue']
                                        }
                                    })

            oMsg = yield self.genResult('dm', region_api.modifyDeviceDriver(self._ID, self.props_content))

            self.send(self.SUCCESS)

        except HandlerError as e:
            self._send(e.json_msg)

# 配置管理平台: 修改设备驱动
class ModifyDeviceDriver(HiteHandler):
    @coroutine
    def post(self):
        try:
            self.post_init('_ID', 'props', 'deviceId')
            self.props_content = []

            for p in self.props:
                if p.get('ParameterName') in ("DriverDeviceID", "DataBlockID"):
                    self.props_content.append({
                        'Type': 'Modify',
                        'Position': p.pop('_ID'),
                        'Props': {p.get('ParameterName'): p.get('ParameterValue')}
                    })
                else:
                    self.props_content.append({
                        'Type': 'Modify',
                        'Position': p.pop('_ID'),
                        'Props': p
                    })
            oMsg = yield self.genResult('dm', region_api.modifyDeviceDriver(self._ID, self.props_content))
            self.send(self.SUCCESS)

        except HandlerError as e:
            self._send(e.json_msg)

# 配置管理平台: 删除设备驱动
class DeleteDeviceDriver(HiteHandler):
    @coroutine
    def post(self):
        try:
            self.post_init('_ID', 'itemIds', 'deviceId')

            self.props_content = []

            for i in self.itemIds:
                self.props_content.append({
                    'Type': 'Delete',
                    'Position': i,
                })

            oMsg = yield self.genResult('dm', region_api.modifyDeviceDriver(self._ID, self.props_content))
            self.send(self.SUCCESS)

        except HandlerError as e:
            self._send(e.json_msg)
