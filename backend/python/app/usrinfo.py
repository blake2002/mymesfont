#! /bin/env python
#-*- coding:utf-8 -*-
import json, sys
import os, base64, datetime
from functools import partial

from tornado.gen import coroutine

from hite.mes.comm import config
from hite.mes.comm.log import logger
from hite.mes.comm.websess import UserSession
from hite.mes.comm.producer import dm_producer
from hite.mes.comm.handler import CODE, JsonpHandler

class UpdateUsrLocation(JsonpHandler):
    @coroutine
    def get(self):
        self.set_header('Access-Control-Allow-Origin', '*')

        self.usrid = self.get_arg('usrid')
        self.session_id = self.get_arg('session_id')

        self.longitude = self.get_arg('longitude')
        self.latitude = self.get_arg('latitude')
        self.radius = self.get_arg('radius')

        t = datetime.datetime.today()
        timestamp = '%d-%d-%d %d:%d:%d.%d' % (t.year, t.month, t.day, t.hour, t.minute, t.second, t.microsecond)
        msg = {
            'Type':'ModifyBOInfoReq',
            'DataModelName':'Users',
            'BOName':'NSUsers',
            'Where':'UserID == "%s"' % self.usrid,
            'BOProps': [
                {
                    "Longitude": self.longitude,
                    "Latitude": self.latitude,
                    "Radius": self.radius,
                    "LocationDescription": "服务人员定位",
                    "GpsTimeStamp": timestamp
                }
            ]
        }

        msg_id = self.oMsgPool.add(self.usrid)
        dm_producer(msg, self.session_id, msg_id)
        self.oMsgPool.req(msg_id)

        oMsg = yield self.oMsgPool.wait(msg_id)
        self.oMsgPool.remove(msg_id)
        if oMsg is None:
            self.send(self.REQTIMEOUT)
            return

        self.send(self.SUCCESS, oMsg)

class GetUsrLocation(JsonpHandler):
    @coroutine
    def get(self):
        self.set_header('Access-Control-Allow-Origin', '*')

        self.usrid = self.get_arg('usrid')
        self.session_id = self.get_arg('session_id')

        self.service_usrid = self.get_arg('service_usrid')
        msg = {
            'Type':'GetBOInfoReq',
            'DataModelName':'Users',
            'BOName':'NSUsers',
            'Where':'UserID == "%s"' % self.service_usrid,
            'PageIndex':1,
            'PageLine': 1
        }

        msg_id = self.oMsgPool.add(self.usrid)
        dm_producer(msg, self.session_id, msg_id)
        self.oMsgPool.req(msg_id)

        oMsg = yield self.oMsgPool.wait(msg_id)
        self.oMsgPool.remove(msg_id)
        if oMsg is None:
            self.send(self.REQTIMEOUT)
            return

        self.send(self.SUCCESS, oMsg)
