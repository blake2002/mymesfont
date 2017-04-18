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

    client.send(queue_req, body=msg, headers=H, receipt="ok")
    client.disconnect()

def rtd_producer(msg, session_id, msg_id):
    _sender(config.rtd_queue.get('req'), msg, session_id, msg_id)

def test(session_id, event_id):
    m = {
            'Type': 'SubscribeDeviceRTDBVarValueChangeReq',
            'Mode': 'overwrite',
            'DeviceVars': [
                {'BeiJing_KJXY_ZXNC1020': ['isRunning', 'onLine']},
                {'BeiJing_KJXY_ZXNC1021': ['isRunning', 'onLine']},
                {'BeiJing_KJXY_ZXNC1022': ['isRunning', 'onLine']},
                {'JiangSu_DZJR_ZXPJ1091': ['isRunning', 'onLine']},
                {u'JiangSu_SLJN_ZXXZ0001': ['isRunning', 'onLine']},
                {u'JiangSu_ZYDJD_SXMG1127': ['isRunning', 'onLine']},
                {u'ShanDong_HDC_ZXQE1070': ['isRunning', 'onLine']},
                {u'TJ_SXPH1116': ['isRunning', 'onLine']},
                {u'GuangDong_YSMT_SXKH1183': ['isRunning', 'onLine']}
            ]
        }
    rtd_producer(m, session_id, event_id)

if __name__ == '__main__':
    session_id = 'shiwj_test_session_id'
    event_id = 'shiwj_test_event_id'
    test(session_id, event_id)
