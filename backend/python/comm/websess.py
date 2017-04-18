#! /bin/env python
#-*- coding:utf-8 -*-
import json, datetime
from uuid import uuid4

from hite.mes.comm import config
from hite.mes.comm import rc

# web session id连接符，token中使用
CONNECTOR = '$h$'

'''
usage:
1. user login: setup user session(hash set - redis)
2. user logout: destroy user session
3. set user event id for [sse]
4. sso by device_id changed

params:
base_event_id: usr base status server-send-event id
'''
class UserSession():
    prefix = 'hite_websess:'

    def __init__(self, id, token):
        self.user_id = id
        self.sid = self.prefix + str(self.user_id) + ":" + token

        self.name = None
        self.remote_ip = None
        self.client_agent = None

        self.session_ids = None
        self.event_ids = None
        self.hardware_ids = None
        self.my_device_info = None

    def get_session_expire_time(self):
        timeout = config.session_timeout.get('timeout')
        if not timeout: return

        lifetime = datetime.timedelta(minutes=int(timeout))
        sess_exp = lifetime.days * 86400 + lifetime.seconds
        #print 'timeout: ', sess_exp
        return sess_exp

    def load(self):
        usrinfo = rc.hget(self.sid)
        if not usrinfo:
            return

        for k, v in usrinfo.iteritems():
            try: v = json.loads(v)
            except ValueError: pass
            setattr(self, k, v)

        return self.user_id

    def setup(self, name, **kwargs):
        sess_exp = self.get_session_expire_time()

        usrinfo = { 'user_id': self.user_id, 'name': str(name) }
        rc.hset(self.sid, usrinfo, timeout=sess_exp)

        if kwargs:
            for k,v in kwargs.items(): self.set(k, v)

        self.load()

    def set(self, name, value):
        try:
            if getattr(self, name) == value: return
        except AttributeError: pass

        sess_exp = self.get_session_expire_time()

        setattr(self, name, value)

        if isinstance(value, dict) or isinstance(value, list): value = json.dumps(value)
        rc.hset(self.sid, {name: value}, timeout=sess_exp)

    def get(self, name):
        value = rc.hget_item(self.sid, name)
        if value:
            try: value = json.loads(value)
            except ValueError: pass
        return value

    def add(self, name, v):
        value = self.get(name)
        if not isinstance(value, list): return

        if v in value: return

        value.append(v)
        self.set(name, value)

    def pop(self, name, v):
        value = self.get(name)
        if not isinstance(value, list): return

        if v not in value: return

        value.remove(v)
        self.set(name, value)

    def remove(self, name):
        sess_exp = self.get_session_expire_time()

        setattr(self, name, '')
        rc.hset(self.sid, {name: ''}, timeout=sess_exp)

    def destroy(self):
        rc.hdel(self.sid)

if __name__ == '__main__':

    user_sess = UserSession('shiwj')
    print 'user_sess:'
    print user_sess
    print user_sess.sid
    if not user_sess.sid:
        user_sess.setup('shiwj', 'shiwj', session_ids=['aa'])
        print user_sess.sid
        print user_sess.session_ids
    else:
        print user_sess.sid
        print user_sess.regionTree

