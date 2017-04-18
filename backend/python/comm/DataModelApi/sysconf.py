#! /bin/env python
#-*- coding:utf-8 -*-
import json, sys

'''
    系统设置相关dataModel请求消息api
    系统菜单管理、角色管理、字典管理、日志
'''

# 获取字典信息
def dictOptions(t):
    return {
        "Type":"GetBOInfoReq",
        "DataModelName":"s_DictMan",
        "BOName":"KVPair",
        "Where":"Type==\"%s\"" % t,
        "Selector":"Key,Value",
        "OrderBy":"OrderbyIndex",
    }

# 获取字典列表
def dictList(page_index=None, page_size=None):
    msg = {
        "Type":"GetBOInfoReq",
        "DataModelName":"s_DictMan",
        "BOName":"KVPair",
        "Where":"",
        "AddNodeID": True,
        "OrderBy":["Type", "OrderbyIndex"]
    }

    if page_index and page_size:
        msg["PageIndex"] = page_index
        msg["PageLine"] = page_size

    return msg


# 字典管理：新增
def newDict(props):
    return {
        "Type":"AddBOInfoReq",
        "DataModelName":"s_DictMan",
        "ParentBOName":"",
        "ParentWhere":"",
        "BOName":"KVPair",
        "BOProps": props
    }

# 字典管理：编辑
def modifyDict(k, t, props):
    return {
        "Type":"ModifyBOInfoReq",
        "DataModelName":"s_DictMan",
        "BOName":"KVPair",
        "Where":"Key==\"%s\" && Type==\"%s\"" % (k, t),
        "BOProps": [props]
    }

# 字典管理： 删除
def deleteDict(k, t):
    return {
        "Type":"RemoveBOInfoReq",
        "DataModelName":"s_DictMan",
        "BOName":"KVPair",
        "Where":"Key==\"%s\" && Type==\"%s\"" % (k, t)
    }

# 角色列表
def roleList(page_index=None, page_size=None):
    msg = {
        "Type":"GetBOInfoReq",
        "DataModelName":"s_RoleMan",
        "BOName":"Role",
        "Selector":"",
        "Where":"",
        "AddNodeID": True,
    }
    if page_index is not None and page_size is not None:
        msg["PageIndex"] = page_index
        msg["PageLine"] = page_size

    return msg

# 角色详细
def roleInfo(role_id):
    return {
        "Type":"GetBOInfoReq",
        "DataModelName":"s_RoleMan",
        "BOName":"Role",
        "Selector":"",
        "Where":"ID==%s" % role_id,
        "AddNodeID": True,
    }

# 角色详细
def roleInfos(role_ids, selector=None):
    msg = {
        "Type":"GetBOInfoReq",
        "DataModelName":"s_RoleMan",
        "BOName":"Role",
        "Where":"ID IN \"{%s}\"" % ','.join(role_ids),
    }
    if selector: msg["Selector"] = selector

    return msg

# 新建角色
def newRole(props):
    return {
        "Type":"AddBOInfoReq",
        "DataModelName":"s_RoleMan",
        "ParentBOName":"",
        "ParentWhere":"",
        "BOName":"Role",
        "BOProps": [props]
    }

# 编辑角色
def modifyRole(role_id, props):
    return {
        "Type":"ModifyBOInfoReq",
        "DataModelName":"s_RoleMan",
        "BOName":"Role",
        "Where":"ID==\"%s\"" % role_id,
        "BOProps": [props]
    }

# 删除角色
def deleteRole(role_id):
    return {
        "Type":"RemoveRoleReq",
        "Role": role_id
    }

# 添加角色关联区域架构
def relatedRoleToRegionTree(role_id, add_ids=[], remove_ids=[]):
    return {
        "Type":"RoleAuthReq",
        "DataModelName":"s_AreaMan",
        "BOName":"Area",
        "Role": role_id,
        "AddList": add_ids,
        "RemoveList": remove_ids
    }

# 添加角色关联组织架构
def relatedRoleToDepartmentTree(role_id, add_ids=[], remove_ids=[]):
    return {
        "Type":"RoleAuthReq",
        "DataModelName":"s_OrgMan",
        "BOName":"Organization",
        "Role": role_id,
        "AddList": add_ids,
        "RemoveList": remove_ids
    }

# 添加角色关联菜单
def relatedRoleToMenu(role_id, add_ids=[], remove_ids=[]):
    return {
        "Type":"RoleAuthReq",
        "DataModelName":"s_MenuMan",
        "BOName":"Menu",
        "Role": role_id,
        "AddList": add_ids,
        "RemoveList": remove_ids
    }

# 获取菜单授权
def getMenusByRole(role_id):
    return {
        "Type":"GetBOInfoReq",
        "DataModelName":"s_RoleMan",
        "BOName":"Role",
        "Selector":"Menu",
        "Where": "ID==\"%s\"" % role_id
    }

# 获取菜单授权
def getMenusByRoles(role_ids):
    return {
        "Type":"GetBOInfoReq",
        "DataModelName":"s_RoleMan",
        "BOName":"Role",
        "Selector":"Menu",
        "Where": "ID IN \"{%s}\"" % ','.join(role_ids)
    }

# 获取用户角色
def getUserRoles(user_id):
    return {
        "Type":"GetBOInfoReq",
        "DataModelName":"s_UsrMan",
        "BOName":"NSUsers",
        "Where": "UserID==\"%s\"" % user_id,
        "Selector":"Role",
    }

# 菜单列表
def menuList(parent_menu_id=-1, **kwargs):
    msg = {
        "Type":"GetChildrenBOInfoReq",
        "DataModelName":"s_MenuMan",
        "BOName":"Menu",
        "Where":"ID==\"%s\"" % parent_menu_id,
        "SelectBO":"Menu",
        "AddNodeID":True,
        "Selector": "Enable,ID,Link,Name,OrderbyIndex",
        "OrderBy":["OrderbyIndex"],
    }

    if kwargs:
        if 'top' in kwargs:
            msg['Top'] = kwargs['top']

    return msg

# 新建菜单
def newMenu(parent_id, props):
    return {
        "Type":"AddBOInfoReq",
        "DataModelName":"s_MenuMan",
        "ParentBOName":"Menu",
        "ParentWhere":"ID==\"%s\"" % parent_id,
        "BOName":"Menu",
        "BOProps": [props]
    }

# 编辑菜单
def modifyMenu(menu_id, props):
    return {
        "Type":"ModifyBOInfoReq",
        "DataModelName":"s_MenuMan",
        "BOName":"Menu",
        "Where":"ID==\"%s\"" % menu_id,
        "BOProps": [props]
    }

# 删除菜单
def deleteMenu(menu_ids):
    return {
        "Type":"RemoveBOInfoReq",
        "DataModelName":"s_MenuMan",
        "BOName":"Menu",
        "Where":"ID IN \"{%s}\"" % ','.join(menu_ids),
    }
