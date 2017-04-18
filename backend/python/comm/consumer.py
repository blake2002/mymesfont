#! /bin/env python
#-*- coding:utf-8 -*-
import threading, json, os
from datetime import datetime

from stompest.sync import Stomp
from stompest.config import StompConfig
from stompest.protocol import StompSpec

from functools import partial

from hite.mes.comm import config
from hite.mes.comm.log import logger
from hite.mes.comm.utils import sign

def parse_headers(H, B):
    # check sign
    # sign(B) == H.get('Signature') return None
    return H.get('MsgID')

class Consumer(threading.Thread):
    rsp_queue = None
    client = None

    def __init__(self, oMsgPool):
        threading.Thread.__init__(self)
        self.oMsgPool = oMsgPool

    def connect(self, mq_name, selector=None):
        self.rsp_queue = config.mq.get(mq_name)
        self.client = Stomp(StompConfig(config.mq.get('stomp')))

        self.client.connect()

        spec ={ StompSpec.ACK_HEADER: StompSpec.ACK_CLIENT_INDIVIDUAL}
        if selector:
            spec[StompSpec.SELECTOR_HEADER] = "%s='%s'" % selector

        self.client.subscribe(self.rsp_queue, spec)
        print 'Consumer [%s] waiting for messages ...' % self.rsp_queue

    def run(self): pass

class AuthConsumer(Consumer):
    def run(self):
        self.connect('auth_rsp', ('pyhost', config.mq_selector))

        while True:
            frame = self.client.receiveFrame()
            self.client.ack(frame)

            msg_id = parse_headers(frame.headers, frame.body)
            if not msg_id: continue
            logger.debug('[Auth Consumer] body: %s' % frame.body)
            try: msg = json.loads(frame.body)
            except:
                logger.error('[Auth Consumer] body: %s' % frame.body)
                continue
            self.oMsgPool.send(msg, msg_id)

        self.client.disconnect()

class RTDataConsumer(Consumer):
    def run(self):
        self.connect('rtd_rsp')

        while True:
            frame = self.client.receiveFrame()
            self.client.ack(frame)

            msg_id = parse_headers(frame.headers, frame.body)
            try: body = json.loads(frame.body)
            except:
                logger.error('[RTData Consumer] body: %s' % frame.body)
                continue
            req_idlist = None
            if 'ReqIDList' in body: req_idlist = body.pop('ReqIDList')
            if body['Type'] == 'SubscribeDeviceRTDBVarValueChangePush':
                for req_id in req_idlist:
                    self.oMsgPool.send(body, req_id)
            else:
                if not msg_id: continue
                if body['Type'] == 'SubscribeDeviceRTDBVarValueChangeFeedback' and len(body["DeviceVarValues"]) == 0: continue
                self.oMsgPool.send(body, msg_id)
        self.client.disconnect()

class AlarmConsumer(Consumer):
    def run(self):
        self.connect('alarm_rsp')

        while True:
            frame = self.client.receiveFrame()
            self.client.ack(frame)

            msg_id = parse_headers(frame.headers, frame.body)

            logger.debug('[Alarm Consumer] body: %s' % frame.body)
            try: body = json.loads(frame.body)
            except:
                logger.error('[Alarm Consumer] body: %s' % frame.body)
                continue
            req_idlist = None
            if 'ReqIDList' in body: req_idlist = body.pop('ReqIDList')
            if body['Type'] == 'SubscribeDeviceAlarmInfoChangePush':
                for req_id in req_idlist: self.oMsgPool.send(body, req_id)
            else:
                if not msg_id: continue
                if body['Type'] == 'UnSubscribeDeviceAlarmInfoChangeFeedback': continue
                self.oMsgPool.send(body, msg_id)
        self.client.disconnect()

class DMConsumer(Consumer):
    def run(self):
        print 'consumer: %s' % config.mq_selector
        self.connect('dm_rsp', ('pyhost', config.mq_selector))

        while True:
            frame = self.client.receiveFrame()
            self.client.ack(frame)
            logger.debug('[DM Consumer] body: %s' % frame.body)

            msg_id = parse_headers(frame.headers, frame.body)
            if not msg_id: continue

            try:
                body = json.loads(frame.body)
                # print 'consumer body:'
                # print json.dumps(body, indent=1)
                self.oMsgPool.send(body, msg_id)
            except:
                logger.error('[DM Consumer] body: %s' % frame.body)
                continue
        self.client.disconnect()

class WFConsumer(Consumer):
    def run(self):
        self.connect('wf_rsp')

        while True:
            frame = self.client.receiveFrame()
            self.client.ack(frame)
            logger.debug('[WF Consumer] body: %s' % frame.body)

            msg_id = parse_headers(frame.headers, frame.body)
            if not msg_id: continue

            try: body = json.loads(frame.body)
            except:
                logger.error('[WF Consumer] body: %s' % frame.body)
                continue
            self.oMsgPool.send(body, msg_id)
        self.client.disconnect()

if __name__ == '__main__': pass
