#! /bin/env python
#-*- coding:utf-8 -*-
import json, sys, urllib
import os, base64, datetime
from functools import partial

from tornado.gen import coroutine

from hite.mes.comm import config
from hite.mes.comm.log import logger
from hite.mes.comm.handler import HiteHandler, HandlerError

from hite.mes.app.utils import DEVICE_DRIVER_OPTIONS
from hite.mes.comm.DataModelApi import sysconf as sysconf_api
from hite.mes.comm.DataModelApi import model as model_api


# 测试模拟接口
class TestApi(HiteHandler):
    @coroutine
    def get(self):
        self.set_header('Access-Control-Allow-Origin', '*')

        r = self._get_arg('__request')
        self.send(self.SUCCESS, r)

    @coroutine
    def post(self):
        self.set_header('Access-Control-Allow-Origin', '*')

        r = self.get_form_data()
        self.send(self.SUCCESS, r)


# 配置管理平台: 获取字典信息
class DictOptions(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init('categroy')

            if self.categroy not in ('group', 'driver', 'flowchart', 'var_type', 'var_datatype', 'rtdb', 'var_convertor', 'enum_switch', 'duty_type'):
                raise HandlerError(self.rsp_code['params_error'], "categroy %s does not support" % self.categroy)

            if self.categroy == 'driver':
                self.send(self.SUCCESS, [{'Key': k, 'Value': v} for k,v in DEVICE_DRIVER_OPTIONS.items()])
                return

            t = 's_dev_%s' % self.categroy
            if self.categroy in ('rtdb', 'enum_switch','duty_type'): t = 's_%s' % self.categroy

            data = yield self.genResult('dm', sysconf_api.dictOptions(t))
            self.send(self.SUCCESS, data['BOS'])

        except HandlerError as e:
            self._send(e.json_msg)

# 字典管理：列表
class DictList(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init(pageIndex='int', pageSize='int')

            datalist = yield self.genResult('dm', sysconf_api.dictList(self.pageIndex, self.pageSize), self.get_page_list)

            self.send(self.SUCCESS, datalist)
        except HandlerError as e:
            self._send(e.json_msg)

    def get_page_list(self, oMsg):
        return {
            'pageList': oMsg['BOS'],
            'pageIndex': oMsg['PageIndex'],
            'pageCount': oMsg['PageCount']
        }

# 字典管理：模板
class DictTemplate(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init()

            data = yield self.genResult('dm', model_api.getDictTemplate(), self.dict_template)
            self.send(self.SUCCESS, data)
        except HandlerError as e:
            self._send(e.json_msg)

    def dict_template(self, oMsg):
        try:
            props = oMsg['DataModelDefine']['DataNode']['Properties']
            return {'DictTemplate': {'Props': props}}
        except KeyError:
            raise HandlerError(self.rsp_code['params_error'], "dict template does not exist")


# 字典管理：新增
class AddDict(HiteHandler):

    @coroutine
    def post(self):
        try:
            self.post_init('props')

            oMsg = yield self.genResult('dm', sysconf_api.newDict(self.props))
            self.send(self.SUCCESS)
        except HandlerError as e:
            self._send(e.json_msg)


# 字典管理：编辑
class ModifyDict(HiteHandler):

    @coroutine
    def post(self):
        try:
            self.post_init('props')

            error_flag = False
            for p in self.props:
                oMsg = yield self.genResult('dm', sysconf_api.modifyDict(p['Key'], p['Type'], p['Modified']))

            self.send(self.SUCCESS)
        except HandlerError as e:
            self._send(e.json_msg)

# 字典管理： 删除
class DeleteDict(HiteHandler):

    @coroutine
    def post(self):
        try:
            self.post_init('dicts')

            error_flag = False
            for d in self.dicts:
                oMsg = yield self.genResult('dm', sysconf_api.deleteDict(d['Key'], d['Type']))

            self.send(self.SUCCESS)
        except HandlerError as e:
            self._send(e.json_msg)
