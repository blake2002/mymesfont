#! /bin/env python
#-*- coding:utf-8 -*-
import json, sys, time
import os, base64
from tornado.gen import coroutine

from hite.mes.comm.log import logger
from hite.mes.comm.handler import HiteHandler, HandlerError
from hite.mes.comm.websess import UserSession

from hite.mes.comm import utils
from hite.mes.comm.DataModelApi import sysconf as sysconf_api

class MenuList(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init('parentId')

            menu_list = yield self.genResult('dm', sysconf_api.menuList(self.parentId), self.menu_list)
            # 查询是否有下级
            if menu_list:
                commands = [sysconf_api.menuList(m['ID']) for m in menu_list]
                msg = {'Type': 'BatchReadReq', 'Commands': commands}

                oMsg = yield self.genResult('dm', msg)
                menu_list = self.menu_children(oMsg, menu_list)

            self.send(self.SUCCESS, {'MenuList': menu_list})
        except HandlerError as e:
            self._send(e.json_msg)

    def menu_list(self, oMsg):
        menu_list = oMsg['BOS']
        if not menu_list or len(menu_list) < 1: menu_list = []

        return menu_list

    def menu_children(self, oMsg, menuList):
        i = 0
        for o in oMsg.get('Results'):
            if int(o.get('PageCount')) >= 1:
                menuList[i]['children'] = []
            i += 1

        return menuList

class NewMenu(HiteHandler):
    @coroutine
    def post(self):
        try:
            self.post_init('props')
            tasks = []

            self.menu_ids = []
            for p in self.props:
                try: parentId = p.pop('parentMenuID')
                except KeyError: parentId = '-1'

                if not p['Name'] or len(p['Name']) == 0:
                    raise HandlerError(self.rsp_code['params_error'], "menu name required")

                if '_ID' not in p: p['_ID'] = utils.gen_unique_id()
                self.menu_ids.append(p['_ID'])

                oMsg = yield self.genResult('dm', sysconf_api.newMenu(parentId, p))

            self.send(self.SUCCESS, self.menu_ids)

        except HandlerError as e:
            self._send(e.json_msg)

class ModifiedMenu(HiteHandler):
    @coroutine
    def post(self):
        try:
            self.post_init('props')

            for p in self.props:
                menuId = p.pop('menuID')
                oMsg = yield self.genResult('dm', sysconf_api.modifyMenu(menuId, p))

            self.send(self.SUCCESS)
        except HandlerError as e:
            self._send(e.json_msg)

class DeleteMenu(HiteHandler):
    @coroutine
    def post(self):
        try:
            self.post_init('menuIDs')

            oMsg = yield self.genResult('dm', sysconf_api.deleteMenu(self.menuIDs))
            self.send(self.SUCCESS)
        except HandlerError as e:
            self._send(e.json_msg)
