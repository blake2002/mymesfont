#! /bin/env python
#-*- coding:utf-8 -*-
import json, sys, time
import os, base64
from tornado.gen import coroutine

from hite.mes.comm.log import logger
from hite.mes.comm.handler import HiteHandler, HandlerError
from hite.mes.comm.websess import UserSession

from hite.mes.comm.DataModelApi import region as region_api
from hite.mes.comm import utils

class TagList(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init('category')

            tag_list = yield self.genResult('dm', region_api.tagList(self.user_id), self.tag_list)

            if len(tag_list) == 0: # 标签列表为空，默认添加“已关注”标签
                props = {'_ID': utils.gen_unique_id(), 'Name': '已关注'}

                oMsg = yield self.genResult('dm', region_api.newTag(self.user_id, props))

                props['Count'] = 0
                props['UserID'] = self.user_id
                self.send(self.SUCCESS, {'TagList': [props]})
                return

            # 查询标签上设备个数
            commands = []
            for t in tag_list:
                m = region_api.getTargetCountByTag(self.user_id, t['Name'], self.category)
                commands.append(m)

            oMsg = yield self.genResult('dm', {'Type': 'BatchReadReq', 'Commands': commands})
            tag_list = self.target_count(oMsg, tag_list)

            self.send(self.SUCCESS, {'TagList': tag_list})
        except HandlerError as e:
            self._send(e.json_msg)

    def tag_list(self, oMsg): return oMsg['BOS']

    def target_count(self, oMsg, tagList):
        results = oMsg['Results']

        i = 0
        for t in tagList:
            t['Count'] = results[i]['Count']
            i += 1

        return tagList

class NewTag(HiteHandler):
    @coroutine
    def post(self):
        try:
            self.post_init('tagName')

            if len(self.tagName.strip()) == 0:
                raise HandlerError(self.rsp_code['params_error'], 'tagName required')

            oMsg = yield self.genResult('dm', region_api.newTag(self.user_id, {"Name": self.tagName}))
            self.send(self.SUCCESS)

        except HandlerError as e:
            self._send(e.json_msg)

class ModifiedTag(HiteHandler):
    @coroutine
    def post(self):
        try:
            self.post_init('tagName', 'newTagName')

            oMsg = yield self.genResult('dm', region_api.modifyTag(self.user_id, self.tagName, self.newTagName))
            self.send(self.SUCCESS)

        except HandlerError as e:
            self._send(e.json_msg)

class DeleteTag(HiteHandler):
    @coroutine
    def post(self):
        try:
            self.post_init('tagName')

            msg = region_api.deleteTag(self.user_id, self.tagName)
            oMsg = yield self.genResult('dm', msg)

            self.send(self.SUCCESS)
        except HandlerError as e:
            self._send(e.json_msg)

class TagTargetList(HiteHandler):
    @coroutine
    def get(self):
        try:
            self.get_init('tagName', pageIndex='int', pageSize='int')

            path = self.get_request_path()
            if path == 'tag_member_list': categroy = 'user'
            elif path == 'tag_device_list': categroy = 'device'

            oMsg = yield self.genResult('dm', region_api.getTargetListByTag(self.user_id, self.tagName, self.pageIndex, self.pageSize, categroy), self.target_list)
            self.send(self.SUCCESS, oMsg)

        except HandlerError as e:
            self._send(e.json_msg)

    def target_list(self, oMsg):
        return {
            'pageList': oMsg['BOS'],
            'pageIndex': oMsg['PageIndex'],
            'pageCount': oMsg['PageCount']
        }
