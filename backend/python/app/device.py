#! /bin/env python
#-*- coding:utf-8 -*-
import json, sys, urllib
import os, base64, datetime
from functools import partial

from tornado.gen import coroutine

from hite.mes.comm import config
from hite.mes.comm.log import logger
from hite.mes.comm import utils
from hite.mes.comm.handler import HiteHandler, HandlerError

from hite.mes.comm.DataModelApi import region as region_api
from hite.mes.comm.DataModelApi import model as model_api
from hite.mes.app.utils import DEVICE_DRIVER_PLC_OPTIONS, DEVICE_DRIVER_OPTIONS


# 配置管理平台: 获取区域节点下设备列表
class DeviceListFromRegionTree(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init('regionId', 'cateFilter', pageIndex='int', pageSize='int')

            if self.cateFilter not in ('all', 'disabled', 'concerned'):
                raise HandlerError(self.rsp_code['params_error'], "cateFilter %s does not support" % self.cateFilter)

            device_ids = []
            if self.cateFilter == 'concerned':
                device_ids = yield self.genResult('dm', region_api.getTaggedDevices(self.user_id, '已关注', selector="DeviceID"), self.get_concerned_device_ids)

                if len(device_ids) == 0:
                    self.send(self.SUCCESS, {'pageList': [], 'pageIndex': 0, 'pageCount': 0})
                    return

            auth_nodes = self.user_session.get('regionTree')
            oMsg = yield self.genResult('dm', region_api.getDescendantAuthNodeIdsFromParent(self.regionId, auth_nodes))
            auths = [a['ID'] for a in oMsg['BOS']]
            if self.regionId in auth_nodes: auths.append(self.regionId)

            msg = region_api.getDeviceListByRegionId(auths, self.pageIndex, self.pageSize)

            if len(device_ids) > 0:
                msg["SelectWhere"] = "DeviceID IN \"{%s}\"" % ','.join(device_ids)

            if self.cateFilter == 'disabled':
                msg["SelectWhere"] = "Enable==\"false\""

            data = yield self.genResult('dm', msg, self.get_device_list)

            self.send(self.SUCCESS, data)
        except HandlerError as e:
            self._send(e.json_msg)

    def get_concerned_device_ids(self, oMsg):
        return [d['DeviceID'] for d in oMsg['BOS']]

    def get_device_list(self, oMsg):
        return {
            'pageList': oMsg['BOS'],
            'pageIndex': oMsg['PageIndex'],
            'pageCount': oMsg['PageCount']
        }

# 配置管理平台: 获取区域节点下设备详情
class DeviceDetailFromRegionTree(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init('deviceId')

            commands = [
                region_api.getDeviceInfo(self.deviceId), #查设备信息，是否置顶
                region_api.getTaggedDevices(self.user_id, '已关注', filter_device_id=self.deviceId), #查是否已关注
                region_api.getDevicePath(self.deviceId), #查区域架构路径
                model_api.getDeviceTemplate(), #查询设备基础模板
            ]

            msg = {'Type': 'BatchReadReq', 'Commands': commands}
            data = yield self.genResult('dm', msg, self.batch_response)

            props = data['NSDevicesTemplate']['Props']
            map_msg = model_api.getMapOptions(props)
            if map_msg is not None:
                map_options = yield self.genResult('dm', map_msg, self.parse_dict_man)

                if map_options is None: return
                data['NSDevicesTemplate']['Props'] = model_api.updateMapOptionsForProperties(props, map_options)

            self.send(self.SUCCESS, data)
        except HandlerError as e:
            self._send(e.json_msg)

    def parse_dict_man(self, oMsg): return oMsg.get('BOS')

    def batch_response(self, oMsg):
        results = oMsg['Results']
        try:
            deviceInfo = results[0]['BOS'][0]
            deviceInfo['Concerned'] = str((len(results[1]['BOS']) > 0))
            deviceInfo['RegionPath'] = results[2]['Path']

            data_model = results[3].get('DataModelDefine')
            props = model_api.getProperties(data_model, 'NSDevices')

            return {"NSDevices": deviceInfo, 'NSDevicesTemplate': {'Props': props}}

        except IndexError:
            raise HandlerError(self.rsp_code['params_error'], "%s does not exist" % self.deviceId)

# 配置管理平台: 获取区域节点下设备个数
class DeviceCountFromRegionTree(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init('regionId')

            auth_nodes = self.user_session.get('regionTree')
            oMsg = yield self.genResult('dm', region_api.getDescendantAuthNodeIdsFromParent(self.regionId, auth_nodes))
            auths = [a['ID'] for a in oMsg['BOS']]
            if self.regionId in auth_nodes: auths.append(self.regionId)

            commands = [
                region_api.getDeviceCount(auths),
                region_api.getDeviceCount(auths, Enable="false"),
                region_api.getTaggedDevices(self.user_id, '已关注', selector="DeviceID")
            ]
            data = yield self.genResult('dm', {'Type': 'BatchReadReq', 'Commands': commands}, self.device_count)

            device_ids = data.pop('device_ids')
            if device_ids:
                oMsg = yield self.genResult('dm', region_api.getDeviceCount(auths, filter_device_ids=device_ids))
                data['concerned'] = oMsg['Count']

            self.send(self.SUCCESS, data)

        except HandlerError as e:
            self._send(e.json_msg)

    def device_count(self, oMsg):
        data = {
            'all': oMsg['Results'][0].get('Count'),
            'disabled': oMsg['Results'][1].get('Count'),
            'concerned': 0,
            'device_ids': []
        }
        devices = oMsg['Results'][2].get('BOS')
        if len(devices) > 0: data['device_ids'] = [d['DeviceID'] for d in devices]

        return data

# 配置管理平台: 获取设备区域架构路径
class DeviceBelongsFromRegionTree(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init('deviceId')

            msg = device_api.getDevicePath(self.deviceId)
            data = yield self.genResult('dm', msg, self.device_path)

            self.send(self.SUCCESS, data)
        except HandlerError as e:
            self._send(e.json_msg)

    def device_path(self, oMsg):
        self.response_data = oMsg['Path']

# 配置管理平台: 获取设备模板
class DeviceTemplate(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init('categroy')

            if self.categroy not in ('NSDevices', 'NSDevicesAlarmInfo', 'NSDevicesVarInfo', \
                    'NSDeviceFlowChart', 'NSDutyCard', 'NSDeviceUIFault', \
                    'NSDeviceUIRunState', 'NSDeviceUIParam', 'NSDeviceUIOverview'):
                raise HandlerError(self.rsp_code['params_error'], "categroy %s does not support" % self.categroy)

            props = yield self.genResult('dm', model_api.getDeviceTemplate(), self.device_template)

            msg = model_api.getMapOptions(props)
            if msg:
                map_options = yield self.genResult('dm', msg, self.parse_dict_man)

                props = model_api.updateMapOptionsForProperties(props, map_options)

            self.send(self.SUCCESS, {'%sTemplate'%self.categroy: {'Props': props}})
        except HandlerError as e:
            self._send(e.json_msg)

    def device_template(self, oMsg):
        data_model = oMsg.get('DataModelDefine')
        return model_api.getProperties(data_model, self.categroy)

    def parse_dict_man(self, oMsg): return oMsg.get('BOS')

# 配置管理平台: 获取设备属性
# 配置管理平台: 获取设备ui配置
class DeviceAttribute(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init('deviceId', 'categroy')

            if self.categroy not in ('NSDevices', 'NSDevicesDriver', 'NSDevicesAlarmInfo', 'NSDevicesVarInfo', \
                    'NSDeviceFlowChart', 'NSDutyCard', 'NSDeviceUIFault', \
                    'NSDeviceUIRunState', 'NSDeviceUIParam', 'NSDeviceUIOverview'):
                raise HandlerError(self.rsp_code['params_error'], "categroy %s does not support" % self.categroy)

            tree_filter = '%s[]' % self.categroy
            if self.categroy == 'NSDevicesDriver':
                tree_filter = 'NSDevicesDriver[].NSDriverLogicDevice[].{NSDevicesCommunicateParameter[],NSDevicesCommunicateDataBlock[].NSDevicesCommunicateDataBlockParameter[]}'

            if self.categroy != 'NSDevices':
                tree_filter = 'NSDevices[].%s' % tree_filter

            msg = {
                "Type":"GetBOTreeReq",
                "DataModelName":"s_DeviceMan",
                "BOName":"NSDevices",
                "WhereType":"CONDITION",
                "Where":"DeviceID==\"%s\"" % self.deviceId,
                "TreeFilter": tree_filter,
            }
            device_data = yield self.genResult('dm', msg, self.parse_device)

            data = {}
            if self.categroy == 'NSDevices':
                data['NSDevices'] = [{"ParameterName": k, "ParameterValue": v} for k,v in device_data.items()]
            else:
                data['_ID'] = device_data.get('_ID')
                data[self.categroy] = device_data.get(self.categroy)
                if data.get(self.categroy) is None: data[self.categroy] = []
                elif self.categroy == 'NSDevicesVarInfo':
                    for b in data[self.categroy]: b['RelatedVar'] = b.get('VarName')

            if self.categroy == 'NSDevicesDriver':
                if not data.get('NSDevicesDriver'):
                    data['NSDriverTemplate'] = {'Props': []}
                    self.send(self.SUCCESS, data)
                    return
                else:
                    msg = model_api.getDeviceDriverTemplates(self.get_driver_type_list(data.get('NSDevicesDriver')))
                    data['NSDriverTemplate'] = yield self.genResult('dm', msg, self.parse_global_conf)
            else:
                props = yield self.genResult('dm', model_api.getDeviceTemplate(), self.device_template)

                msg = model_api.getMapOptions(props)
                if msg:
                    map_options = yield self.genResult('dm', msg, self.parse_dict_man)
                    props = model_api.updateMapOptionsForProperties(props, map_options)

                data['%sTemplate'%self.categroy] = {'Props': props}

            self.send(self.SUCCESS, data)

        except HandlerError as e:
            self._send(e.json_msg)

    def parse_device(self, oMsg):
        if not oMsg['BOTree'] or len(oMsg['BOTree']) == 0:
            raise HandlerError(self.rsp_code['system_error'], '%s does not exist' % self.deviceId)

        return dict(oMsg['BOTree'][0])

    def parse_global_conf(self, oMsg):
        return [json.loads(b.get('Value')) for b in oMsg['BOS']]

    def get_driver_type_list(self, driver_list):
        type_list = []

        for driver in driver_list:
            driver_id = driver.get('DriverID')
            if driver_id == 'NetSCADA6.RTDB.Drivers.NSSiemensS7E': # 特殊类型驱动处理
                logic_device = driver.get('NSDriverLogicDevice')[0]
                communicate_params = logic_device.get('NSDevicesCommunicateParameter')

                for param in communicate_params:
                    if param.get('ParameterName') != 'PLCType': continue

                    plc_value = param.get('ParameterValue')
                    type_list.append('SiemensS7E-%s' % DEVICE_DRIVER_PLC_OPTIONS.get(str(plc_value)))
                    break
            else:
                i = DEVICE_DRIVER_OPTIONS.values().index(driver_id)
                type_list.append(DEVICE_DRIVER_OPTIONS.keys()[i])

        return type_list

    def device_template(self, oMsg):
        data_model = oMsg.get('DataModelDefine')
        return model_api.getProperties(data_model, self.categroy)

    def parse_dict_man(self, oMsg):
        return oMsg.get('BOS')


# 配置管理平台: 获取设备驱动配置模板
class DeviceDriverConfig(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init('driverId')

            msg = model_api.getDeviceDriverTemplate(self.driverId)
            template = yield self.genResult('dm', msg, self.driver_template)

            self.send(self.SUCCESS, template)

        except HandlerError as e:
            self._send(e.json_msg)

    def driver_template(self, oMsg):
        if len(oMsg['BOS']) == 0:
            raise HandlerError(self.rsp_code['params_error'], '%s does not exist' % self.driverId)

        return json.loads(oMsg['BOS'][0].get('Value'))

# 配置管理平台: 新增设备
class AddNewDeviceToRegionTree(HiteHandler):
    @coroutine
    def post(self):
        try:
            self.post_init('props', 'companyId')

            self.bo_props = {}
            for p in self.props.get('NSDevices'):
                self.bo_props[p.get('ParameterName')] = p.get('ParameterValue')

            self.device_uuid = utils.gen_unique_id()
            self.bo_props['_ID'] = self.device_uuid

            oMsg = yield self.genResult('dm', region_api.newDevice(self.bo_props))
            oMsg = yield self.genResult('dm', region_api.addDeviceToRegionTree(self.companyId, self.bo_props))

            self.send(self.SUCCESS, {'DeviceID': self.device_uuid})

        except HandlerError as e:
            self._send(e.json_msg)

# 配置管理平台: 修改设备
class ModifyDeviceFromRegionTree(HiteHandler):
    @coroutine
    def post(self):
        try:
            self.post_init('props', 'deviceId')

            self.bo_props = {}
            for p in self.props.get('NSDevices'):
                key = p.get('ParameterName')
                val = p.get('ParameterValue')
                if key == 'Top':
                    oMsg = yield self.genResult('dm', region_api.topDevice(self.deviceId, val))
                else: self.bo_props[key] = p.get(val)

            if self.bo_props:
                oMsg = yield self.genResult('dm', region_api.modifyDevice(self.deviceId, self.bo_props))

            self.send(self.SUCCESS)
        except HandlerError as e:
            self._send(e.json_msg)

# 配置管理平台: 删除设备
class DeleteDeviceFromRegionTree(HiteHandler):
    @coroutine
    def post(self):
        try:
            self.post_init('deviceIds')

            oMsg = yield self.genResult('dm', region_api.deleteDevice(self.deviceIds))
            self.send(self.SUCCESS)

        except HandlerError as e:
            self._send(e.json_msg)

# 配置管理平台: 移动设备
class MoveDeviceFromRegionTree(HiteHandler):
    @coroutine
    def post(self):
        try:
            self.post_init('deviceIds', 'newCompanyId')

            oMsg = yield genResult('dm', region_api.moveDevice(self.deviceIds, self.newCompanyId))
            self.send(self.SUCCESS)

        except HandlerError as e:
            self._send(e.json_msg)

# 配置管理平台: 关注设备
class ConcernDeviceFromRegionTree(HiteHandler):
    @coroutine
    def post(self):
        try:
            self.post_init('deviceId')
            self.tagName = '已关注'

            deviceInfo = yield self.genResult('dm', region_api.getDeviceInfo(self.deviceId), self.parse_device_info)
            defaultTag = yield self.genResult('dm', region_api.getTagList(self.user_id, self.tagName), self.parse_tag_device)

            if not defaultTag:
                oMsg = yield self.genResult('dm', region_api.newTag(self.user_id, {'Name': self.tagName}))

            oMsg = yield self.genResult('dm', region_api.tagDevice(self.user_id, [deviceInfo], [self.tagName]))

            self.send(self.SUCCESS)

        except HandlerError as e:
            self._send(e.json_msg)

    def parse_device_info(self, oMsg):
        try: return oMsg ['BOS'][0]
        except IndexError:
            raise HandlerError(self.rsp_code['params_error'], '%s does not exist' % self.driverId)

    def parse_tag_device(self, oMsg): return len(oMsg['BOS']) > 0

# 配置管理平台: 为设备添加标签
class TagDeviceFromRegionTree(HiteHandler):
    @coroutine
    def post(self):
        try:
            self.post_init('deviceIds', 'tagNames')

            deviceInfos = yield self.genResult('dm', region_api.getDeviceListByFilter(self.deviceIds))
            oMsg = yield self.genResult('dm', region_api.tagDevice(self.user_id, deviceInfos, self.tagNames))

            self.send(self.SUCCESS)
        except HandlerError as e:
            self._send(e.json_msg)

    def parse_device_response(self, oMsg):
        if len(oMsg['BOS']) == 0:
            raise HandlerError(self.rsp_code['params_error'], '%s does not exist' % ','.join(self.driverIds))
        return oMsg['BOS']

# 配置管理平台: 为设备移除标签
class UnTagDeviceFromRegionTree(HiteHandler):
    @coroutine
    def post(self):
        try:
            self.post_init('deviceIds')

            path = self.get_request_path()
            if path in ('concern_device', 'unconcern_device'):
                self.tagNames = ['已关注']
            else:
                self._require_validate('tagNames')

            oMsg = yield self.genResult('dm', region_api.unTagDevice(self.user_id, self.deviceIds, self.tagNames))
            self.send(self.SUCCESS)

        except HandlerError as e:
            self._send(e.json_msg)

# 检查是否存在驱动com相同的设备编号
class CheckDriverDomPort(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init('deviceId', 'comPort')
            oMsg = yield self.genResult('dm', region_api.getDeviceComPort(self.deviceId, self.comPort))
            deviceIds = oMsg['DeviceIDs']
            self.send(self.SUCCESS, {'result': len(deviceIds)==0})
        except HandlerError as e:
            self._send(e.json_msg)
