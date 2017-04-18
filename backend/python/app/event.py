#! /bin/env python
#-*- coding:utf-8 -*-
import json, sys, time
import os, base64, struct

from tornado.gen import coroutine

from hite.mes.comm import config
from hite.mes.comm.utils import gen_unique_sn
from hite.mes.comm.log import logger
from hite.mes.comm.handler import HiteHandler

class Event(HiteHandler):

    def first(self):
        return gen_unique_sn()

    @coroutine
    def get(self):
        SSE_HEADERS = (
            ('Content-Type','text/event-stream; charset=utf-8'),
            ('Cache-Control','no-cache'),
            ('Access-Control-Allow-Origin', '*'),
            ('Access-Control-Allow-Credentials', 'true'),
            ('Connection', 'keep-alive')
        )
        for name, value in SSE_HEADERS: self.set_header(name, value)

        self.id = id = self.first()
        if self.id is None: return

        self.set_header('Last-Event-ID', id)

        logger.info('SSE [%s] %s New incoming' % (self.id, self.get_remote_ip()))
        self.flush()

        M = [
            {'type': 'startSSE', 'msg': {'eventId': id}},
            {'type': 'notice', 'msg': {'content': 'test!notice!'}},
            {'type': 'warning', 'msg': {'eventId': 'test!warning!'}},
        ]
        for m in M:
            self.send(id, m)
            self.flush

    def send(self, id, msg):
        self.write('retry: 10000\n')
        if id is None: id = ''

        self.write('id:' + id + '\ndata:')
        json.dump(msg, self, sort_keys=True, separators=(',', ':') )
        self.write('\n\n')

