#! /bin/env python
#-*- coding:utf-8 -*-
import json, sys
import os, base64
import hashlib, time
from tornado.gen import coroutine

from hite.mes.comm.log import logger
from hite.mes.comm.handler import HiteHandler, HandlerError
from hite.mes.comm.websess import UserSession, CONNECTOR
from hite.mes.comm.producer import auth_producer, dm_producer
from hite.mes.comm.utils import random_str

from hite.mes.comm.DataModelApi import sysconf as sysconf_api
from hite.mes.comm.DataModelApi import region as region_api
from hite.mes.comm.DataModelApi import department as dept_api

from hite.mes.app.utils import loadTreeNodeByTailisTrue

class Token(HiteHandler):
    @coroutine
    def get(self):
        self.get_init()

        token = self.token.split('_')
        token[1] = str(int(time.time()))

        data = { 'token': '_'.join(token) }

        self.send(self.SUCCESS, data)

class Login(HiteHandler):
    @coroutine
    def post(self):
        try:
            self.set_header('Access-Control-Allow-Origin', '*')

            self.get_form_data()

            self._require_validate('username', 'password')
            self.validate()

            self.id = self.oMsgPool.add(self.user_id, client=self.parse_user_agent())

            msg = {
                "Type": "LoginReq",
                "UserID": self.username,
                "Password": self.password,
                "HardCode": '1',
                "ClientType": self.parse_user_agent(),
                "IP": self.get_remote_ip()
            }
            result = yield self.genResult('auth', msg)

            self.user_id = result.get('UserID')
            self.username = result.get('Name')
            roles = result.get('Role')

            new_token = self.gen_token(self.get_remote_ip(), self.parse_user_agent())
            time_token = new_token + '_' + str(int(time.time()))
            data = {
                'userId': self.user_id,
                'userName': result.get('Name'),
                'token': time_token,
                'userRoles': roles,
                'userPrivileges': []
            }

            menu_info = []
            rTree = []
            dTree = []
            if len(roles) > 0:
                # 获取用户授权菜单
                oMsg = yield self.genResult('dm', sysconf_api.getMenusByRoles(roles))

                role_infos = oMsg['BOS']

                ml = []
                for r in role_infos:
                    menu = r.get('Menu')
                    if not menu: continue
                    ml.extend(menu.split(';'))

                menus = set(ml)
                msg = {
                    "Type":"GetBOInfoReq",
                    "DataModelName":"s_MenuMan",
                    "BOName":"Menu",
                    "Where":"ID IN \"{%s}\"" % ','.join(menus),
                    "Selector":"Link",
                    "Orderby": ['Link']
                }
                oMsg = yield self.genResult('dm', msg)

                menu_info = [b['Link'] for b in oMsg['BOS'] if b['Link']]
                data['userPrivileges'] = menu_info

                # 获取用户区域架构树权限
                rMsg = yield self.genResult('dm', region_api.regionTree(roles))
                rTree = loadTreeNodeByTailisTrue(rMsg['BOTree'], 'Area')

                # 获取用户组织架构树权限
                dMsg = yield self.genResult('dm', dept_api.deptTree(roles))
                dTree = loadTreeNodeByTailisTrue(dMsg['BOTree'], 'Organization')

            # 创建用户session
            self.user_session = UserSession(self.user_id, new_token)
            self.user_session.setup(self.username, roles=roles, privileges=menu_info, \
                    regionTree=rTree, deptTree=dTree, clientAgent=self.parse_user_agent(), remoteIP=self.get_remote_ip())

            self.send(self.SUCCESS, data)

            # validate
            # check token
        except HandlerError as e:
            self._send(e.json_msg)

class Logout(HiteHandler):
    @coroutine
    def post(self):
        try:
            self.post_init()

            msg = {
                "Type":"QuitReq",
                "UserID": self.user_id,
                "HardCode": ""
            }

            yield self.genResult('auth', msg)

            self.user_session.destroy()
            self.send(self.SUCCESS)
        except HandlerError as e:
            self._send(e.json_msg)

class Roles(HiteHandler):
    @coroutine
    def get(self):
        self.set_header('Access-Control-Allow-Origin', '*')

        self.userId = self.get_arg('userId')
        self.token = self.get_arg('token')

        # validate
        # check token
        data = {
            'roles': ['root']
        }
        self.send(self.SUCCESS, data)

class Privileges(HiteHandler):
    @coroutine
    def get(self):
        self.get_init('roleId')

        self.send_mq = 'dm'
        self.send_msg = {
            "Type":"GetBOInfoReq",
            "DataModelName":"s_RoleMan",
            "BOName":"Role",
            "Selector":"Menu",
            "Where": "ID ==\"%s\"" % self.roleId
        }
        self.send_callback = 'parse_response'

    def parse_response(self, oMsg):
        try:
            role_info = oMsg['BOS'][0]

            menu_set = set()
            menu = role_info.get('Menu')
            menus = set(menu.split(';'))

            self.send_msg = {
                "Type":"GetBOInfoReq",
                "DataModelName":"s_MenuMan",
                "BOName":"Menu",
                "Where":"ID IN \"{%s}\"" % ','.join(menus),
                "Selector":"Link",
                "Orderby": ['Link']
            }
            self.send_callback = 'parse_menu_response'

        except IndexError:
            raise HandlerError(self.rsp_code['params_error'], "%s does not exist" % self.roleId)

    def parse_menu_response(self, oMsg):
        try:
            menu_info = [b['Link'] for b in oMsg['BOS'] if b['Link']]
            self.response_data = {'MenuLinks': menu_info}

            self.send_msg = None

        except IndexError:
            raise HandlerError(self.rsp_code['params_error'], "%s does not exist" % self.roleId)
