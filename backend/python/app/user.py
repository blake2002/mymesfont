#! /bin/env python
#-*- coding:utf-8 -*-
import json, sys
import os, base64, datetime
from functools import partial

from tornado.gen import coroutine

from hite.mes.comm import config
from hite.mes.comm.log import logger

from hite.mes.comm.handler import HiteHandler, HandlerError

from hite.mes.comm.DataModelApi import region as region_api
from hite.mes.comm.DataModelApi import department as dept_api
from hite.mes.comm.DataModelApi import sysconf as sysconf_api
from hite.mes.comm.DataModelApi import model as model_api

from hite.mes.comm import utils

# 配置管理平台: 获取组织架构节点下人员
class UserListFromDepartmentTree(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init('departmentId', 'cateFilter', pageIndex='int', pageSize='int')

            if self.cateFilter not in ('all', 'disabled'):
                raise HandlerError(self.rsp_code['params_error'], "cateFilter %s does not support" % self.cateFilter)

            auth_nodes = self.user_session.get('deptTree')
            oMsg = yield self.genResult('dm', dept_api.getDescendantAuthNodeIdsFromParent(self.departmentId, auth_nodes))
            auths = [a['ID'] for a in oMsg['BOS']]
            if self.departmentId in auth_nodes: auths.append(self.departmentId)

            msg = dept_api.getUserListByDepartmentId(auths, self.pageIndex, self.pageSize)

            if self.cateFilter == 'disabled':
                msg['SelectWhere'] = "Enable==\"false\""

            if 'keyword' in self.request.arguments:
                self.keyword = self._get_arg('keyword')
                if len(self.keyword) > 0:
                    msg = dept_api.searchUsers(self.keyword, ['-1'], -1, self.pageIndex, self.pageSize)

            oMsg = yield self.genResult('dm', msg, self.user_list)
            self.send(self.SUCCESS, oMsg)

        except HandlerError as e:
            self._send(e.json_msg)

    def user_list(self, oMsg):
        return {
            'pageList': oMsg['BOS'],
            'pageIndex': oMsg['PageIndex'],
            'pageCount': oMsg['PageCount']
        }

# 配置管理平台: 获取组织架构节点下人员个数
class UserCountFromDepartmentTree(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init('departmentId')

            auth_nodes = self.user_session.get('deptTree')
            oMsg = yield self.genResult('dm', dept_api.getDescendantAuthNodeIdsFromParent(self.departmentId, auth_nodes))
            auths = [a['ID'] for a in oMsg['BOS']]
            if self.departmentId in auth_nodes: auths.append(self.departmentId)

            commands = [
                dept_api.getUserCount(auths),
                dept_api.getUserCount(auths, Enable="false")
            ]

            oMsg = yield self.genResult('dm', {'Type':'BatchReadReq', 'Commands': commands}, self.user_count)
            self.send(self.SUCCESS, oMsg)

        except HandlerError as e:
            self._send(e.json_msg)

    def user_count(self, oMsg):
        return {
            'all': oMsg['Results'][0].get('Count'),
            'disabled': oMsg['Results'][1].get('Count'),
        }

# 配置管理平台: 获取用户组织架构路径
class UserBelongsFromDepartmentTree(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init('deptUserId')

            oMsg = yield self.genResult('dm', dept_api.getUserPath(self.deptUserId))
            self.send(self.SUCCESS, oMsg['Path'])

        except HandlerError as e:
            self._send(e.json_msg)

    @coroutine
    def post(self):
        try:
            self.post_init('deptUserIds', 'operate', 'departmentId')

            if self.operate not in ('append', 'remove'):
                raise HandlerError(self.rsp_code['params_error'], "operate %s does not support" % self.operate)

            if self.operate == 'append':
                # 检查用户是否已存在节点下
                msg = dept_api.getUserListByFilter(self.departmentId, self.deptUserIds)
                oMsg = yield self.genResult('dm', msg, self.user_unique)

                # 查询用户信息
                msg = dept_api.getUserInfo(self.deptUserIds)
                user_props_list = yield self.genResult('dm', msg, self.user_info)

                # 添加用户到节点
                msg = dept_api.addUserToDepartmentTree(self.departmentId, user_props_list)
                oMsg = yield self.genResult('dm', msg)

            elif self.operate == 'remove':
                for deptUserId in self.deptUserIds:
                    self.queryDeptUserId = deptUserId
                    # 检查用户是否只有一个节点
                    msg = dept_api.getUserPath(deptUserId)
                    oMsg = yield self.genResult('dm', msg, self.last_node)

                msg = dept_api.removeUserFromDepartmentTree(self.departmentId, self.deptUserIds)
                oMsg = yield self.genResult('dm', msg)

            self.send(self.SUCCESS)

        except HandlerError as e:
            self._send(e.json_msg)

    def user_unique(self, oMsg):
        if len(oMsg['BOS']) == 0: return

        usernames = [o['Name'] for o in oMsg['BOS']]
        raise HandlerError(self.rsp_code['params_error'], '%s 用户已关联'%','.join(usernames))

    def user_info(self, oMsg):
        if len(oMsg['BOS']) < 1:
            raise HandlerError(self.rsp_code['params_error'], '%s 用户不存在'%','.join(self.deptUserIds))

        return oMsg['BOS']

    def last_node(self, oMsg):
        if len(oMsg['Path']) == 1:
            raise HandlerError(self.rsp_code['params_error'], '无法移除%s用户唯一组织架构关系，请执行删除人员操作'%self.queryDeptUserId)

# 配置管理平台: 获取组织架构用户详细
class UserDetailFromDepartmentTree(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init('deptUserId')

            commands = [
                dept_api.getUserInfoFromDepartmentTree([self.deptUserId]),
                sysconf_api.getUserRoles(self.deptUserId),
                dept_api.getUserPath(self.deptUserId),
                model_api.getUserTemplate()
            ]

            user_info = yield self.genResult('dm', {'Type': 'BatchReadReq', 'Commands': commands}, self.batch_results)

            if user_info['NSUsers'].get('Role'):
                role = user_info['NSUsers']['Role']
                oMsg = yield self.genResult('dm', sysconf_api.roleInfos(role.get('Role', '').rstrip(';').split(';'), selector="ID,Name"))
                user_info = self.user_roles(oMsg, user_info)
            else:
                user_info['NSUsers']['Role'] = []

            self.send(self.SUCCESS, user_info)

        except HandlerError as e:
            self._send(e.json_msg)

    def batch_results(self, oMsg):
        results= oMsg['Results']
        try:
            userInfo = results[0]['BOS'][0]
        except IndexError:
            raise HandlerError(self.rsp_code['params_error'], "%s does not exist" % self.deptUserId)

        #userInfo['DepartmentPath'] = results[2]['Path']
        userInfo['Organization'] = results[2]['Path']
        userInfo['PassWord'] = 'xxxxxxxxxxxx'

        try: userInfo['Role'] = results[1]['BOS'][0]
        except IndexError: userInfo['Role'] = ""

        template = results[3]['DataModelDefine'].get('DataNode').get('Properties')
        template.append({
            'DataType': "string",
            'Description': "组织架构",
            'Form': { 'Type': "OrgPicker" },
            'Type': "OrgPicker",
            'IsPrimaryKey': "false",
            'Name': "Organization",
            'Nullable': "true"
        })

        return {'NSUsers': userInfo, 'NSUsersTemplate': {'Props': template}}

    def user_roles(self, oMsg, userInfo):
        try:
            roles = oMsg['BOS']
            userInfo['NSUsers']['Role'] = [{'ID': r['ID'], 'Name': r['Name']} for r in roles]

            return userInfo
        except IndexError:
            raise HandlerError(self.rsp_code['params_error'], "%s role does not exist" % self.deptUserId)

# 配置管理平台: 用户模板
class UserTemplate(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init()

            props = yield self.genResult('dm', model_api.getUserTemplate(), self.user_template)

            msg = model_api.getMapOptions(props)
            if msg:
                map_options = yield self.genResult('dm', msg, self.parse_dict_man)
                props = model_api.updateMapOptionsForProperties(props, map_options)

            self.send(self.SUCCESS, {'NSUsersTemplate': {'Props': props}})
        except HandlerError as e:
            self._send(e.json_msg)

    def user_template(self, oMsg):
        return oMsg.get('DataModelDefine').get('DataNode').get('Properties')

# 配置管理平台: 新增用户
class AddNewUserToDepartmentTree(HiteHandler):

    @coroutine
    def post(self):
        try:
            self.post_init('props', 'departmentId')

            self.bo_props = {}

            roles = remove_org_ids = add_org_ids = None
            for p in self.props.get('NSUsers'):
                key = p.get('ParameterName')
                val = p.get('ParameterValue')

                if key == 'Role':
                    if len(val) == 0: roles = ""
                    else: roles = "%s;" % ";".join(val)

                elif key == 'Organization':
                    originalVal = p.get('OriginalParameterValue')

                    add_org_ids = list(set(originalVal).difference(set(val)))
                    remove_org_ids = list(set(val).difference(set(originalVal)))

                else: self.bo_props[key] = val

            self.user_uuid = utils.gen_unique_id()
            self.bo_props['_ID'] = self.user_uuid

            tasks = [
                dept_api.newUser(self.bo_props),
                dept_api.addUserToDepartmentTree(self.departmentId, [self.bo_props])
            ]

            if roles:
                tasks.append(dept_api.modifyUser(self.bo_props.get('UserID'), {"Role":val}))

            if remove_org_ids or add_org_ids:
                tasks.append(dept_api.moveUser(self.bo_props.get('UserID'), add_org_ids, remove_org_ids))

            for t in tasks:
                oMsg = yield self.genResult('dm', t)

            self.send(self.SUCCESS, {'userID': self.user_uuid})
        except HandlerError as e:
            self._send(e.json_msg)

# 配置管理平台: 编辑用户
class ModifyUserFromDepartmentTree(HiteHandler):
    @coroutine
    def post(self):
        try:
            self.post_init('deptUserId', 'props')
            self.bo_props = {}

            tasks = []
            for p in self.props.get('NSUsers'):
                key = p.get('ParameterName')
                val = p.get('ParameterValue')

                if key == 'Top':
                    tasks.append(dept_api.topUser(self.deptUserId, val))
                elif key == 'Role':
                    if len(val) == 0: val = ""
                    else: val = "%s;" % ";".join(val)

                    tasks.append(dept_api.modifyUser(self.deptUserId, {"Role": val}))
                elif key == 'Organization':
                    originalVal = p.get('OriginalParameterValue')

                    add_org_ids = list(set(originalVal).difference(set(val)))
                    remove_org_ids = list(set(val).difference(set(originalVal)))

                    tasks.append(dept_api.moveUser(self.deptUserId, add_org_ids, remove_org_ids))
                else: self.bo_props[key] = val

            if self.bo_props:
                tasks.append(dept_api.modifyUser(self.deptUserId, self.bo_props))

            for t in tasks:
                oMsg = yield self.genResult('dm', t)

            self.send(self.SUCCESS)

        except HandlerError as e:
            self._send(e.json_msg)

# 配置管理平台: 删除用户
class DeleteUserFromDepartmentTree(HiteHandler):
    @coroutine
    def post(self):
        try:
            self.post_init('deptUserIds')

            oMsg = yield self.genResult('dm', dept_api.deleteUser(self.deptUserIds))
            self.send(self.SUCCESS)

        except HandlerError as e:
            self._send(e.json_msg)

# 配置管理平台: 获取区域节点下人员
class MemberListFromRegionTree(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init('regionId', 'cateFilter', pageIndex='int', pageSize='int')

            if self.cateFilter not in ('all', 'disabled', 'concerned'):
                raise HandlerError(self.rsp_code['params_error'], "cateFilter %s does not support" % self.cateFilter)

            filter_member_ids = None
            if self.cateFilter == 'concerned':
                filter_member_ids = yield self.genResult('dm', region_api.getTaggedMembers(self.user_id, '已关注'), self.concerned_list)

                if len(filter_member_ids) == 0:
                    self.send(self.SUCCESS, {'pageList': [], 'pageIndex': 0, 'pageCount': 0 })
                    return

            if filter_member_ids is None:
                msg = region_api.getMemberListByRegionId(self.regionId, self.pageIndex, self.pageSize)
            else:
                msg = region_api.getMemberListByRegionId(self.regionId, self.pageIndex, self.pageSize, filter_member_ids=filter_member_ids)

            if self.cateFilter == 'disabled':
                msg["SelectWhere"] = "Enable==\"false\""

            member_list = yield self.genResult('dm', msg, self.member_list)

            self.send(self.SUCCESS, member_list)
        except HandlerError as e:
            self._send(e.json_msg)

    def member_list(self, oMsg):
        return  {
            'pageList': oMsg['BOS'],
            'pageIndex': oMsg['PageIndex'],
            'pageCount': oMsg['PageCount']
        }

    def concerned_list(self, oMsg):
        userIds = oMsg['BOS']
        if len(userIds) == 0: return []

        return [u['UserID'] for u in userIds]

# 配置管理平台: 获取区域节点下人员个数
class MemberCountFromRegionTree(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init('regionId')

            commands = [
                region_api.getMemberCountByRegionId(self.regionId),
                region_api.getMemberCountByRegionId(self.regionId, Enable="flase"),
                region_api.getTaggedMembers(self.user_id, '已关注', selector="UserID")
            ]

            count_list, concerned_member_ids = yield self.genResult('dm', {'Type': 'BatchReadReq', 'Commands': commands}, self.batch_results)

            if len(concerned_member_ids) == 0:
                self.send(self.SUCCESS, count_list)
                return

            oMsg = yield self.genResult('dm', region_api.getMemberCountByRegionId(self.regionId, filter_member_ids=concerned_member_ids))
            count_list = self.update_concerned_count(oMsg, count_list)

            self.send(self.SUCCESS, count_list)

        except HandlerError as e:
            self._send(e.json_msg)

    def batch_results(self, oMsg):
        data = {
            'all': oMsg['Results'][0].get('Count'),
            'disabled': oMsg['Results'][1].get('Count'),
            'concerned': 0
        }
        userIds = [u['UserID'] for u in oMsg['Results'][2].get('BOS')]

        return data, userIds

    def update_concerned_count(self, oMsg, data):
        data['concerned'] = oMsg['Count']
        return data

# 配置管理平台: 获取区域架构用户详细
class MemberDetailFromRegionTree(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init('memberId')

            commands = [
                region_api.getMemberInfoFromRegionTree(self.memberId),
                sysconf_api.getUserRoles(self.memberId),
                region_api.getMemberPath(self.memberId),
                model_api.getUserTemplate(),
                region_api.getTaggedMembers(self.user_id, '已关注', filter_member_id=self.memberId)
            ]

            user_info = yield self.genResult('dm', {'Type': 'BatchReadReq', 'Commands': commands}, self.batch_results)

            if user_info['NSUsers'].get('Role'):
                oMsg = yield self.genResult('dm', sysconf_api.roleInfos(user_info['NSUsers']['Role'].rstrip(';').split(';'), selector="Name"))
                user_info = self.user_roles(oMsg, user_info)
            else:
                user_info['NSUsers']['Role'] = []

            self.send(self.SUCCESS, user_info)

        except HandlerError as e:
            self._send(e.json_msg)

    def batch_results(self, oMsg):
        results= oMsg['Results']
        try:
            userInfo = results[0]['BOS'][0]
        except IndexError as e:
            raise HandlerError(self.rsp_code['params_error'], "%s does not exist" % self.memberId)

        userInfo['RegionPath'] = results[2]['Path']
        userInfo['Concerned'] = str((len(results[4]['BOS']) > 0))
        template = results[3]['DataModelDefine'].get('DataNode').get('Properties')

        user_info = {'NSUsers': userInfo, 'NSUsersTemplate': {'Props': template}}

        try:
            r = results[1]['BOS'][0]
            user_info['NSUsers']['Role'] = r.get('Role')
        except IndexError:
            user_info['NSUsers']['Role'] = []

        return user_info


    def user_roles(self, oMsg, userInfo):
        try:
            roles = oMsg['BOS']
            userInfo['NSUsers']['Role'] = [r['Name'] for r in roles]

            return userInfo
        except IndexError:
            raise HandlerError(self.rsp_code['params_error'], "%s role does not exist" % self.memberId)

# 配置管理平台: 获取用户区域架构路径
class MemberBelongsFromRegionTree(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init('memberId')

            oMsg = yield self.genResult('dm', region_api.getMemberPath(self.memberId))
            self.send(self.SUCCESS, oMsg['Path'])

        except HandlerError as e: self._send(e.json_msg)

    @coroutine
    def post(self):
        try:
            self.post_init('memberIds', 'operate', 'regionId')

            if self.operate == 'append':
                oMsg = yield self.genResult('dm', region_api.getMemberListByRegionId(self.regionId, filter_member_ids=self.memberIds), self.member_unique)
                member_infos = yield self.genResult('dm', region_api.getMemberInfos(self.memberIds), self.member_infos)
                oMsg = yield self.genResult('dm', region_api.addMemberToRegionTree(self.regionId, member_infos))

            elif self.operate == 'remove':
                oMsg = yield self.genResult('dm', region_api.removeMemberFromRegionTree(self.regionId, self.memberIds))

            self.send(self.SUCCESS)

        except HandlerError as e: self._send(e.json_msg)

    def member_unique(self, oMsg):
        if len(oMsg['BOS']) == 0: return

        usernames = [o['Name'] for o in oMsg['BOS']]
        raise HandlerError(self.rsp_code['params_error'], '%s 用户已关联'%','.join(usernames))

    def member_infos(self, oMsg):
        if len(oMsg['BOS']) < 1:
            raise HandlerError(self.rsp_code['params_error'], '%s 用户不存在'%','.join(self.memberIds))

        return oMsg['BOS']

# 配置管理平台: 关注区域架构人员
class ConcernMemberFromRegionTree(HiteHandler):
    @coroutine
    def post(self):
        try:
            self.post_init('memberId')
            self.tagName = '已关注'

            member_info = yield self.genResult('dm', region_api.getMemberInfo(self.memberId), self.member_info)
            defaultTag = yield self.genResult('dm', region_api.getTagList(self.user_id, self.tagName), self.parse_tag_member)

            if not defaultTag:
                oMsg = yield self.genResult('dm', region_api.newTag(self.user_id, {'Name': self.tagName}))

            oMsg = yield self.genResult('dm', region_api.tagMember(self.user_id, [member_info], [self.tagName]))

            self.send(self.SUCCESS)

        except HandlerError as e:
            self._send(e.json_msg)

    def parse_tag_member(self, oMsg):
        return len(oMsg['BOS']) > 0

    def member_info(self, oMsg):
        if len(oMsg['BOS']) == 0:
            raise HandlerError(self.rsp_code['params_error'], '%s does not exist' % self.memberId)
        return oMsg['BOS'][0]

# 配置管理平台: 为区域架构人员添加标签
class TagMemberFromRegionTree(HiteHandler):
    @coroutine
    def post(self):
        try:
            self.post_init('memberIds', 'tagNames')

            member_infos = yield self.genResult('dm', region_api.getMemberInfos(self.memberIds), self.member_infos)
            oMsg = yield self.genResult('dm', region_api.tagMember(self.user_id, member_infos, self.tagNames))

            self.send(self.SUCCESS)

        except HandlerError as e:
            self._send(e.json_msg)

    def member_infos(self, oMsg):
        if len(oMsg['BOS']) == 0:
            raise HandlerError(self.rsp_code['params_error'], '%s does not exist' % ','.join(self.memberIds))
        self.memberInfos = oMsg['BOS']


# 配置管理平台: 为区域架构人员移除标签
class UnTagMemberFromRegionTree(HiteHandler):
    @coroutine
    def post(self):
        try:
            self.post_init('memberIds')
            self.tagName = None

            path = self.get_request_path()
            if path in ('concern_member', 'unconcern_member'):
                self.tagNames = ['已关注']
            else:
                self._require_validate('tagNames')

            oMsg = yield self.genResult('dm', region_api.unTagMember(self.user_id, self.memberIds, self.tagNames))

            self.send(self.SUCCESS)

        except HandlerError as e: self._send(e.json_msg)

# 配置管理平台: 置顶区域人员用户
class TopUserFromRegionTree(HiteHandler):
    @coroutine
    def post(self):
        try:
            self._require_validate('deptUserId', 'props')

            self.top_props = {}
            for p in self.props.get('NSUsers'):
                self.top_props[p.get('ParameterName')] = p.get('ParameterValue')

            oMsg = yield self.genResult('dm', region_api.topMember(self.deptUserId, self.top_props['Top']))
            self.send(self.SUCCESS)

        except HandlerError as e: self._send(e.json_msg)
