#! /bin/env python
#-*- coding:utf-8 -*-
import json, sys

'''
    组织架构相关dataModel请求消息api
    组织架构树、设备、相关人员、标签
'''

# 查询组织架构子孙节点
def getDescendantAuthNodeIdsFromParent(parentId, auth_nodes):
    return {
        "Type":"GetDescendantBOInfoReq",
        "DataModelName":"s_OrgMan",
        "BOName":"Organization",
        # "Where":"ID==\"%s\"" % parentId,
        "SelectWhere":"ID==\"%s\"" % parentId,
        "SelectBO":"Organization",
        "Selector": "ID",
        #"SelectWhere":"ID IN \"{%s}\"" % ','.join(auth_nodes),
        "Where":"ID IN \"{%s}\"" % ','.join(auth_nodes),
    }

# 组织架构：搜索节点
def searchNodes(keyword, auth_nodes, top, page_index=None, page_size=None):
    msg = {
        "Type":"GetImmediateAndSelfBOInfoReq",
        "DataModelName":"s_OrgMan",
        "BOName":"Organization",
        "Where":"ID IN \"{%s}\"" % ','.join(auth_nodes), #Tail为true的组织节点
        "SelectBO":"Organization",
        "SelectWhere":"Name LIKE \"%%%s%%\"" % keyword,
        "Selector":"Name,Type,ID"
    }
    if top < 0:
        msg["PageIndex"] = page_index
        msg["PageLine"] = page_size
    else:
        msg["Top"] = top

    return msg

# 组织架构：搜索节点结果总数
def searchNodesCount(keyword, auth_nodes):
    return {
        "Type":"GetImmediateAndSelfBOCountReq",
        "DataModelName":"s_OrgMan",
        "BOName":"Organization",
        "Where":"ID IN \"{%s}\"" % ','.join(auth_nodes), #Tail为true的组织节点
        "SelectBO":"Organization",
        "SelectWhere":"en_US LIKE \"%%%s%%\"||zh_CN LIKE \"%%%s%%\"" % ((keyword,) * 2)
    }

# 组织架构：搜索人员
def searchUsers(keyword, auth_nodes, top, page_index=None, page_size=None):
    msg = {
        "Type":"GetDescendantBOInfoReq",
        "DataModelName":"s_OrgMan",
        "BOName":"Organization",
        "Where":"ID IN \"{%s}\"" % ','.join(auth_nodes), #Tail为true的组织节点
        "SelectBO":"NSUsers",
        "SelectWhere":"Name LIKE \"%%%s%%\"||UserID LIKE \"%%%s%%\"" % ((keyword,) * 2),
        "Selector":"UserID,Name",
        "Distinct":"UserID"
    }
    if top < 0:
        msg["PageIndex"] = page_index
        msg["PageLine"] = page_size
    else:
        msg["Top"] = top

    return msg

# 组织架构：搜索人员
def searchUsersCount(keyword, auth_nodes):
    return {
        "Type":"GetDescendantBOCountReq",
        "DataModelName":"s_OrgMan",
        "BOName":"Organ0zation",
        "Where":"ID IN \"{%s}\"" % ','.join(auth_nodes), #Tail为true的组织节点
        "SelectBO":"NSUsers",
        "SelectWhere":"Name LIKE \"%%%s%%\"||UserID LIKE \"%%%s%%\"" % ((keyword,) * 2),
    }

# 获取组织架构树
def deptTree(role_ids):
    return {
        "Type":"GetRoleBindBOTreeReq",
        "DataModelName":"s_OrgMan",
        "BOName":"Organization",
        "OrderBy":"OrderbyIndex",
        "Selector": "Tail,Type,ID,Name,OrderbyIndex",
        "RoleArr": role_ids
    }

# 获取组织架构子节点
def deptChildren(parent_id):
    return {
        "Type":"GetChildrenBOInfoReq",
        "DataModelName":"s_OrgMan",
        "BOName":"Organization",
        "Where":"ID==\"%s\"" % parent_id,
        "SelectBO":"Organization",
        "OrderBy":"OrderbyIndex",
    }

# 修改组织架构树-添加节点
def addNode(parent_id, node_id, node_name, orderby_index):
    props = {
        "ID": node_id,
        "Name": node_name,
        "Type": 'Department',
        "OrderbyIndex": orderby_index
    }

    return {
        "Type":"AddBOInfoReq",
        "DataModelName":"s_OrgMan",
        "ParentBOName":"Organization",
        "ParentWhere":"ID==\"%s\"" % parent_id,
        "BOName":"Organization",
        "BOProps": [props]
    }

# 修改组织架构树-修改节点
def modifyNode(node_id, props):
    return {
        "Type":"ModifyBOInfoReq",
        "DataModelName":"s_OrgMan",
        "BOName":"Organization",
        "Where":"ID==\"%s\"" % node_id,
        "BOProps": [props]
    }

# 修改组织架构树-删除节点
def deleteNode(node_id):
    return {
        "Type":"RemoveBOInfoReq",
        "DataModelName":"s_OrgMan",
        "BOName":"Organization",
        "Where":"ID==\"%s\"" % node_id,
    }

# 修改组织架构树-删除节点
def moveNode(node_id,new_parent_id):
    return {
        "Type":"ModifyBORelationReq",
        "DataModelName":"s_OrgMan",
        "BOName":"Organization",
        "Where":"ID==\"%s\"" % node_id,
        "NewParentBOName":"Organization",
        "NewParentWhere":"ID==\"%s\"" % new_parent_id
    }


# 获取组织架构子节点路径
# 根据组织架构节点ID-查询所有祖先节点
def getNodePath(dept_ids):
    return {
        "Type":"GetNodeOrgPathReq",
        "DataModelName":"s_OrgMan",
        "ContainSelf":"true",
        "BOName":"Organization",
        "PathBOName":"Organization",
        "Where":"ID IN \"{%s}\"" % ','.join(dept_ids)
    }

#查单个人员信息
def getUserInfo(dept_user_id, al=None):
    msg = {
        "Type":"GetBOInfoReq",
        "DataModelName":"s_OrgMan",
        "BOName":"NSDevices",
        "Where":"DeviceID==\"%s\"" % device_id
    }
    if al is None:
        msg["Selector"] = "DeviceID,DeviceName,Enable,Top,Latitude,Longitude,SetupTime,SetupPlace,DeviceType,RTDBID,RelatedFlowChartID"

    return msg

#通过组织节点查人员信息列表
def getUserListByDepartmentId(auth_nodes, page_index=None, page_size=None, **kwargs):
    msg = {
        "Type":"GetChildrenBOInfoReq",
        "DataModelName":"s_OrgMan",
        "BOName":"Organization",
        #"Where": "ID==\"%s\"" % dept_id,
        "Where":"ID IN \"{%s}\"" % ','.join(auth_nodes),
        "SelectBO":"NSUsers",
        "Selector": "UserID,Enable,Tel,Name,WeixinID,Email,Top,GpsTimeStamp",
        "OrderBy":["Top", "OrderbyIndex"],
        "OrderType":["desc", "asc"],
    }
    if page_index and page_size:
        msg['PageIndex'] = page_index
        msg['PageLine'] = page_size

    return msg

# 查询组织架构节点下用户信息
def getUserListByFilter(dept_id, dept_user_ids):
    msg = {
        "Type":"GetChildrenBOInfoReq",
        "DataModelName":"s_OrgMan",
        "BOName":"Organization",
        "Where":"ID==\"%s\"" % dept_id,
        "SelectBO":"NSUsers",
        "SelectWhere":"UserID IN \"{%s}\"" % ','.join(dept_user_ids)
    }

    return msg

# 获取用户信息[全局]
def getUserInfo(dept_user_ids, **kwargs):
    msg = {
        "Type": "GetBOInfoReq",
        "DataModelName": "s_UsrMan",
        "BOName": "NSUsers",
        "Where": "UserID IN \"{%s}\"" % ','.join(dept_user_ids)
    }

    if kwargs:
        if 'selector' in kwargs: msg['Selector'] = kwargs['selector']

    return msg

# 获取用户组织架构下信息
def getUserInfoFromDepartmentTree(dept_user_ids):
    return {
        "Type": "GetBOInfoReq",
        "DataModelName": "s_OrgMan",
        "BOName": "NSUsers",
        #"Selector": "UserID,Enable,Tel,Name,WeixinID,Email,Top,GpsTimeStamp",
        "Where": "UserID IN \"{%s}\"" % ','.join(dept_user_ids)
    }

# 查询组织架构节点满足条件的人员个数
def getUserCount(auth_nodes, **kwargs):
    msg = {
        "Type":"GetChildrenBOCountReq",
        "DataModelName":"s_OrgMan",
        "BOName":"Organization",
        # "Where":"ID==\"%s\"" % dept_id,
        "Where":"ID IN \"{%s}\"" % ','.join(auth_nodes),
        "SelectBO":"NSUsers",
    }
    if kwargs:
        select = []
        for k,v in kwargs.items():
            select.append("%s==\"%s\"" % (k, v))

        msg["SelectWhere"] = " && ".join(select)

    return msg

#查询人员组织架构路径
def getUserPath(dept_user_id):
    return {
        "Type":"GetNodeOrgPathReq",
        "DataModelName":"s_OrgMan",
        "BOName":"NSUsers",
        "Where":"UserID==\"%s\"" % dept_user_id
    }

#查询人员组织架构路径
def getUserPath(dept_user_id):
    return {
        "Type":"GetNodeOrgPathReq",
        "DataModelName":"s_OrgMan",
        "BOName":"NSUsers",
        "Where":"UserID==\"%s\"" % dept_user_id
    }

# 新建人员
def newUser(props):
    return {
        "Type":"AddBOInfoReq",
        "DataModelName":"s_UsrMan",
        "ParentBOName":"",
        "ParentWhere":"",
        "BOName":"NSUsers",
        "BOProps":[props]
    }

# 编辑人员
def modifyUser(dept_user_id, props):
    return {
        "Type":"ModifyBOInfoReq",
        "DataModelName":"s_UsrMan",
        "BOName":"NSUsers",
        "Where":"UserID==\"%s\"" % dept_user_id,
        "BOProps": [props]
    }

# 删除人员
def deleteUser(dept_user_ids):
    return {
        "Type":"RemoveBOInfoReq",
        "DataModelName":"s_UsrMan",
        "BOName":"NSUsers",
        "Where":"UserID IN \"{%s}\"" % ','.join(dept_user_ids)
    }

# 置顶人员
def topUser(dept_user_id, is_top):
    return {
        "Type":"ModifyBOInfoReq",
        "DataModelName":"s_OrgMan",
        "BOName":"NSUsers",
        "Where":"UserID==\"%s\"" % device_id,
        "BOProps": [{'Top': is_top}]
    }

# 移动人员
def moveUser(dept_user_id, add_ids=[], remove_ids=[]):
    return {
        "Type":"UserAuthReq",
        "DataModelName":"s_OrgMan",
        "BOName":"Organization",
        "UserID": dept_user_id,
        "RemoveList": remove_ids,
        "AddList": add_ids
    }

# 将人员添加到组织架构节点
def addUserToDepartmentTree(dept_id, user_props_list):
    return {
        "Type":"AddBOInfoReq",
        "DataModelName":"s_OrgMan",
        "ParentBOName":"Organization",
        "ParentWhere":"ID==\"%s\"" % dept_id,
        "BOName":"NSUsers",
        "BOProps": user_props_list
    }

# 将人员从组织架构节点上移除
def removeUserFromDepartmentTree(dept_id, dept_user_ids):
    return {
        "Type":"RemoveChildrenBOInfoReq",
        "DataModelName":"s_OrgMan",
        "BOName":"Organization",
        "Where":"ID==\"%s\"" % dept_id,
        "SelectBO":"NSUsers",
        "SelectWhere":"UserID IN \"{%s}\"" % ','.join(dept_user_ids)
    }
