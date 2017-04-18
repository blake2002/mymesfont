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
from hite.mes.comm.DataModelApi import sysconf as sysconf_api
from hite.mes.comm.DataModelApi import model as model_api
from hite.mes.comm.DataModelApi import region as region_api
from hite.mes.comm.DataModelApi import department as dept_api
from hite.mes.app.utils import DEVICE_DRIVER_PLC_OPTIONS, DEVICE_DRIVER_OPTIONS


# 配置管理平台: 角色列表
class RoleList(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init()

            self.pageIndex = self.pageSize = None
            if 'pageIndex' in self.request.arguments and 'pageSize' in self.request.arguments:
                self.get_require_args(pageIndex='int', pageSize='int')

            rlist = yield self.genResult('dm', sysconf_api.roleList(self.pageIndex, self.pageSize), self.role_list)
            self.send(self.SUCCESS, rlist)

        except HandlerError as e:
            self._send(e.json_msg)

    def role_list(self, oMsg):
        if self.pageIndex is not None and self.pageSize is not None:
            return {
                'roleList': oMsg['BOS'],
                'pageIndex': oMsg['PageIndex'],
                'pageCount': oMsg['PageCount']
            }
        else: return oMsg['BOS']

# 配置管理平台: 角色模板
class RoleTemplate(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init()

            props = yield self.genResult('dm', model_api.getRoleTemplate(), self.data_model)

            oMsg = yield self.genResult('dm', model_api.getMapOptions(props))
            props = self.update_dict_options(oMsg, props)

            path = self.get_request_path()
            if path.startswith('role_list'):
                pIndexs = []
                i = 0
                for p in props:
                    try:
                        f = p.get('Form')
                        if not f:
                            pIndexs.append(i)
                            continue
                        t = f['Type']
                        if t.endswith('Picker'): pIndexs.append(i)
                    finally: i += 1

                pIndexs.reverse()
                for pi in pIndexs: props.pop(int(pi))

            self.send(self.SUCCESS, {'RoleTemplate': {'Props': props}})

        except HandlerError as e:
            self._send(e.json_msg)

    def data_model(self, oMsg):
        data_model = oMsg.get('DataModelDefine')
        return model_api.getProperties(data_model, 'Role')

    def update_dict_options(self, oMsg, props):
        return model_api.updateMapOptionsForProperties(props, oMsg['BOS'])

# 配置管理平台: 角色详细
class RoleDetail(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init('roleId')

            commands = [
                sysconf_api.roleInfo(self.roleId),
                model_api.getRoleTemplate()
            ]
            role_info, template_props = yield self.genResult('dm', {'Type': 'BatchReadReq', 'Commands': commands}, self.parse_batch_response)

            # 角色模板
            oMsg = yield self.genResult('dm', model_api.getMapOptions(template_props))
            template_props = self.update_dict_options(oMsg, template_props)

            # 角色区域、组织架构路径获取
            commands = []
            if role_info.get('Area'):
                areas = role_info.get('Area').rstrip(';').split(';')
                commands.append(region_api.getNodePath(areas))
            else: role_info['Area'] = []

            if role_info.get('Organization'):
                organizations = role_info.get('Organization').rstrip(';').split(';')
                commands.append(dept_api.getNodePath(organizations))
            else:
                role_info['Organization'] = []

            if len(commands) > 0:
                oMsg = yield self.genResult('dm', {'Type': 'BatchReadReq', 'Commands': commands})
                role_info = self.parse_path_response(oMsg, role_info)

            self.send(self.SUCCESS, {'Role': role_info, 'RoleTemplate': {'Props': template_props}})

        except HandlerError as e:
            self._send(e.json_msg)

    def parse_batch_response(self, oMsg):
        try:
            results = oMsg['Results']
            role_info = results[0]['BOS'][0]

            data_model = results[1].get('DataModelDefine')
            props = model_api.getProperties(data_model, 'Role')

            return role_info, props
        except IndexError:
            raise HandlerError(self.rsp_code['params_error'], "%s does not exist" % self.roleId)

    def update_dict_options(self, oMsg, props):
        return model_api.updateMapOptionsForProperties(props, oMsg['BOS'])

    def parse_path_response(self, oMsg, roleInfo):
        results = oMsg['Results']
        try:
            path = results[0]['Path']
            if not isinstance(roleInfo.get('Area'), list):
                roleInfo['Area'] = path
            else:
                roleInfo['Organization'] = path

            if len(results) > 1:
                roleInfo['Organization'] = results[1]['Path']

        except IndexError: pass
        finally: return roleInfo

# 配置管理平台: 新增角色
class NewRole(HiteHandler):
    @coroutine
    def post(self):
        try:
            self.post_init('props')

            RoleID = utils.gen_unique_id()
            self.bo_props = {'_ID': RoleID}

            area_ids = None
            org_ids = None

            for p in self.props.get('Roles'):
                key = p.get('ParameterName')
                val = p.get('ParameterValue')

                if key == 'Name' and (not val or len(val) == 0):
                    raise HandlerError(self.rsp_code['params_error'], "Role %s Required" % key)

                if key == 'Area': area_ids = val
                elif key == 'Organization': org_ids = val
                else: self.bo_props[key] = val

            oMsg = yield self.genResult('dm', sysconf_api.newRole(self.bo_props))

            if area_ids:
                oMsg = yield self.genResult('dm', sysconf_api.relatedRoleToRegionTree(self.bo_props['ID'], add_ids=area_ids))
            if org_ids:
                oMsg = yield self.genResult('dm', sysconf_api.relatedRoleToDepartmentTree(self.bo_props['ID'], add_ids=org_ids))

            self.send(self.SUCCESS, {'RoleID': RoleID})

        except HandlerError as e:
            self._send(e.json_msg)

# 配置管理平台: 修改角色
class ModifyRole(HiteHandler):
    @coroutine
    def post(self):
        try:
            self.post_init('props', 'roleId')
            self.bo_props = {}

            add_area_ids = remove_area_ids = add_org_ids = remove_org_ids = None

            for p in self.props.get('Roles'):
                key = p.get('ParameterName')
                val = p.get('ParameterValue')

                if key == 'Area':
                    originalVal = p.get('OriginalParameterValue')

                    remove_area_ids = list(set(originalVal).difference(set(val)))
                    add_area_ids = list(set(val).difference(set(originalVal)))
                elif key == 'Organization':
                    originalVal = p.get('OriginalParameterValue')

                    remove_org_ids = list(set(originalVal).difference(set(val)))
                    add_org_ids = list(set(val).difference(set(originalVal)))
                else:
                    self.bo_props[key] = val

            if self.bo_props:
                oMsg = yield self.genResult('dm', sysconf_api.modifyRole(self.roleId, self.bo_props))

            if add_area_ids or remove_area_ids:
                oMsg = yield self.genResult('dm', sysconf_api.relatedRoleToRegionTree(self.roleId, add_area_ids, remove_area_ids))

            if add_org_ids or remove_org_ids:
                oMsg = yield self.genResult('dm', sysconf_api.relatedRoleToDepartmentTree(self.roleId, add_org_ids, remove_org_ids))

            self.send(self.SUCCESS)

        except HandlerError as e:
            self._send(e.json_msg)

# 配置管理平台: 删除角色
class DeleteRole(HiteHandler):
    @coroutine
    def post(self):
        try:
            self.post_init('roleIds')

            for r in self.roleIds:
                oMsg = yield self.genResult('dm', sysconf_api.deleteRole(r))

            self.send(self.SUCCESS)

        except HandlerError as e:
            self._send(e.json_msg)

# 配置管理平台: 菜单授权
class RoleMenuAuth(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init('roleId')

            menus = yield self.genResult('dm', sysconf_api.getMenusByRole(self.roleId), self.menu_list)
            self.send(self.SUCCESS, {'MenuList': menus})
        except HandlerError as e:
            self._send(e.json_msg)

    def menu_list(self, oMsg):
        try:
            role_info = oMsg['BOS'][0]
            menus = role_info.get('Menu')

            if menus: menus = menus.rstrip(';').split(';')
            else: menus = []

            return menus
        except IndexError:
            raise HandlerError(self.rsp_code['params_error'], "%s does not exist" % self.roleId)

    @coroutine
    def post(self):
        try:
            self.post_init('roleId', 'addMenuIds', 'removeMenuIds')

            oMsg = yield self.genResult('dm', sysconf_api.relatedRoleToMenu(self.roleId, self.addMenuIds, self.removeMenuIds))
            self.send(self.SUCCESS)
        except HandlerError as e:
            self._send(e.json_msg)
