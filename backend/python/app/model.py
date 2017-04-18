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
from hite.mes.comm.DataModelApi import model as model_api

from hite.mes.app.utils import DEVICE_DRIVER_PLC_OPTIONS, DEVICE_DRIVER_OPTIONS


# 配置管理平台: 模型定义通用新增接口
class NewModelItem(HiteHandler):
    @coroutine
    def post(self):
        try:
            self.post_init('_ID', 'deviceId', 'props', 'categroy')
            self.props_content = []

            # 设备模型
            if self.categroy not in ('NSDevicesAlarmInfo', 'NSDevicesVarInfo', \
                    'NSDeviceFlowChart', 'NSDutyCard', 'NSDeviceUIFault', \
                    'NSDeviceUIRunState', 'NSDeviceUIParam', 'NSDeviceUIOverview'):
                raise HandlerError(self.rsp_code['params_error'], "categroy %s does not support" % self.categroy)

            # 组织请求结构体
            for p in self.props:
                p['_ID'] = utils.gen_unique_id()
                self.props_content.append({
                    'Type': 'Add',
                    'Position': self._ID,
                    'NodeType': self.categroy,
                    'Props': p
                })

            msg = {
                "Type":"CommitChangeReq",
                "DataModelName":"s_DeviceMan",
                "PartionNodes": [self._ID],
                "ModifyContent": self.props_content,
            }
            oMsg = yield self.genResult('dm', msg)
            self.send(self.SUCCESS)
        except HandlerError as e:
            self._send(e.json_msg)

# 配置管理平台: 模型定义通用修改接口
class ModifyModelItem(HiteHandler):
    @coroutine
    def post(self):
        try:
            self.post_init('_ID', 'deviceId', 'props', 'categroy')
            self.props_content = []

            # 设备模型
            if self.categroy not in ('NSDevicesAlarmInfo', 'NSDevicesVarInfo', \
                    'NSDeviceFlowChart', 'NSDutyCard', 'NSDeviceUIFault', \
                    'NSDeviceUIRunState', 'NSDeviceUIParam', 'NSDeviceUIOverview'):
                raise HandlerError(self.rsp_code['params_error'], "categroy %s does not support" % self.categroy)

            for p in self.props:
                self.props_content.append({
                    'Type': 'Modify',
                    'Position': p.pop('_ID'),
                    'Props': p
                })

            msg = {
                "Type":"CommitChangeReq",
                "DataModelName":"s_DeviceMan",
                "PartionNodes": [self._ID],
                "ModifyContent": self.props_content,
            }
            oMsg = yield self.genResult('dm', msg)
            self.send(self.SUCCESS)
        except HandlerError as e:
            self._send(e.json_msg)

# 配置管理平台: 模型定义通用删除接口
class DeleteModelItem(HiteHandler):
    @coroutine
    def post(self):
        try:
            self.post_init('_ID', 'deviceId', 'itemIds', 'categroy')
            self.props_content = []

            # 设备模型
            if self.categroy not in ('NSDevicesAlarmInfo', 'NSDevicesVarInfo', \
                    'NSDeviceFlowChart', 'NSDutyCard', 'NSDeviceUIFault', \
                    'NSDeviceUIRunState', 'NSDeviceUIParam', 'NSDeviceUIOverview'):
                raise HandlerError(self.rsp_code['params_error'], "categroy %s does not support" % self.categroy)

            for i in self.itemIds:
                self.props_content.append({
                    'Type': 'Delete',
                    'Position': i,
                })

            msg = {
                "Type":"CommitChangeReq",
                "DataModelName":"s_DeviceMan",
                "PartionNodes": [self._ID],
                "ModifyContent": self.props_content,
            }
            oMsg = yield self.genResult('dm', msg)
            self.send(self.SUCCESS)
        except HandlerError as e:
            self._send(e.json_msg)

# 系统模型列表
# 用户模型列表
class ModelList(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init()

            path = self.get_request_path()
            if path == 'system_model_list':
                msg = model_api.getModelList()
            else:
                msg = model_api.getModelList(isUserDefine="true")

            oMsg = yield self.genResult('dm', msg)

            model_list = oMsg['ModelList']

            if len(model_list) > 0:
                commands = [model_api.getModelDefinedJson(m) for m in model_list]
                model_list = yield self.genResult('dm', {'Type': 'BatchReadReq', 'Commands': commands}, self.batch_results)

            self.send(self.SUCCESS, {'ModelList': model_list})
        except HandlerError as e:
            self._send(e.json_msg)

    def batch_results(self, oMsg):
        reList = []
        results = oMsg['Results']

        for r in results:
            r = r['DataModelDefine']
            info = {"ModelName": r['Name'], "Children": []}

            c = self.node_children(r.get('DataNode'))
            if c is not None:
                info["Children"] = [self.node_children(r.get('DataNode'))]

            reList.append(info)

        return reList

    def node_children(self, dataNode=None):
        if dataNode is None or not dataNode: return

        if 'RelatedDataNode' in dataNode:
            relatedName = dataNode.get('Name')
            if not relatedName: relatedName = dataNode['RelatedDataNode']['DataModel']
            result = {"Name": relatedName, "Children": []}
        else: result = {"Name": dataNode['Name'], "Children": []}

        if 'DataNode' in dataNode:
            if isinstance(dataNode['DataNode'], list):
                for dn in dataNode['DataNode']:
                    result["Children"].append(self.node_children(dn))
            else:
                result["Children"].append(self.node_children(dataNode['DataNode']))

        return result

# 获取模型模板
class ModelTemplate(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init()

            keys = {
                'model_template': 'DataModel-Self-Properties',
                'system_model_node_template': 'DataNode-Self-Properties',
                'custom_model_node_template': 'DataNode-Self-Properties',
                'model_property_template': 'DataNode-Property-Properties',
                'model_nodeindex_template': 'DataNode-Index-Properties'
            }
            path = self.get_request_path()

            props = yield self.genResult('dm', model_api.getModelTemplate(keys[path]), self.dict_model)
            msg = model_api.getMapOptions(props)
            if msg:
                map_options = yield self.genResult('dm', msg, self.parse_dict_man)
                props = model_api.updateMapOptionsForProperties(props, map_options)

            path = self.get_request_path()
            if path.endswith('model_node_template'):
                for p in props:
                    if p['Form']['Type'] != 'DataNodePicker': continue

                    if path.startswith('system'):
                        p['Form']['Type'] = 'SystemDataNodePicker'
                    elif path.startswith('custom'):
                        p['Form']['Type'] = 'CustomDataNodePicker'

            self.send(self.SUCCESS, {"ModelTemplate": {'Props': props}})

        except HandlerError as e:
            self._send(e.json_msg)

    def dict_model(self, oMsg):
        try:
            template = json.loads(oMsg['BOS'][0]['Value'])
            path = self.get_request_path()
            if path == 'model_template':
                return template["Self-Properties"]

            if path == 'system_model_node_template':
                return template["Self-Properties"]

            if path == 'custom_model_node_template':
                return template["Self-Properties"]

            if path == 'model_property_template':
                return template["Property-Properties"]

            if path == 'model_nodeindex_template':
                return template["Index-Properties"]

        except IndexError:
            raise HandlerError(self.rsp_code['params_error'], "model template does not exist")
        except KeyError:
            raise HandlerError(self.rsp_code['params_error'], "model template does not exist")

    def parse_dict_man(self, oMsg): return oMsg.get('BOS')

# 获取模型信息
class ModelDetail(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init('modelName')

            model = yield self.genResult('dm', model_api.getModelDefinedJson(self.modelName), self.model_info)
            self.send(self.SUCCESS, {"Model": model})
        except HandlerError as e:
            self._send(e.json_msg)

    def model_info(self, oMsg):
        m = oMsg["DataModelDefine"]
        m.pop('DataNode')
        return m

# 新建模型
class NewModel(HiteHandler):
    @coroutine
    def post(self):
        try:
            self.post_init("modelName", "category")

            if len(self.modelName.strip())==0:
                raise HandlerError(self.rsp_code['params_error'], "model name needed")

            props = {
                "Name": self.modelName,
                "Description": "",
                "DataSourceType": "NOSQL",
                "DataNode": {},
                "IsUserDefine": "true"
            }
            if self.category == 'system': props["IsUserDefine"] = "false"

            oMsg = yield self.genResult('dm', model_api.upsertModel(props))
            self.send(self.SUCCESS)
        except HandlerError as e:
            self._send(e.json_msg)

# 编辑模型
class ModifyModel(HiteHandler):
    @coroutine
    def post(self):
        try:
            self.post_init("modelName", "props")

            bo_props = {}
            for p in self.props.get('Models'):
                bo_props[p['ParameterName']] = p['ParameterValue']

            oMsg = yield self.genResult('dm', model_api.getModelDefinedJson(self.modelName))
            newJsonDefined = model_api.updateModelJsonForModel(oMsg['DataModelDefine'], bo_props)

            oMsg = yield self.genResult('dm', model_api.upsertModel(newJsonDefined))
            self.send(self.SUCCESS)
        except HandlerError as e:
            self._send(e.json_msg)

# 删除模型
class DeleteModel(HiteHandler):
    @coroutine
    def post(self):
        try:
            self.post_init("modelName")

            oMsg = yield self.genResult('dm', model_api.deleteModel(self.modelName))
            self.send(self.SUCCESS)

        except HandlerError as e:
            self._send(e.json_msg)

# 发布模型
class PublishModel(HiteHandler):
    @coroutine
    def post(self):
        try:
            self.post_init("modelName")

            oMsg = yield self.genResult('dm', model_api.publishModel(self.modelName))
            self.send(self.SUCCESS)

        except HandlerError as e:
            self._send(e.json_msg)

# 获取子模型信息
class ModelNodeDetail(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init('modelName', 'nodeName')

            model = yield self.genResult('dm', model_api.getModelDefinedJson(self.modelName), self.model_info)

            if 'RelatedDataNode' in model and model['RelatedDataNode']:
                relatedModel = model['RelatedDataNode']['DataModel']
                oMsg = yield self.genResult('dm', model_api.getModelDefinedJson(relatedModel))

                isUserDefine = oMsg["DataModelDefine"]["IsUserDefine"]
                if isUserDefine.lower() == 'true':
                    model['RelatedDataNode']['ModelType'] = "custom"
                else:
                    model['RelatedDataNode']['ModelType'] = "system"

            self.send(self.SUCCESS, {"Model": model})
        except HandlerError as e:
            self._send(e.json_msg)

    def model_info(self, oMsg):
        return model_api.getDataNodeSelfInfo(oMsg["DataModelDefine"], self.nodeName)

# 新建子模型
class NewModelNode(HiteHandler):
    @coroutine
    def post(self):
        try:
            self.post_init("modelName", "parentName", "nodeName")

            if len(self.nodeName.strip())==0:
                raise HandlerError(self.rsp_code['params_error'], "node name needed")

            oMsg = yield self.genResult('dm', model_api.getModelDefinedJson(self.modelName))

            node_props = {"Name": self.nodeName}
            jsonDefined = oMsg['DataModelDefine']
            # 检查DataNode是否重名
            m = model_api.getDataNodeSelfInfo(jsonDefined, self.nodeName)
            if m is not None:
                raise HandlerError(self.rsp_code['params_error'], "node name exists")

            if self.modelName == self.parentName:
                if jsonDefined.get('DataNode') is not None and jsonDefined['DataNode'].get('Name'):
                    raise HandlerError(self.rsp_code['params_error'], "DataNode exists")

                jsonDefined["DataNode"] = node_props
            else:
                dataNode = model_api.updateModelJsonForNewDataNode(jsonDefined, self.parentName, node_props)

                if dataNode is None:
                    raise HandlerError(self.rsp_code['params_error'], "model %s does not exist" % self.parentName)
                jsonDefined["DataNode"] = dataNode

            print '---------------------'
            print 'jsonDefined:'
            print json.dumps(jsonDefined, indent=1)
            print '---------------------'

            oMsg = yield self.genResult('dm', model_api.upsertModel(jsonDefined))
            self.send(self.SUCCESS)
        except HandlerError as e:
            self._send(e.json_msg)

# 编辑子模型
class ModifyModelNode(HiteHandler):
    @coroutine
    def post(self):
        try:
            self.post_init("modelName", "nodeName", "props")

            bo_props = {}
            for p in self.props.get('ModelNodes'):
                name = p['ParameterName']
                val = p['ParameterValue']

                bo_props[name] = val
                bo_props['Properties'] = []

            oMsg = yield self.genResult('dm', model_api.getModelDefinedJson(self.modelName))

            jsonDefined = oMsg['DataModelDefine']

            # 检查DataNode是否重名
            if 'Name' in bo_props and bo_props['Name'] != self.nodeName:
                m = model_api.getDataNodeSelfInfo(jsonDefined, bo_props['Name'])
                if m is not None:
                    raise HandlerError(self.rsp_code['params_error'], "node name exists")

            dataNode = model_api.updateModelJsonForDataNode(jsonDefined, self.nodeName, bo_props)
            if dataNode is None:
                raise HandlerError(self.rsp_code['params_error'], "model %s does not exist" % self.nodeName)
            jsonDefined["DataNode"] = dataNode

            print '---------------------'
            print 'jsonDefined:'
            print json.dumps(jsonDefined, indent=1)
            print '---------------------'

            oMsg = yield self.genResult('dm', model_api.upsertModel(jsonDefined))
            self.send(self.SUCCESS)
        except HandlerError as e:
            self._send(e.json_msg)

# 删除子模型
class DeleteModelNode(HiteHandler):
    @coroutine
    def post(self):
        try:
            self.post_init("modelName", "nodeName")

            oMsg = yield self.genResult('dm', model_api.getModelDefinedJson(self.modelName))

            jsonDefined = oMsg['DataModelDefine']
            dataNode = model_api.updateModelJsonForRemoveDataNode(jsonDefined, self.nodeName)
            if dataNode is None:
                raise HandlerError(self.rsp_code['params_error'], "model %s does not exist" % self.nodeName)
            if isinstance(dataNode, dict) and not dataNode: jsonDefined.pop('DataNode')
            else: jsonDefined["DataNode"] = dataNode

            print '---------------------'
            print 'jsonDefined:'
            print json.dumps(jsonDefined, indent=1)
            print '---------------------'

            oMsg = yield self.genResult('dm', model_api.upsertModel(jsonDefined))
            self.send(self.SUCCESS)
        except HandlerError as e:
            self._send(e.json_msg)

# 获取子模型引用节点选项
class ModelRelatedNodeOptions(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init("modelType", "modelName")

            if self.modelType == 'system':
                oMsg = yield self.genResult('dm', model_api.getModelList())
            elif self.modelType == 'custom':
                oMsg = yield self.genResult('dm', model_api.getModelList(isUserDefine="true"))

            model_list = oMsg['ModelList']
            if self.modelName in model_list: model_list.remove(self.modelName)

            if len(model_list) > 0:
                commands = [model_api.getModelDefinedJson(m) for m in model_list]
                model_list = yield self.genResult('dm', {'Type': 'BatchReadReq', 'Commands': commands}, self.batch_results)

            self.send(self.SUCCESS, {'ModelList': model_list})

        except HandlerError as e:
            self._send(e.json_msg)

    def batch_results(self, oMsg):
        reList = []
        results = oMsg['Results']

        for r in results:
            r = r['DataModelDefine']
            info = {"ModelName": r['Name'], "Children": []}

            c = self.node_children(r.get('DataNode'))
            if c is not None:
                info["Children"] = [self.node_children(r.get('DataNode'))]

            reList.append(info)

        return reList

    def node_children(self, dataNode=None):
        if dataNode is None or not dataNode: return

        if 'RelatedDataNode' in dataNode: return # 不可以关联引用节点
        else: result = {"Name": dataNode['Name'], "Children": []}

        if 'DataNode' in dataNode:
            if isinstance(dataNode['DataNode'], list):
                for dn in dataNode['DataNode']:
                    ch = self.node_children(dn)
                    if ch is not None: result["Children"].append(ch)
            else:
                ch = self.node_children(dataNode['DataNode'])
                if ch is not None: result["Children"].append(ch)

        return result

# 获取子模型索引
class ModelNodeIndex(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init("modelName", "nodeName")

            oMsg = yield self.genResult('dm', model_api.getModelDefinedJson(self.modelName))
            nodeIndexs = model_api.getIndexList(oMsg['DataModelDefine'], self.nodeName)
            if nodeIndexs is None:
                raise HandlerError(self.rsp_code['params_error'], "model %s does not exist" % self.nodeName)
            self.send(self.SUCCESS, {"ModelNodeIndex": nodeIndexs})
        except HandlerError as e:
            self._send(e.json_msg)

# 获取子模型-索引属性集选项
class ModelNodeIndexProperty(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init("modelName", "nodeName")

            oMsg = yield self.genResult('dm', model_api.getModelDefinedJson(self.modelName))

            properties = model_api.getProperties(oMsg['DataModelDefine'], self.nodeName)
            if properties is None:
                raise HandlerError(self.rsp_code['params_error'], "model %s does not exist" % self.nodeName)
            props = [{"Name": p["Name"], "Description": p["Description"]} for p in properties]

            self.send(self.SUCCESS, {"ModelNodeIndexProperty": props})
        except HandlerError as e:
            self._send(e.json_msg)

# 保存子模型索引
class UpsertModelNodeIndex(HiteHandler):
    @coroutine
    def post(self):
        try:
            self.post_init("modelName", "nodeName", "props")

            oMsg = yield self.genResult('dm', model_api.getModelDefinedJson(self.modelName))

            jsonDefined = oMsg['DataModelDefine']
            dataNode = model_api.updateModelJsonForDataNodeItems(jsonDefined, self.nodeName, self.props, 'Index')
            if dataNode is None:
                raise HandlerError(self.rsp_code['params_error'], "model %s does not exist" % self.nodeName)
            jsonDefined["DataNode"] = dataNode

            print '---------------------'
            print 'jsonDefined:'
            print json.dumps(jsonDefined, indent=1)
            print '---------------------'

            oMsg = yield self.genResult('dm', model_api.upsertModel(jsonDefined))
            self.send(self.SUCCESS)
        except HandlerError as e:
            self._send(e.json_msg)

# 获取子模型-属性列表
class ModelNodeProperty(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init("modelName", "nodeName")

            oMsg = yield self.genResult('dm', model_api.getModelDefinedJson(self.modelName))
            properties = model_api.getProperties(oMsg['DataModelDefine'], self.nodeName)
            if properties is None:
                raise HandlerError(self.rsp_code['params_error'], "model %s does not exist" % self.nodeName)

            model = model_api.getDataNodeSelfInfo(oMsg["DataModelDefine"], self.nodeName)
            if 'RelatedDataNode' in model and model['RelatedDataNode']:
                relatedModelName = model['RelatedDataNode']['DataModel']
                relatedNodeName = model['RelatedDataNode']['DataNode']

                oMsg = yield self.genResult('dm', model_api.getModelDefinedJson(relatedModelName))
                relatedProperties = model_api.getProperties(oMsg['DataModelDefine'],  relatedNodeName)

                if relatedProperties is None:
                    raise HandlerError(self.rsp_code['params_error'], "related model %s,%s does not exist" % (relatedModelName, relatedNodeName))

                for _p in relatedProperties: _p['isRelatedProperty'] = "true"

                relatedProperties.extend(properties)
                properties = list(relatedProperties)

            for p in properties:
                try: f = p.pop('Form')
                except KeyError: continue

                if 'Type' in f: p['FormType'] = f['Type']
                if 'Properties' in f:
                    for fk,fv in f['Properties'].items(): p['FormProperties%s'%fk] = fv

            self.send(self.SUCCESS, {"ModelNodeProperty": properties})
        except HandlerError as e:
            self._send(e.json_msg)

# 保存子模型属性列表
class UpsertModelNodeProperty(HiteHandler):
    @coroutine
    def post(self):
        try:
            self.post_init("modelName", "nodeName", "props")

            oMsg = yield self.genResult('dm', model_api.getModelDefinedJson(self.modelName))

            jsonDefined = oMsg['DataModelDefine']
            propsType = ('FormPropertiesFontSize', 'FormPropertiesHeight', 'FormPropertiesWidth')
            for p in self.props:
                form_type = p.pop('FormType', '')

                form_properties = {}
                for pt in propsType:
                    form_properties[pt[14:]] = p.pop(pt, '')

                p['Form'] = {"Type": form_type, "Properties": form_properties}

            dataNode = model_api.updateModelJsonForDataNodeItems(jsonDefined, self.nodeName, self.props, 'Properties')
            if dataNode is None:
                raise HandlerError(self.rsp_code['params_error'], "model %s does not exist" % self.nodeName)
            jsonDefined["DataNode"] = dataNode

            print '---------------------'
            print 'jsonDefined:'
            print json.dumps(jsonDefined, indent=1)
            print '---------------------'

            oMsg = yield self.genResult('dm', model_api.upsertModel(jsonDefined))

            self.send(self.SUCCESS)
        except HandlerError as e:
            self._send(e.json_msg)

# 获取模型模板
class ModelClusterTemplate(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init()

            keys = {
                'model_cluster_state_template': 'ClusterState',
                'model_cluster_node_state_template': 'DataModelState'
            }
            path = self.get_request_path()

            props = yield self.genResult('dm', model_api.getModelClusterTemplate(keys[path]), self.dict_model)

            msg = model_api.getMapOptions(props)
            if msg:
                map_options = yield self.genResult('dm', msg, self.parse_dict_man)
                props = model_api.updateMapOptionsForProperties(props, map_options)

            self.send(self.SUCCESS, {"ModelTemplate": {'Props': props}})

        except HandlerError as e:
            self._send(e.json_msg)

    def dict_model(self, oMsg):
        try:
            template = json.loads(oMsg['BOS'][0]['Value'])
            path = self.get_request_path()
            if path == 'model_cluster_state_template':
                return template["ClusterState"]
            elif path == 'model_cluster_node_state_template':
                return template["DataModelState"]

        except IndexError:
            raise HandlerError(self.rsp_code['params_error'], "model template does not exist")
        except KeyError:
            raise HandlerError(self.rsp_code['params_error'], "model template does not exist")

    def parse_dict_man(self, oMsg): return oMsg.get('BOS')

# 获取节点集群状态列表
class ModelClusterStateList(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init()

            oMsg = yield self.genResult('dm', model_api.getClusterStates())
            self.send(self.SUCCESS, {"stateList": oMsg["States"]})
        except HandlerError as e:
            self._send(e.json_msg)

# 获取节点集群状态单节点信息列表
class ModelClusterNodeState(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init("clusterNodeId", pageIndex="int", pageSize="int")

            oMsg = yield self.genResult('dm', model_api.getClusterNodeStates(self.clusterNodeId, self.pageIndex, self.pageSize))
            self.send(self.SUCCESS, {
                    "stateList": oMsg["States"],
                    "pageIndex": oMsg["PageIndex"],
                    "pageCount": oMsg["PageCount"]
                })
        except HandlerError as e:
            self._send(e.json_msg)
