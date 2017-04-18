#! /bin/env python
#-*- coding:utf-8 -*-
import sys
import time, json, struct
from stompest.config import StompConfig
from stompest.protocol import StompSpec
from stompest.sync import Stomp
from stompest.error import StompConnectionError

from hite.mes.comm import config
from hite.mes.comm.log import logger
from hite.mes.comm.utils import sign

def _sender(queue_req, msg, session_id, msg_id, selector=None):
    stomp_config = config.mq.get('stomp')
    client = Stomp(StompConfig(stomp_config))
    client.connect()

    #H = {StompSpec.CONTENT_LENGTH_HEADER: len(msg), "length": len(msg)}
    H = {}
    H['MsgID'] = msg_id
    H['SessionID'] = session_id
    H['Signature'] = sign(msg)
    if selector is not None:
        H[selector[0]] = selector[1]

    print 'send msg: '
    print json.dumps(msg, indent=1)
    if isinstance(msg, dict): msg = json.dumps(msg)
    logger.info('===>[%s] session_ids: %s, body: %s' % (queue_req, session_id, msg))

    client.send(queue_req, body=msg, headers=H, receipt="ok")
    client.disconnect()

def auth_producer(msg, session_id, msg_id):
    q = config.mq.get('auth_req')
    _sender(q, msg, session_id, msg_id, ('pyhost', config.mq_selector))

def dm_producer(msg, session_id, msg_id):
    q = config.mq.get('dm_req')
    _sender(q, msg, session_id, msg_id, ('pyhost', config.mq_selector))

def alarm_producer(msg, session_id, msg_id):
    q = config.mq.get('alarm_req')
    _sender(q, msg, session_id, msg_id)

def rtd_producer(msg, session_id, msg_id):
    q = config.mq.get('rtd_req')
    _sender(q, msg, session_id, msg_id)

def wf_producer(msg, session_id, msg_id):
    q = config.mq.get('wf_req')
    _sender(q, msg, session_id, msg_id)

if __name__ == '__main__':
    args = sys.argv
    if len(args) > 1: do = args[1]
    if len(args) > 2: session_id = args[2]

    if do == 'login':
        # 登录
        c1 = { "Type": "LoginReq", "UserID": "luyj", "Password": "123", "HardCode": "aa", "ClientType": "00", "IP": "192.168.8.12" }
        session_id = '%s_%s' % (c1['UserID'], str(int(time.time())))
        auth_producer(json.dumps(c1), session_id)
    elif do == 'init':
        # 初始化
        c2 = {"Type": "InitialReq", "UserID":"luyj" }
        #session_id = '%s_%s' % (c2['UserID'], str(int(time.time())))
        auth_producer(json.dumps(c2), session_id)
    elif do == 'get_device':
        # 一次性获取设备变量
        c3 = { "Type":"GetDeviceRTDBVarValueReq", "DeviceVars": [ {"GuangDong_GH_XRNM1029":["onLine", "isRunning", "varGH1","varGH2"]}, ] }
        #session_id = 'luyj_%s' % str(int(time.time()))
        rtd_producer(json.dumps(c3), session_id)
    elif do == 'get_alarm':
        # 一次性获取报警
        c4 = { "Type":"GetDeviceAlarmInfoReq", "DeviceIDs": ["GuangDong_GH_XRNM1029"] }
        #session_id = 'luyj_%s' % str(int(time.time()))
        alarm_producer(json.dumps(c4), session_id)
    elif do == 'sub_device':
        # 订阅设备变量
        #c4 = { "Type":"SubscribeDeviceRTDBVarValueChangeReq", "DeviceVars": [{"GuangDong_GH_XRNM1029": ["onLine", "isRunning", "varGH2"]}, ] }
        c4 = {"Type":"SubscribeDeviceRTDBVarValueChangeReq", "DeviceVars": [{"BeiJingHDGCZXMM1203":["onLine","isRunning","varInverterFailure","varHighPressure","varExportLowTemprature","varHighSteamPressure","varHighSolutionTemperature","varCoolingWaterTemperature"]}, ]}
        #session_id = 'luyj_%s' % str(int(time.time()))
        rtd_producer(json.dumps(c4), session_id)
    elif do == 'sub_alarm':
        # 订阅报警变量
        c4 = { "Type":"SubscribeDeviceAlarmInfoChangeReq", "DeviceIDs": ["GuangDong_GH_XRNM1029"] }
        #session_id = 'luyj_%s' % str(int(time.time()))
        alarm_producer(json.dumps(c4), session_id)
    elif do == 'unsub_device':
        # 取消订阅
        c4 = { "Type":"SubscribeDeviceRTDBVarValueChangeReq", "DeviceVars": [{"GuangDong_GH_XRNM1029": ["onLine", "isRunning"]}, ]}
        #session_id = 'luyj_%s' % str(int(time.time()))
        rtd_producer(json.dumps(c4), session_id)
    elif do == 'unsub_alarm':
        # 取消报警订阅
        c5 = { "Type":"SubscribeDeviceAlarmInfoChangeReq", "DeviceIDs": [] }
        #session_id = 'luyj_%s' % str(int(time.time()))
        alarm_producer(json.dumps(c5), session_id)
    elif do == 'logout':
        # 退出登录
        c6 = { "Type":"QuitReq", "UserID":" luyj", "HardCode":"343242" }
        #session_id = '%s_%s' % (c6['UserID'], str(int(time.time())))
        auth_producer(json.dumps(c6), session_id)
