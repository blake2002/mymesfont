#! /bin/env python
#-*- coding:utf-8 -*-
import json, sys
import os, base64
from tornado.gen import coroutine

from hite.mes.comm.log import logger
from hite.mes.comm import utils
from hite.mes.comm.handler import HiteHandler, HandlerError
from hite.mes.comm.websess import UserSession

from hite.mes.comm.DataModelApi import region as region_api
from hite.mes.comm.DataModelApi import department as dept_api

# 区域架构：全局搜索
class SearchRegionTree(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init('searchTarget', 'keyword', top='int', pageIndex='int', pageSize='int')
            auths = self.user_session.get('regionTree')

            commands = []
            search_nodes = region_api.searchNodes(self.keyword, auths, self.top, self.pageIndex, self.pageSize)
            commands.append(search_nodes) # 查节点

            if self.searchTarget == 'device': # 查设备
                commands.append(region_api.searchDevices(self.keyword, auths, self.top, self.pageIndex, self.pageSize))

            elif self.searchTarget == 'member': # 查相关人员
                commands.append(region_api.searchMembers(self.keyword, auths, self.top, self.pageIndex, self.pageSize))

            results = yield self.genResult('dm', {'Type': 'BatchReadReq', 'Commands': commands}, self.search_results)

            if len(results['RegionList']) > 0:
                region_ids = [ rb['ID'] for rb in results['RegionList'] ]
                oMsg = yield self.genResult('dm', region_api.getNodePath(region_ids))
                results['RegionList'] = self.update_region_list(oMsg, results['RegionList'])

            if self.top < 0:
                self.nodes_count = self.devices_count = self.members_count = None

                commands = []
                # 查节点个数
                if len(results['RegionList']) == 0: self.nodes_count = 0
                else: commands.append(region_api.searchNodesCount(self.keyword, auths))

                # 查设备个数
                if self.searchTarget == 'device' and len(results['DeviceList']) == 0:self.devices_count = 0
                else: commands.append(region_api.searchDevicesCount(self.keyword, auths))

                # 查相关人员个数
                if self.searchTarget == 'member' and len(results['MemberList']) == 0: self.members_count = 0
                else: commands.append(region_api.searchMembersCount(self.keyword, auths))

                if commands:
                    oMsg = yield self.genResult('dm', {'Type': 'BatchReadReq', 'Commands': commands})
                    oMsg = yield self.oMsgPool.wait(self.id)
                    results = self.update_result_count(oMsg, results)
                else: results['TotalCount'] = 0

            self.send(self.SUCCESS, results)

        except HandlerError as e:
            self._send(e.json_msg)

    def search_results(self, oMsg):
        results = oMsg['Results']
        region_result = results[0]
        data = {
            'RegionList': region_result['BOS'],
            'RegionIndex': region_result['PageIndex'],
            'RegionCount': region_result['PageCount'],
        }

        target_result = results[1]
        if self.searchTarget == 'device':
            data['DeviceList'] = target_result['BOS']
            data['DeviceIndex'] = target_result['PageIndex']
            data['DeviceCount'] = target_result['PageCount']
        elif self.searchTarget == 'member':
            data['MemberList'] = target_result['BOS']
            data['MemberIndex'] = target_result['PageIndex']
            data['MemberCount'] = target_result['PageCount']

        return data

    def update_result_count(self, oMsg, datas):
        results = oMsg['Results']

        total_count = 0
        if self.nodes_count is None:
            r = results.pop(0)
            self.nodes_count = r['Count']
            total_count += int(self.nodes_count)
            datas['RegionCount'] = self.nodes_count

        if self.devices_count is None and self.searchTarget == 'device':
            r = results.pop(0)
            self.devices_count = r['Count']
            total_count += int(self.devices_count)
            datas['DeviceCount'] = self.devices_count

        if self.members_count is None and self.searchTarget == 'member':
            r = results.pop(0)
            self.members_count = r['Count']
            total_count += int(self.members_count)
            datas['MemberCount'] = self.members_count

        datas['TotalCount'] = total_count

        return datas

    def update_region_list(self, oMsg, regionList):
        i = 0
        for r in oMsg['Path']:
            regionList[i]['Path'] = r
            i+=1

        return regionList

class RegionTree(HiteHandler):
    @coroutine
    def get(self): # 获取区域架构树
        try:
            self.get_init()
            # validate
            # check token
            roleIds = self.user_session.get('roles')

            oMsg = yield self.genResult('dm', region_api.regionTree(roleIds))
            self.send(self.SUCCESS, oMsg['BOTree'])

        except HandlerError as e:
            self._send(e.json_msg)

    @coroutine
    def post(self): # 修改区域架构树-增删改节点
        try:
            self.post_init('operate', 'parentId', 'nodeId', 'nodeType', 'nodeName')

            if self.operate == 'add': # 新增
                self._require_validate('newOrderbyIndex')

                if not self.nodeId and self.nodeType == 'NSCompanys':
                    self.nodeId = utils.gen_unique_id()
                    return_data = {'nodeId': self.nodeId}

                msg = region_api.addNode(self.parentId, self.nodeId, self.nodeName, nodeType, self.newOrderbyIndex)

            elif self.operate == 'delete': # 删除
                msg = region_api.deleteNode(self.nodeId)

            elif self.operate == 'edit': # 编辑
                msg = region_api.modifyNode(self.nodeId, {"Name": self.nodeName, "zh_CN": self.nodeName})

            elif self.operate == 'moveTo': # 移动
                self._require_validate('moveToProps', 'newOrderbyIndex')

                # 排序受影响的节点
                for k,v in self.moveToProps.items():
                    m = region_api.modifyNode(k, {"OrderbyIndex": v})
                    oMsg = yield self.genResult('dm', m)

                msg = region_api.modifyNode(self.nodeId, {"OrderbyIndex": self.newOrderbyIndex})
            else:
                raise HandlerError(self.rsp_code['params_error'],"operate '%s' does not support" % self.operate)

            oMsg = yield self.genResult('dm', msg)

            self.send(self.SUCCESS, return_data)

        except HandlerError as e:
            self._send(e.json_msg)

class RegionChildren(HiteHandler):
    @coroutine
    def get(self): # 获取某节点下的子节点
        try:
            self.get_init('parentId')

            # validate
            # check token
            # 获取用户roles

            oMsg = yield self.genResult('dm', region_api.regionChildren(self.parentId))
            self.send(self.SUCCESS, oMsg['BOS'])

        except HandlerError as e:
            self._send(e.json_msg)

class RegionTreeOptions(HiteHandler):
    @coroutine
    def get(self): # 修改区域架构树-节点选择
        try:
            self.get_init('nodeType')
            # validate
            # check token

            if self.nodeType not in ('NSCountrys', 'NSStations', 'NSCitys'):
                raise HandlerError(self.rsp_code['params_error'], "nodeType '%s' does not support" % self.nodeType)

            self.parentId = None
            if self.nodeType in ('NSStations', 'NSCitys'): self._require_validate('parentId')

            oMsg = yield self.genResult('dm', region_api.nodeOptions(self.nodeType, self.parentId), self.node_options)

            self.send(self.SUCCESS, oMsg)

        except HandlerError as e:
            self._send(e.json_msg)

    def node_options(self, oMsg):
        return {
            'pageList': oMsg['BOS'],
            'pageIndex': oMsg['PageIndex'],
            'pageCount': oMsg['PageCount']
        }

class RegionTreeForefather(HiteHandler):
    @coroutine
    def get(self): #根据区域架构节点ID-查询所有祖先节点
        try:
            self.get_init('regionId')

            # validate
            # check token
            oMsg = yield self.genResult('dm', region_api.getNodePath([self.regionId]))
            self.send(self.SUCCESS, oMsg['Path'])

        except HandlerError as e:
            self._send(e.json_msg)


# 组织架构-全局搜索
class SearchDepartmentTree(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init('keyword', top='int', pageIndex='int', pageSize='int')
            auths = self.user_session.get('deptTree')

            commands = []
            search_nodes = dept_api.searchNodes(self.keyword, auths, self.top, self.pageIndex, self.pageSize)
            commands.append(search_nodes) # 查节点

            # 查人员
            commands.append(dept_api.searchUsers(self.keyword, auths, self.top, self.pageIndex, self.pageSize))

            results = yield self.genResult('dm', {'Type': 'BatchReadReq', 'Commands': commands}, self.search_results)

            if len(results['DepartmentList']) > 0:
                dept_ids = [ rb['ID'] for rb in results['DepartmentList'] ]
                oMsg = yield self.genResult('dm', dept_api.getNodePath(dept_ids))
                results['DepartmentList'] = self.update_dept_list(oMsg, results['DepartmentList'])

            if self.top < 0:
                self.nodes_count = self.users_count = None

                commands = []
                # 查节点个数
                if len(results['DepartmentList']) == 0: self.nodes_count = 0
                else: commands.append(dept_api.searchNodesCount(self.keyword, auths))

                # 查相关人员个数
                if len(results['UserList']) == 0: self.users_count = 0
                else: commands.append(dept_api.searchUsersCount(self.keyword, auths))

                if commands:
                    oMsg = yield self.genResult('dm', {'Type': 'BatchReadReq', 'Commands': commands})
                    results = self.update_result_count(oMsg, results)
                else: results['TotalCount'] = 0

            self.send(self.SUCCESS, results)

        except HandlerError as e:
            self._send(e.json_msg)

    def search_results(self, oMsg):
        results = oMsg['Results']
        dept_result = results[0]
        data = {
            'DepartmentList': dept_result['BOS'],
            'DepartmentIndex': dept_result['PageIndex'],
            'DepartmentCount': dept_result['PageCount'],
        }

        target_result = results[1]
        data['UserList'] = target_result['BOS']
        data['UserIndex'] = target_result['PageIndex']
        data['UserCount'] = target_result['PageCount']

        return data

    def update_result_count(self, oMsg, datas):
        results = oMsg['Results']

        total_count = 0
        if self.nodes_count is None:
            r = results.pop(0)
            self.nodes_count = r['Count']
            total_count += int(self.nodes_count)
            datas['DepartmentCount'] = self.nodes_count

        if self.users_count is None:
            r = results.pop(0)
            self.users_count = r['Count']
            total_count += int(self.users_count)
            datas['UserCount'] = self.users_count

        datas['TotalCount'] = total_count

        return datas

    def update_dept_list(self, oMsg, deptList):
        i = 0
        for r in oMsg['Path']:
            deptList[i]['Path'] = r
            i+=1

        return deptList

# 组织架构树
class DepartmentTree(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init()

            # validate
            # check token
            roleIds = self.user_session.get('roles')
            oMsg = yield self.genResult('dm', dept_api.deptTree(roleIds))

            self.send(self.SUCCESS, oMsg['BOTree'])

        except HandlerError as e:
            self._send(e.json_msg)

    @coroutine
    def post(self): # 修改组织架构树-增删改节点
        try:
            self.post_init('operate', 'parentId', 'nodeId', 'nodeName')

            if self.operate == 'add':
                self._require_validate('newOrderbyIndex')

                if not self.nodeId:
                    self.nodeId = utils.gen_unique_id()
                    return_data = {'nodeId': self.nodeId}

                msg = dept_api.addNode(self.parentId, self.nodeId, self.nodeName, self.newOrderbyIndex)

            elif self.operate == 'delete':
                msg = dept_api.deleteNode(self.nodeId)

            elif self.operate == 'edit':
                msg = dept_api.modifyNode(self.nodeId, {'Name': self.nodeName})

            elif self.operate == 'moveTo':
                self._require_validate('newOrderbyIndex', 'moveToProps')
                # 排序受影响的节点
                for k,v in self.props.items():
                    oMsg = yield self.genResult('dm', dept_api.modifyNode(k, {'OrderbyIndex': v}))

                msg = dept_api.modifyNode(self.nodeId, {'OrderbyIndex': self.newOrderbyIndex})

            elif self.operate == 'changeParentTo': # 移动至新的父级
                self._require_validate('newParentId')
                msg = dept_api.moveNode(self.nodeId, self.newParentId)

            else:
                raise HandlerError(self.rsp_code['params_error'],"operate '%s' does not support" % self.operate)

            oMsg = yield self.genResult('dm', msg)

            self.send(self.SUCCESS, return_data)

        except HandlerError as e:
            self._send(e.json_msg)

 # 获取某节点下的子节点
class DepartmentChildren(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init('parentId')

            # validate
            # check token
            # 获取用户roles

            oMsg = yield self.genResult('dm', dept_api.deptChildren(self.parentId))
            self.send(self.SUCCESS, oMsg['BOS'])

        except HandlerError as e:
            self._send(e.json_msg)

# 根据区域架构节点ID-查询所有祖先节点
class DepartmentTreeForefather(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init('departmentId')

            oMsg = yield self.genResult('dm', dept_api.getNodePath([self.departmentId]))
            self.send(self.SUCCESS, oMsg['Path'])

        except HandlerError as e:
            self._send(e.json_msg)

