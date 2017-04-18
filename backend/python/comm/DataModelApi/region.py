#! /bin/env python
#-*- coding:utf-8 -*-
import json, sys

'''
    区域架构相关dataModel请求消息api
    区域架构树、设备、相关人员、标签
'''

# 查询区域子孙节点
def getDescendantAuthNodeIdsFromParent(parentId, auth_nodes):
    return {
        "Type":"GetDescendantBOInfoReq",
        "DataModelName":"s_AreaMan",
        "BOName":"Area",
        "Where":"ID==\"%s\"" % parentId,
        "SelectBO":"Area",
        "Selector": "ID",
        "SelectWhere":"ID IN \"{%s}\"" % ','.join(auth_nodes),
    }

# 区域架构：搜索节点
def searchNodes(keyword, auth_nodes, top, page_index=None, page_size=None):
    msg = {
        "Type":"GetImmediateAndSelfBOInfoReq",
        "DataModelName":"s_AreaMan",
        "BOName":"Area",
        "Where":"ID IN \"{%s}\"" % ','.join(auth_nodes), #Tail为true的区域节点
        "SelectBO":"Area",
        "SelectWhere":"en_US LIKE \"%%%s%%\"||zh_CN LIKE \"%%%s%%\"" % ((keyword,) * 2),
        "Selector":"Name,Type,ID"
    }
    if top < 0:
        msg["PageIndex"] = page_index
        msg["PageLine"] = page_size
    else:
        msg["Top"] = top

    return msg

# 区域架构：搜索节点结果总数
def searchNodesCount(keyword, auth_nodes):
    return {
        "Type":"GetImmediateAndSelfBOCountReq",
        "DataModelName":"s_AreaMan",
        "BOName":"Area",
        "Where":"ID IN \"{%s}\"" % ','.join(auth_nodes), #Tail为true的区域节点
        "SelectBO":"Area",
        "SelectWhere":"en_US LIKE \"%%%s%%\"||zh_CN LIKE \"%%%s%%\"" % ((keyword,) * 2)
    }

# 区域架构：搜索设备
def searchDevices(keyword, auth_nodes, top, page_index=None, page_size=None):
    msg = {
        "Type":"GetDescendantBOInfoReq",
        "DataModelName":"s_AreaMan",
        "BOName":"Area",
        "Where":"ID IN \"{%s}\"" % ','.join(auth_nodes), #Tail为true的区域节点
        "SelectBO":"NSDevices",
        "SelectWhere":"DeviceType LIKE \"%%%s%%\"|| DeviceName LIKE \"%%%s%%\"||DeviceID LIKE \"%%%s%%\"" % ((keyword,) * 3),
        "Selector":"DeviceID,DeviceName,DeviceType",
    }
    if top < 0:
        msg["PageIndex"] = page_index
        msg["PageLine"] = page_size
    else:
        msg["Top"] = top

    return msg

# 区域架构：搜索设备结果总数
def searchDevicesCount(keyword, auth_nodes):
    return {
        "Type":"GetDescendantBOCountReq",
        "DataModelName":"s_AreaMan",
        "BOName":"Area",
        "Where":"ID IN \"{%s}\"" % ','.join(auth_nodes), #Tail为true的区域节点
        "SelectBO":"NSDevices",
        "SelectWhere":"DeviceType LIKE \"%%%s%%\"|| DeviceName LIKE \"%%%s%%\"||DeviceID LIKE \"%%%s%%\"" % ((keyword,) * 3),
    }

# 区域架构：搜索人员
def searchMembers(keyword, auth_nodes, top, page_index=None, page_size=None):
    msg = {
        "Type":"GetDescendantBOInfoReq",
        "DataModelName":"s_AreaMan",
        "BOName":"Area",
        "Where":"ID IN \"{%s}\"" % ','.join(auth_nodes), #Tail为true的区域节点
        "SelectBO":"NSUsers",
        "SelectWhere":"Name LIKE \"%%%s%%\"||UserID LIKE \"%%%s%%\"" % ((keyword,) * 2),
        "Selector":"UserID,Name",
    }
    if top < 0:
        msg["PageIndex"] = page_index
        msg["PageLine"] = page_size
    else:
        msg["Top"] = top

    return msg

# 区域架构：搜索人员
def searchMembersCount(keyword, auth_nodes):
    return {
        "Type":"GetDescendantBOCountReq",
        "DataModelName":"s_AreaMan",
        "BOName":"Area",
        "Where":"ID IN \"{%s}\"" % ','.join(auth_nodes), #Tail为true的区域节点
        "SelectBO":"NSUsers",
        "SelectWhere":"Name LIKE \"%%%s%%\"||UserID LIKE \"%%%s%%\"" % ((keyword,) * 2),
    }

# 获取区域架构树
def regionTree(role_ids):
    return {
        "Type":"GetRoleBindBOTreeReq",
        "DataModelName":"s_AreaMan",
        "BOName":"Area",
        "OrderBy":"OrderbyIndex",
        "RoleArr": role_ids
    }

# 获取区域架构子节点
def regionChildren(parent_id):
    return {
        "Type":"GetChildrenBOInfoReq",
        "DataModelName":"s_AreaMan",
        "BOName":"Area",
        "Where":"ID==\"%s\"" % parent_id,
        "SelectBO":"Area",
        "OrderBy":"OrderbyIndex",
    }

# 修改区域架构树-添加节点
def addNode(parent_id, node_id, node_name, node_type, orderby_index):
    props = {
        "Enable": "True",
        "ID": node_id,
        "Name": node_name,
        "zh_CN": node_name,
        "en_US": "",
        "Type": node_type,
        "OrderbyIndex": orderby_index
    }

    return {
        "Type":"AddBOInfoReq",
        "DataModelName":"s_AreaMan",
        "ParentBOName":"Area",
        "ParentWhere":"ID==\"%s\"" % parent_id,
        "BOName":"Area",
        "BOProps": [props]
    }

# 修改区域架构树-修改节点
def modifyNode(node_id, props):
    return {
        "Type":"ModifyBOInfoReq",
        "DataModelName":"s_AreaMan",
        "BOName":"Area",
        "Where":"ID==\"%s\"" % node_id,
        "BOProps": [props]
    }

# 修改区域架构树-删除节点
def deleteNode(node_id):
    return {
        "Type":"RemoveBOInfoReq",
        "DataModelName":"s_AreaMan",
        "BOName":"Area",
        "Where":"ID==\"%s\"" % node_id,
    }

# 区域架构树-节点选项
# 国家、省、城市
def nodeOptions(node_type, parent_id=None):
    if node_type == 'NSCountrys':
        msg = {
            "Type":"GetBOInfoReq",
            "DataModelName":"s_GeographyInfo",
            "BOName":"Area",
            "Where":"Type==\"NSCountrys\"",
        }
    elif node_type in ('NSStations', 'NSCitys'):
        msg = {
            "Type":"GetChildrenBOInfoReq",
            "DataModelName":"s_GeographyInfo",
            "BOName":"Area",
            "Where":"ID==\"%s\"" % parent_id,
            "SelectBO":"Area",
        }
    return msg

# 获取区域架构子节点路径
# 根据区域架构节点ID-查询所有祖先节点
def getNodePath(region_ids):
    return {
        "Type":"GetNodeOrgPathReq",
        "DataModelName":"s_AreaMan",
        "ContainSelf":"true",
        "BOName":"Area",
        "PathBOName":"Area",
        "Where":"ID IN \"{%s}\"" % ','.join(region_ids)
    }

#查单个设备信息
def getDeviceInfo(device_id, al=None):
    msg = {
        "Type":"GetBOInfoReq",
        "DataModelName":"s_AreaMan",
        "BOName":"NSDevices",
        "Where":"DeviceID==\"%s\"" % device_id
    }
    if al is None:
        msg["Selector"] = "DeviceID,DeviceName,Enable,Top,Latitude,Longitude,SetupTime,SetupPlace,DeviceType,RTDBID,RelatedFlowChartID"

    return msg

#通过区域节点查设备信息列表
def getDeviceListByRegionId(auth_nodes, page_index=None, page_size=None, **kwargs):
    msg = {
        "Type":"GetDescendantBOInfoReq",
        "DataModelName":"s_AreaMan",
        "BOName":"Area",
        #"Where":"ID==\"%s\"" % region_id,
        "Where":"ID IN \"{%s}\"" % ','.join(auth_nodes), #Tail为true的区域节点
        "SelectBO":"NSDevices",
        "OrderBy":["Top", "OrderbyIndex"],
        "OrderType":["desc", "asc"]
    }
    if page_index and page_size:
        msg['PageIndex'] = page_index
        msg['PageLine'] = page_size

    return msg

#通过设备id查询设备信息列表
def getDeviceListByFilter(device_ids, page_index=None, page_size=None, **kwargs):
    msg = {
        "Type":"GetBOInfoReq",
        "DataModelName":"s_AreaMan",
        "BOName":"NSDevices",
        "Where":"DeviceID IN \"{%s}\"" % ','.join(device_ids),
    }
    if page_index and page_size:
        msg['PageIndex'] = page_index
        msg['PageLine'] = page_size

    return msg

# 查询用户已关注设备列表
def getTaggedDevices(user_id, tag_name, page_index=None, page_size=None, **kwargs):
    msg = {
        "Type": "GetChildrenBOInfoReq",
        "DataModelName": "s_UsrMan",
        "BOName": "Tag",
        "WhereType": "NEST",
        "Where": {
            "Type": "GetChildrenBO",
            "BOName": "NSUsers",
            "Where": "UserID==\"%s\"" % user_id,
            "SelectBO": "Tag",
            "SelectWhere": "Name==\"%s\"" % tag_name
            },
        "SelectBO": "FocusDevices"
    }
    if page_index and page_size:
        msg["PageIndex"] = page_index
        msg["PageLine"]= page_size

    for k,v in kwargs.items():
        if k == 'seletor':
            msg["Seletor"] = v
        elif k == 'filter_device_id':
            msg['SelectWhere'] = "DeviceID==\"%s\"" % v

    return msg

# 查询区域架构节点子孙满足条件的设备个数
def getDeviceCount(auth_nodes, **kwargs):
    msg = {
        "Type":"GetDescendantBOCountReq",
        "DataModelName":"s_AreaMan",
        "BOName":"Area",
        #"Where":"ID==\"%s\"" % region_id,
        "Where":"ID IN \"{%s}\"" % ','.join(auth_nodes), #Tail为true的区域节点
        "SelectBO":"NSDevices",
    }
    if kwargs:
        if 'filter_device_ids' in kwargs:
            msg["SelectWhere"] = "DeviceID IN \"{%s}\"" % ','.join(kwargs['filter_device_ids'])

        else:
            select = []
            for k,v in kwargs.items():
                select.append("%s==\"%s\"" % (k, v))

            msg["SelectWhere"] = " && ".join(select)

    return msg

#查询设备区域架构路径
def getDevicePath(device_id):
    return {
        "Type":"GetNodeOrgPathReq",
        "DataModelName":"s_AreaMan",
        "BOName":"NSDevices",
        "Where":"DeviceID==\"%s\"" % device_id
    }

# 新建设备
def newDevice(props):
    return {
        "Type":"AddBOInfoReq",
        "DataModelName":"s_DeviceMan",
        "ParentBOName":"",
        "ParentWhere":"",
        "BOName":"NSDevices",
        "BOProps":[props]
    }

# 编辑设备
def modifyDevice(device_id, props):
    return {
        "Type":"ModifyBOInfoReq",
        "DataModelName":"s_DeviceMan",
        "BOName":"NSDevices",
        "Where":"DeviceID==\"%s\"" % device_id,
        "BOProps": [props]
    }

# 删除设备
def deleteDevice(device_ids):
    return {
        "Type":"RemoveBOInfoReq",
        "DataModelName":"s_DeviceMan",
        "BOName":"NSDevices",
        "Where":"DeviceID IN \"{%s}\"" % ','.join(device_ids)
    }

# 置顶设备
def topDevice(device_id, is_top):
    return {
        "Type":"ModifyBOInfoReq",
        "DataModelName":"s_AreaMan",
        "BOName":"NSDevices",
        "Where":"DeviceID==\"%s\"" % device_id,
        "BOProps": [{'Top': is_top}]
    }

# 将设备添加到区域架构公司节点
def addDeviceToRegionTree(company_id, device_props):
    return {
        "Type":"AddBOInfoReq",
        "DataModelName":"s_AreaMan",
        "ParentBOName":"Area",
        "ParentWhere":"ID==\"%s\"" % company_id,
        "BOName":"NSDevices",
        "BOProps":[device_props]
    }

# 移动设备
def moveDevice(device_ids, company_id):
    return {
        "Type":"ModifyBORelationReq",
        "DataModelName":"s_AreaMan",
        "BOName":"NSDevices",
        "Where":"DeviceID IN \"{%s}\"" % ','.join(device_ids),
        "NewParentBOName":"Area",
        "NewParentWhere":"ID==\"%s\"" % company_id,
    }

# 为设备添加标签
def tagDevice(user_id, device_infos, tag_names):
    return {
        "Type":"AddBOInfoReq",
        "DataModelName":"s_UsrMan",
        "ParentBOName":"Tag",
        "BOName":"FocusDevices",
        "BOProps": device_infos,
        "ParentWhere":"UserID==\"%s\"&&Name IN \"{%s}\"" % (user_id, ','.join(tag_names))
    }

# 为设备移除标签
def unTagDevice(user_id, device_ids, tag_names):
    return {
        "Type":"RemoveChildrenBOInfoReq",
        "DataModelName":"s_UsrMan",
        "BOName":"Tag",
        "SelectBO":"FocusDevices",
        "SelectWhere":"DeviceID IN \"{%s}\"" % ','.join(device_ids),
        "Where":"UserID==\"%s\"&&Name IN \"{%s}\"" % (user_id, ','.join(tag_names))
    }

# 新增、修改、删除设备驱动
def modifyDeviceDriver(device_ID, props):
    return {
        "Type":"CommitChangeReq",
        "DataModelName":"s_DeviceMan",
        "PartionNodes": [device_ID],
        "ModifyContent": props
    }

# 设备驱动，获取相同Com口的设备编号
def getDeviceComPort(device_id, com_port):
    return {
        "Type" : "GetDuplicateDeviceComPortReq",
        "DeviceID" : device_id,
        "ParamentBO" : "NSDevicesCommunicateParameter",
        "ParamentWhere" : "ParameterName==\"CommParameter\" && ParameterValue LIKE\"%s%%\"" % com_port
    }

#通过区域节点查相关人员信息列表
def getMemberListByRegionId(region_id, page_index=None, page_size=None, **kwargs):
    msg = {
        "Type":"GetChildrenBOInfoReq",
        "DataModelName":"s_AreaMan",
        "BOName":"Area",
        "Where":"ID==\"%s\"" % region_id,
        #"Where":"ID IN \"{%s}\"" % ','.join(auth_nodes), #Tail为true的区域节点
        "SelectBO":"NSUsers",
        "Selector": "UserID,Enable,Tel,Name,WeixinID,Email,Top,GpsTimeStamp",
        "OrderBy":["Top", "OrderbyIndex"],
        "OrderType":["desc", "asc"],
    }
    if page_index and page_size:
        msg['PageIndex'] = page_index
        msg['PageLine'] = page_size

    if kwargs:
        if 'filter_member_ids' in kwargs:
            msg['SelectWhere'] = "UserID IN \"{%s}\"" % ','.join(kwargs['filter_member_ids'])
        if 'filter_member_id' in kwargs:
            msg['SelectWhere'] = "UserID==\"%s\"" % kwargs['filter_member_id']

    return msg

# 通过区域节点查询相关人员个数
def getMemberCountByRegionId(region_id, **kwargs):
    msg = {
        "Type":"GetChildrenBOCountReq",
        "DataModelName":"s_AreaMan",
        "BOName":"Area",
        "Where":"ID==\"%s\"" % region_id,
        # "Where":"ID IN \"{%s}\"" % ','.join(auth_nodes), #Tail为true的区域节点
        "SelectBO":"NSUsers",
    }
    if kwargs:
        if 'Enable' in kwargs:
            msg["SelectWhere"] = "Enable==\"%s\"" % kwargs['Enable']
        elif 'filter_member_ids' in kwargs:
            msg["SelectWhere"] = "UserID IN \"{%s}\"" % ','.join(kwargs['filter_member_ids'])

    return msg

# 查询用户信息
def getMemberInfos(memberIds):
    return {
        "Type": "GetBOInfoReq",
        "DataModelName": "s_UsrMan",
        "BOName": "NSUsers",
        "Where": "UserID IN \"{%s}\"" % ','.join(memberIds),
    }

# 查询单个用户信息
def getMemberInfo(memberId):
    return {
        "Type": "GetBOInfoReq",
        "DataModelName": "s_UsrMan",
        "BOName": "NSUsers",
        "Where": "UserID==\"%s\"" % memberId
    }

# 查询区域架构下单个用户信息
def getMemberInfoFromRegionTree(memberId):
    return {
        "Type": "GetBOInfoReq",
        "DataModelName": "s_AreaMan",
        "BOName": "NSUsers",
        "Where": "UserID==\"%s\"" % memberId,
        "Selector": "UserID,Enable,Tel,Name,WeixinID,Email,Top,GpsTimeStamp",
        "Distinct":"UserID"
    }

# 查询用户已关注人员列表
def getTaggedMembers(user_id, tag_name, page_index=None, page_size=None, **kwargs):
    msg = {
        "Type": "GetChildrenBOInfoReq",
        "DataModelName": "s_UsrMan",
        "BOName": "Tag",
        "WhereType": "NEST",
        "Where": {
            "Type": "GetChildrenBO",
            "BOName": "NSUsers",
            "Where": "UserID==\"%s\"" % user_id,
            "SelectBO": "Tag",
            "SelectWhere": "Name==\"%s\"" % tag_name
            },
        "SelectBO": "FocusUsers"
    }
    if page_index and page_size:
        msg["PageIndex"] = page_index
        msg["PageLine"]= page_size

    for k,v in kwargs.items():
        if k == 'seletor':
            msg["Seletor"] = v
        elif k == 'filter_member_id':
            msg['SelectWhere'] = "UserID==\"%s\"" % v

    return msg

#查询相关人员区域架构路径
def getMemberPath(member_id):
    return {
        "Type":"GetNodeOrgPathReq",
        "DataModelName":"s_AreaMan",
        "BOName":"NSUsers",
        "Where":"UserID==\"%s\"" % member_id
    }

# 将人员添加到区域架构节点
def addMemberToRegionTree(region_id, member_infos):
    return {
        "Type":"AddBOInfoReq",
        "DataModelName":"s_AreaMan",
        "ParentBOName":"Area",
        "ParentWhere":"ID==\"%s\"" % region_id,
        "BOName":"NSUsers",
        "BOProps": member_infos
    }

# 将人员从区域架构节点上移除
def removeMemberFromRegionTree(region_id, member_ids):
    return {
        "Type":"RemoveChildrenBOInfoReq",
        "DataModelName":"s_AreaMan",
        "BOName":"Area",
        "Where":"ID==\"%s\"" % region_id,
        "SelectBO":"NSUsers",
        "SelectWhere":"UserID IN \"{%s}\"" % ','.join(member_ids),
    }

# 为人员添加标签
def tagMember(user_id, member_infos, tag_names):
    return {
        "Type":"AddBOInfoReq",
        "DataModelName":"s_UsrMan",
        "ParentBOName":"Tag",
        "BOName":"FocusUsers",
        "BOProps": member_infos,
        "ParentWhere":"UserID==\"%s\"&&Name IN \"{%s}\"" % (user_id, ','.join(tag_names))
    }

# 为人员移除标签
def unTagMember(user_id, member_ids, tag_names):
    return {
        "Type":"RemoveChildrenBOInfoReq",
        "DataModelName":"s_UsrMan",
        "BOName":"Tag",
        "SelectBO":"FocusUsers",
        "SelectWhere":"UserID IN \"{%s}\"" % ','.join(member_ids),
        "Where":"UserID==\"%s\"&&Name IN \"{%s}\"" % (user_id, ','.join(tag_names))
    }

# 置顶人员
def topMember(dept_user_id, is_top):
    return {
        "Type":"ModifyBOInfoReq",
        "DataModelName":"s_AreaMan",
        "BOName":"NSUsers",
        "Where":"UserID==\"%s\"" % device_id,
        "BOProps": [{'Top': is_top}]
    }

# 查询用户标签列表
def getTagList(user_id, tag_name=None, page_index=None, page_size=None):
    msg = {
        "Type":"GetChildrenBOInfoReq",
        "DataModelName":"s_UsrMan",
        "BOName":"NSUsers",
        "Where":"UserID==\"%s\"" % user_id,
        "SelectBO":"Tag",
        "AddNodeID":"true",
    }
    if tag_name is not None:
        msg["Where"] = "UserID==\"%s\" && Name==\"%s\"" % (user_id, tag_name)

    if page_index and page_size:
        msg["PageIndex"] = page_index
        msg["PageLine"] = page_size

    return msg

# 标签列表
def tagList(user_id):
    return {
        "Type":"GetChildrenBOInfoReq",
        "DataModelName":"s_UsrMan",
        "BOName":"NSUsers",
        "Where":"UserID==\"%s\"" % user_id,
        "SelectBO":"Tag",
        "AddNodeID":"true",
    }

# 标签下设备or人员个数
def getTargetCountByTag(user_id, tag_name, *args):
    msg = {
        "Type": "GetChildrenBOCountReq",
        "DataModelName": "s_UsrMan",
        "BOName": "Tag",
        "WhereType": "NEST",
        "Where": {
            "Type": "GetChildrenBO",
            "BOName": "NSUsers",
            "Where": "UserID==\"%s\"" % user_id,
            "SelectBO": "Tag",
            "SelectWhere": "Name==\"%s\"" % tag_name
            },
    }

    if 'user' in args:
        msg["SelectBO"] = "FocusUsers"
    elif 'device' in args:
        msg["SelectBO"] = "FocusDevices"

    return msg

# 添加标签
def newTag(user_id, props):
    return {
        "Type":"AddBOInfoReq",
        "DataModelName":"s_UsrMan",
        "ParentBOName":"NSUsers",
        "ParentWhere":"UserID==\"%s\"" % user_id,
        "BOName":"Tag",
        "BOProps": [props]
    }

# 修改标签
def modifyTag(user_id, orginalTagName, newTagName):
    return {
        "Type":"ModifyBOInfoReq",
        "DataModelName":"s_UsrMan",
        "BOName":"Tag",
        "Where":"UserID==\"%s\"&&Name==\"%s\"" % (user_id, orginalTagName),
        "BOProps": [{"Name": newTagName}]
    }

# 删除标签
def deleteTag(user_id, tagName):
    return {
        "Type":"RemoveChildrenBOInfoReq",
        "DataModelName":"s_UsrMan",
        "BOName":"NSUsers",
        "Where":"UserID==\"%s\"" % user_id,
        "SelectBO":"Tag",
        "SelectWhere":"Name==\"%s\"" % tagName
    }

# 标签下设备or人员列表
def getTargetListByTag(user_id, tagName, page_index=None, page_size=None, *args):
    msg = {
        "Type": "GetChildrenBOInfoReq",
        "DataModelName": "s_UsrMan",
        "BOName": "Tag",
        "WhereType": "NEST",
        "Where": {
            "Type": "GetChildrenBO",
            "BOName": "NSUsers",
            "Where": "UserID==\"%s\"" % user_id,
            "SelectBO": "Tag",
            "SelectWhere": "Name==\"%s\"" % tagName
            }
    }
    if 'user' in args:
        msg["SelectBO"] = "FocusUsers"
    if 'device' in args:
        msg["SelectBO"] = "FocusDevices"

    if page_index is not None and page_size is not None:
        msg["PageIndex"] = page_index
        msg["PageLine"] = page_size

    return msg
