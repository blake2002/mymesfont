#! /bin/env python
#-*- coding:utf-8 -*-
import json, sys

'''
    模型相关dataModel，请求消息api
'''

# 从模型数据结构中获取对应dataNode的Properties
def getProperties(dataModel, nodeName):
    node = dataModel.get('DataNode')
    if isinstance(node, list):
        for n in node:
            if n.get('Name') == nodeName: return n.get('Properties', [])
            elif n.get('DataNode'):
                p = getProperties(n, nodeName)
                if p is not None: return p

    elif isinstance(node, dict):
        if node.get('Name') == nodeName:
            return node.get('Properties', [])
        else:
            if node.get('DataNode'):
                return getProperties(node, nodeName)
            else: return

# 从模型数据结构中获取对应dataNode的Index
def getIndexList(dataModel, nodeName):
    node = dataModel.get('DataNode')
    if isinstance(node, list):
        for n in node:
            if n.get('Name') == nodeName: return n.get('Index', [])
            elif n.get('DataNode'):
                i = getIndexList(n, nodeName)
                if i is not None: return i

    elif isinstance(node, dict):
        if node.get('Name') == nodeName: return node.get('Index', [])
        else:
            if node.get('DataNode'): return getIndexList(node, nodeName)
            else: return

# 从模型数据结构中获取对应的dataNode
def getDataNodeSelfInfo(dataModel, nodeName):
    node = dataModel.get('DataNode')
    if isinstance(node, list):
        for n in node:
            if n.get('Name') == nodeName:
                if 'Properties' in n: n.pop('Properties')
                if 'DataNode' in n: n.pop('DataNode')
                if 'Index' in n: n.pop('Index')
                return n
            elif n.get('DataNode'): return getDataNodeSelfInfo(n, nodeName)

    elif isinstance(node, dict):
        if node.get('Name') == nodeName:
            if 'Properties' in node: node.pop('Properties')
            if 'DataNode' in node: node.pop('DataNode')
            if 'Index' in node: node.pop('Index')
            return node
        elif node.get('DataNode'): return getDataNodeSelfInfo(node, nodeName)

# 查询数据模型中Map类型的options
def getMapOptions(props):
    map_dict = [p.get('Map') for p in props if 'Map' in p]

    if map_dict:
        return {
            "Type":"GetBOInfoReq",
            "DataModelName":"s_DictMan",
            "BOName":"KVPair",
            "Where":"Type IN \"{%s}\"" % ','.join(map_dict),
            "Selector":"Type,Key,Value",
            "OrderBy":"OrderbyIndex"
        }
    return

# 将查询得到的map options数据更新到模型模板中
def updateMapOptionsForProperties(props, options):
    if not options or len(options)==0: return props

    map_dict_options = {}
    for o in options:
        o_type = o['Type']
        if o_type not in map_dict_options: map_dict_options[o_type] = []

        map_dict_options[o_type].append({'Key': o.get('Key'), 'Value': o.get('Value')})

    for p in props:
        if 'Map' not in p: continue
        p['Form']['Options'] = map_dict_options.get(p['Map'])

    return props

#系统模板
def getSystemTemplate():
    return {
        "Type":"GetBOInfoReq",
        "DataModelName":"s_Conf",
        "BOName":"GlobalConf",
        "Where":"Key==\"ModelDefineModel\"&&Type==\"DataModel\"",
        "Selector":"Value",
    }

#设备基础模板
def getDeviceTemplate():
    return {
        "Type":"GetDataModelReq",
        "DataModelName":'s_DeviceMan'
    }

#设备驱动模板
def getDeviceDriverTemplate(driver_id):
    return {
        "Type":"GetBOInfoReq",
        "DataModelName":"s_Conf",
        "BOName":"GlobalConf",
        "Where":"Key==\"%s\"&&Type==\"DriverType\"" % driver_id,
        "Selector":"Value",
    }

#批量获取设备驱动模板
def getDeviceDriverTemplates(driver_ids):
    return {
        "Type":"GetBOInfoReq",
        "DataModelName":"s_Conf",
        "BOName":"GlobalConf",
        "Where":"Key IN \"{%s}\"&&Type==\"DriverType\"" % ','.join(driver_ids),
        "Selector":"Value",
    }

# 字典模板
def getDictTemplate():
    return {
        "Type":"GetDataModelReq",
        "DataModelName":"s_DictMan"
    }

# 角色模板
def getRoleTemplate():
    return {
        "Type":"GetDataModelReq",
        "DataModelName":"s_RoleMan"
    }

# 用户模板
def getUserTemplate():
    return {
        "Type":"GetDataModelReq",
        "DataModelName":"s_UsrMan"
    }

# 模型列表
def getModelList(isUserDefine="false"):
    return {
        "Type":"GetDataModelListReq",
        "IsUserDefine": isUserDefine
    }

# 获取模型定义Json
def getModelDefinedJson(modelName):
    return {
        "Type":"GetDataModelReq",
        "DataModelName": modelName
    }

# 删除模型
def deleteModel(modelName):
    return {
        "Type":"RemoveDataModelReq",
        "DataModelName": modelName
    }

# 编辑/新增模型
def upsertModel(props):
    return {
        "Type":"UpsertDataModelReq",
        "DataModelDefine": props
    }

# 发布模型
def publishModel(modelName):
    return {
        "Type":"LoadDataModelReq",
        "DataModelName": modelName
    }

# 获取配置信息模型模板
def getModelTemplate(key):
    return {
        "Type":"GetBOInfoReq",
        "DataModelName":"s_Conf",
        "BOName":"GlobalConf",
        "Where":"Key==\"%s\"&&Type==\"ModelDefineModel\"" % key,
        "Selector":"Value",
    }

# 获取模型运行时配置信息模型模板
def getModelClusterTemplate(key):
    return {
        "Type":"GetBOInfoReq",
        "DataModelName":"s_Conf",
        "BOName":"GlobalConf",
        "Where":"Key==\"%s\"&&Type==\"ModelDefineModel-RT\"" % key,
        "Selector":"Value",
    }

# 更新模型定义文件
def updateModelJsonForModel(definedJson, props):
    for k,v in props.items(): definedJson[k] = v
    return definedJson

# 更新模型定义文件
def updateModelJsonForNewDataNode(definedJson, parentNodeName, props):
    node = definedJson.get('DataNode')
    add_flag = False
    if isinstance(node, list):
        for n in node:
            if n.get('Name') == parentNodeName:
                if n.get('DataNode') and isinstance(n.get('DataNode'), list):
                    n['DataNode'].append(props)
                    add_flag = True
                    break
                else:
                    n['DataNode'] = [props]
                    add_flag = True
                    break
            elif n.get('DataNode'):
                dn = updateModelJsonForNewDataNode(n, parentNodeName, props)
                if dn is None: continue

                n['DataNode'] = dn
                add_flag = True
                break

        if add_flag: return node

    elif isinstance(node, dict):
        if node.get('Name') == parentNodeName:
            if node.get('DataNode') and isinstance(node.get('DataNode'), list):
                node['DataNode'].append(props)
                return node
            else:
                node['DataNode'] = [props]
                return node
        else:
            if not node.get('DataNode'): return

            dn = updateModelJsonForNewDataNode(node, parentNodeName,props)
            if dn is None: return

            node['DataNode'] = dn
            return node

# 更新模型定义文件:编辑DataNode
def updateModelJsonForDataNode(definedJson, nodeName, props):
    node = definedJson.get('DataNode')
    if isinstance(node, list):
        update_flag = False
        for n in node:
            if n.get('Name') == nodeName:
                n.update(props)
                update_flag = True
                break
            elif n.get('DataNode'):
                d = updateModelJsonForDataNode(n, nodeName, props)
                if d is None: continue

                n['DataNode'] = d
                update_flag = True
                break

        if update_flag: return node

    elif isinstance(node, dict):
        if node.get('Name') == nodeName:
            node.update(props)
            return node
        elif node.get('DataNode'):
            n = updateModelJsonForDataNode(node, nodeName, props)
            if n is None: return
            node['DataNode'] = n
            return node

# 更新模型定义文件 Index & Property
def updateModelJsonForDataNodeItems(definedJson, nodeName, props, category='Index'):
    node = definedJson.get('DataNode')
    update_flag = False
    if isinstance(node, list):
        for n in node:
            if n.get('Name') == nodeName:
                n[category] = props
                update_flag = True
                break
            elif n.get('DataNode'):
                d = updateModelJsonForDataNodeItems(n, nodeName, props, category)
                if d is None: continue

                n['DataNode'] = d
                update_flag = True
                break

        if update_flag: return node

    elif isinstance(node, dict):
        if node.get('Name') == nodeName:
            node[category] = props
            return node
        else:
            if node.get('DataNode'):
                d = updateModelJsonForDataNodeItems(node, nodeName, props, category)
                if d is None: return
                node['DataNode'] = d
                return node

# 更新模型定义文件
def updateModelJsonForRemoveDataNode(definedJson, nodeName):
    node = definedJson.get('DataNode')
    if isinstance(node, list):
        i = 0
        remove_flag = False
        update_flag = False
        for n in node:
            if n.get('Name') == nodeName:
                remove_flag = True
                break
            elif n.get('DataNode'):
                d = updateModelJsonForRemoveDataNode(n, nodeName)
                if d is None: continue

                n['DataNode'] = d
                update_flag = True
                break
            i += 1

        if remove_flag: node.pop(i)
        if remove_flag or update_flag: return node

    elif isinstance(node, dict):
        if node.get('Name') == nodeName: return {}
        elif node.get('DataNode'):
            d = updateModelJsonForRemoveDataNode(node, nodeName)
            if d is None: return
            if isinstance(d, list):
                if len(d) == 0: node.pop('DataNode')
                else: node['DataNode'] = d

                return node

# 获取节点集群状态列表
def getClusterStates():
    return { "Type":"GetClusterStateReq" }

# 获取节点集群状态单节点信息列表
def getClusterNodeStates(node_id, page_index, page_size):
    return {
        "Type":"GetDataModelStateReq",
        "NodeID": node_id,
        "DataModelName":[],
        "PageIndex": page_index,
        "PageLine": page_size,
    }
