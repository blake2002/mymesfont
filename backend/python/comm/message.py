#! /bin/env python
#-*- coding:utf-8 -*-
import json, time, datetime
from concurrent.futures import *

from hite.mes.comm import config
from hite.mes.comm.log import logger
from hite.mes.comm.utils import random_str

#HITE_OMSGPOOL = '__HITE_OMSGPOOL__'

def gen_unique_sn():
    dt = str(time.mktime(datetime.datetime.now().timetuple()))
    dt = dt.split('.')[0]
    return '%s%s' % (dt, random_str(6, 6))

class Message(dict):

    def __init__(self, action=None):
        self.action = action

    def add(self, usrid, client=None, req=None):
        id = None
        if req is not None:
            id = req.headers.get('Last-Event-ID')
            logger.debug('msgPool Last-Event-ID: %s' % id)
        if not id:
            id = str(usrid) + '_' + gen_unique_sn() + '_' + client
            logger.debug('msgPool add: %s' % (id))

        self[id] = [[Future()], 0, 0] # [Results, request timeout, response timeout]

        return id

    def pop(self, id): self[id][0].pop(0)

    def send(self, val, id):
        try: a = self[id]
        except KeyError:
            logger.info('msgPool send no id %s' % id)
            print 'msgPool send no id %s' % id
            return

        # futures
        a[0].append(Future())
        a[0][-2].set_result(val)

        a[1] = 0
        a[2] = time.time() # 结果在队列中保留30s，超时后将被清理

    def wait(self, id):
        try: a = self[id]
        except KeyError:
            logger.debug('msgPool wait no id %s' % id)
            return

        a[2] = 0
        a[1] = time.time() # 等待结果30s，30s后请求超时

        try: r = a[0][0]
        except IndexError:
            logger.info('msgPool no futures')
            return

        return r

    def close(self, id):
        try: del self[id]
        except KeyError,e:
            logger.info('msgPool close no id %s, except: %s' % (id, e))


def MessageTimeout(oMsgPool):
    while True:
        try:
            t = time.time()

            send_ids = []
            remove_ids = []
            for id, msg in oMsgPool.items():
                if msg[1] and msg[1] + 30 < t: # 等待结果超时
                    send_ids.append(id)

                elif msg[2] and msg[2] + 30 < t: # 用户连接超时，结果没有被消费
                    remove_ids.append(id)

            if send_ids:
                if oMsgPool.action == 'sse':
                    for id in send_ids: oMsgPool.send('doWait', id)
                else:
                    for id in send_ids: oMsgPool.send(None, id)

            if remove_ids:
                for id in remove_ids: del oMsgPool[id]

#            print 'oMsgPool: ', oMsgPool
#            print '------------------------------------'

        finally: time.sleep(3)


if __name__ == '__main__': pass

