#! /bin/env python
#-*- coding:utf-8 -*-
import json, sys
import os, base64
from functools import partial

from tornado.gen import coroutine

from hite.mes.comm import config
from hite.mes.comm.handler import CODE, JsonpHandler
from hite.mes.comm.utils import FROM_MOBILE_CLIENT, FROM_PC_CLIENT, FROM_MOBILE_WEB_CLIENT

class GetConfig(JsonpHandler):
    @coroutine
    def get(self):
        self.usrid = self.get_arg('usrid')
        self.session_id = self.get_arg('session_id')

        self.client_type = FROM_MOBILE_CLIENT # from mobile app
        if 'client_type' in self.request.arguments: self.client_type = self.get_arg('client_type')

        if not self.session_check(): return

        oMsg = {
            'Result': self.SUCCESS,
            'ip': '61.160.70.100',
            'port': '9988',
            'uid': 'test',
            'pwd': 'test123456',
            'epId': 'wxict',
            'bfix': '0'
        }
        self.send(self.SUCCESS, oMsg)
