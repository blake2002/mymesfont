#! /bin/env python
#-*- coding:utf-8 -*-
import sys
import time, json, struct
from stompest.config import StompConfig
from stompest.protocol import StompSpec
from stompest.sync import Stomp
from stompest.error import StompConnectionError

from fuanda.hite import config
from fuanda.hite.hite_utils import sign

def _sender(queue_req, msg, session_id, msg_id):
    stomp_config = config.mq_config.get('stomp')
    client = Stomp(StompConfig(stomp_config))
    client.connect()

    #H = {StompSpec.CONTENT_LENGTH_HEADER: len(msg), "length": len(msg)}
    H = {}
    H['MsgID'] = msg_id
    H['SessionID'] = session_id
    H['Signature'] = sign(msg)

    if isinstance(msg, dict): msg = json.dumps(msg)
    print '===> [%s] session_ids: %s, body: %s' % (queue_req, session_id, msg)
    #print '===>[%s] session_ids: %s, body: %s' % (queue_req, session_id, msg)

    client.send(queue_req, body=msg, headers=H, receipt="ok")
    client.disconnect()

def rtd_producer(msg, session_id, msg_id):
    _sender(config.rtd_queue.get('rsp'), msg, session_id, msg_id)

def test(device_id, event_id):
    i = 0;
    ir = ['0', '1', '1', '0', '1', '1', '0', '1', '0', '1']
    ion = ['1', '1', '0', '1', '1', '0', '1', '0', '1', '0']
    while (i < 10):
        m = {
                "Result":"0",
                "Type":"SubscribeDeviceRTDBVarValueChangePush",
                "Comment":"ok",
                "DeviceVarValues":[{device_id:{"isRunning":ir[i],"onLine":ion[i]}}],
                "ReqIDList": [event_id]
        }
        rtd_producer(m, event_id, event_id)
        time.sleep(2)
        i += 1

if __name__ == '__main__':
    args = sys.argv
    if len(args) > 1: device_id = args[1]
    if len(args) > 2: event_id = args[2]

    test(device_id,event_id)
