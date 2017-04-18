#! /bin/env python
#-*- coding:utf-8 -*-
import sys, json, struct
import urlparse, time
import hashlib

from concurrent.futures import * # backport from python 3.2
from tornado.web import RequestHandler
from tornado.gen import coroutine
from tornado.gen import Return as genReturn
from tornado.httpclient import HTTPRequest, AsyncHTTPClient
from urllib import unquote, urlencode


from hite.mes.comm.log import logger
from hite.mes.comm.websess import UserSession, CONNECTOR

from hite.mes.comm.producer import *

json.encoder.FLOAT_REPR = lambda o: format(o, '.6f')

CODE = {
    'success'                : '0',     # 操作成功
    'system_error'           : 'ax100', # 后台服务报错
    'nothing'                : 'ax101', # 无操作
    'params_error'           : 'ax102', # 参数错误，少传或漏传参
    'request_timeout'        : 'ax103', # 请求超时
    'id_exists'              : 'ax104', # 索引字段重复
    'session_error'          : 'ax105', # session失效
    'token_error'            : 'ax106', # token失效
}

class HandlerError(Exception):
    def __init__(self, code, value):
        self.code = code
        self.value = value
        print 'HandlerError occurred, method: get, value:', self.value

    def __str__(self):
        return repr(self.value)

    def _json_msg(self):
        return {'code': self.code, 'comment': self.value}

    @property
    def json_msg(self):
        return json.dumps(self._json_msg())

class BaseHandler(RequestHandler):
    SUCCESS = 0

    def initialize(self, oMsgPool):
        self.oMsgPool = oMsgPool
        self.id = None

        self.user_id = None
        self.token = None

        self.rsp_code = CODE
        self.user_session = None

        self.response_data = None

    # type: str, int, bool, float, unquote
    def _get_arg(self, name, t=None):
        try:
            arg = self.get_argument(name)
            if t is None: return arg
            return eval('%s(\'%s\')' % (t, arg))
        except Exception, e:
            print e
            logger.error('%s %s (%s) %s' % (self.request.method, self.request.uri, self.get_remote_ip(), e))
            raise HandlerError(self.rsp_code['params_error'], '缺少%s参数' % name)

    # Get请求，获取全部参数
    def get_require_args(self, *args, **kwargs):
        for k in args: setattr(self, k, self._get_arg(k, 'str'))
        for n,t in kwargs.items(): setattr(self, n, self._get_arg(n, t))

    # Post请求，获取全部参数
    def get_form_data(self):
        form_data = json.loads(self.request.body)
        for n,v in form_data.items(): setattr(self, n, v)

        return form_data

    # 验证参数有效性，由子类实现
    def validate(self): pass

    # 验证必填参数
    def _require_validate(self, *args):
        try:
            for a in args: getattr(self, a)
        except AttributeError, e:
            raise HandlerError(self.rsp_code['params_error'], '缺少%s参数' % a)

    # 检查用户session有效
    def check_current_user(self):
        sessToken = self.token.split('_')

        # check user_session
        self.user_session = UserSession(self.user_id, sessToken[0])
        if not self.user_session.load():
            raise HandlerError(self.rsp_code['session_error'], '用户session失效, 请重新登陆')

        # check token
        token = self.gen_token(self.user_session.remoteIP, self.user_session.clientAgent)
        if token != sessToken[0]:
            raise HandlerError(self.rsp_code['session_error'], '用户session失效, 请重新登陆')

        # check token time out
#        now = int(time.time())
#        diffTime = now - int(sessToken[1])
#        # token 超时时间为5分钟
#        if diffTime > 300:
#            raise HandlerError(self.rsp_code['token_error'], 'token error')

    # 获取用户Ip地址
    def get_remote_ip(self):
        return self.request.headers.get('X-Real-Ip', self.request.remote_ip)

    # 获取用户请求url地址
    def get_request_path(self):
        p = urlparse.urlparse(self.request.uri).path
        return p[p.rindex('/')+1:]

    # 解析用户请求url
    def parse_url(self, params):
        url = ''
        for k, v in params.items(): url += k + '=' + str(v) + '&'

        return url

    # 解析用户客户端信息
    def parse_user_agent(self):
        return self.request.headers.get('User-Agent', 'no-agent-info')

    def parse_response(self, oMsg, callback=None):
        if oMsg is None:
            raise HandlerError(self.rsp_code['request_timeout'], 'Request timeout')

        try: result_code = oMsg.pop('Result')
        except KeyError:
            raise HandlerError(self.rsp_code['system_error'], 'Error json')

        if result_code != self.SUCCESS:
            print 'error consumer body:'
            print json.dumps(oMsg, indent=1)
            logger.error('%s %s (%s)' % (self.request.method, self.request.uri, self.get_remote_ip()))
            if result_code == 2:
                raise HandlerError(self.rsp_code['id_exists'], '索引字段重复')
            else:
                raise HandlerError(self.rsp_code['system_error'], oMsg['Comment'])

        if callback is not None: oMsg = callback(oMsg)

        return oMsg

    def options(self):
        request_headers = self.request.headers.get('Access-Control-Request-Headers')
        self.set_header('Access-Control-Allow-Origin', '*')
        self.set_header('Access-Control-Allow-Methods', 'GET, POST')
        self.set_header('Access-Control-Allow-Headers', request_headers)
        self.send(self.SUCCESS)

    def _send(self, data):
        self.write(data)
        self.flush()
        self.finish()

    def gen_token(self, remote_ip, user_agent):
        def md5(s):
            hash_md5 = hashlib.md5(s)
            return hash_md5.hexdigest()

        token = (self.user_id, remote_ip, user_agent)
        token = CONNECTOR.join(token)
        return md5(token)

class HiteHandler(BaseHandler):

    def get_init(self, *args, **kwargs):
        self.set_header('Access-Control-Allow-Origin', '*')

        self.user_id = self._get_arg('userId', 'str')
        self.token = self._get_arg('token', 'str')
        self.check_current_user()

        self.get_require_args(*args, **kwargs)
        self.validate()

        self.id = self.oMsgPool.add(self.user_id, client=self.parse_user_agent())

        return True

    def post_init(self, *args):
        self.set_header('Access-Control-Allow-Origin', '*')

        self.get_form_data()
        self.user_id = self.userId

        self.check_current_user()

        self._require_validate(*args)
        self.validate()

        self.id = self.oMsgPool.add(self.user_id, client=self.parse_user_agent())

        return True

    @coroutine
    def genResult(self, mq_name, msg, callback=None):

        if self.user_session is None: session_id = self.user_id
        else: session_id = self.user_session.sid

        eval("%s_producer(msg, session_id, self.id)" % mq_name)
        oMsg = yield self.oMsgPool.wait(self.id)
        self.oMsgPool.pop(self.id)

        raise genReturn(self.parse_response(oMsg, callback))

    def send(self, code, data=None, error_comment=None):
        aOut = {'code': code}

        if data is not None: aOut['data'] = data
        if error_comment: aOut['comment'] = error_comment

        self._send(json.dumps(aOut))

    def on_finish(self):
        self.oMsgPool.close(self.id)

class HttpClientHandler(BaseHandler):

    def get_init(self, *args, **kwargs):
        self.set_header('Access-Control-Allow-Origin', '*')

        self.user_id = self._get_arg('userId', 'str')
        self.token = self._get_arg('token', 'str')
        self.check_current_user()

        self.get_require_args(*args, **kwargs)
        self.validate()

    def post_init(self, *args):
        self.set_header('Access-Control-Allow-Origin', '*')

        form_data = self.get_form_data()
        self.user_id = self.userId

        self.check_current_user()

        self._require_validate(*args)
        self.validate()

        return form_data

    def parse_params(self, params):
        p = ''
        for k,v in params.items(): p += k + '=' + str(v) + '&'

        return p[:-1]

    def parse_response(self, response):
        if response.error:
            print '<!!!!! %d %s !!!!!>' % (response.code, response.error.strerror)
            logger.error('%s ( %d %s )' % (self.request_url, response.code, response.error.strerror))
            raise HandlerError(self.rsp_code['system_error'], response.error.strerror)
        rsp = json.loads(response.body)
        if rsp['code'] != self.SUCCESS:
            raise HandlerError(self.rsp_code['params_error'], rsp['data'])

        return rsp

    @coroutine
    def do_get(self, request_url, args=None):
        if args:
            request_url = request_url + '?' + self.parse_params(args)

        http_client = AsyncHTTPClient()
        request = HTTPRequest(url=request_url, method='GET')

        rsp = yield http_client.fetch(request)

        raise genReturn(self.parse_response(rsp))

    @coroutine
    def do_post(self, request_url, request_body):
        print 'httpclient post: %s' % request_url
        print request_body
        http_client = AsyncHTTPClient()

        args = json.dumps(request_body)
        request = HTTPRequest(url=request_url, method='POST', body=args, headers={"Content-Type": "application/json", "Content-Length": len(args)})

        rsp = yield http_client.fetch(request)

        raise genReturn(self.parse_response(rsp))

    def send(self, data):
        self._send(json.dumps(data))

class SSEHandler(HiteHandler):
    user_session = None
    hardware_id = None

    def get_arg(self, name, type='str'):
        try: return self._get_arg(name, type)
        except Exception, e:
            logger.error('%s %s (%s) %s' % (self.request.method, self.request.uri, self.get_remote_ip(), e))
            last_event_id = self.request.headers.get('Last-Event-ID')
            self.send(last_event_id, json.dumps({'code': CODE['params_error']}))

    @coroutine
    def get(self):
        SSE_HEADERS = (
            ('Content-Type','text/event-stream; charset=utf-8'),
            ('Cache-Control','no-cache'),
            ('Access-Control-Allow-Origin', '*'),
            ('Access-Control-Allow-Credentials', 'true'),
            ('Connection', 'keep-alive'))
        for name, value in SSE_HEADERS:
            self.set_header(name, value)

        oMsgPool = self.oMsgPool

        self.id = id = self.first()
        if self.id is None: return

        self.set_header('Last-Event-ID', id)
        logger.info('SSE [%s] %s New incoming' % (self.id, self.get_remote_ip()))

        self.flush()
        while 1:
            oMsg = yield oMsgPool.wait(id)
            oMsgPool.pop(id)
            if oMsg is None: break
            oMsg = self.parse_msg(oMsg)
            self.send(id, oMsg)
            self.flush()

    def first(self): pass

    def parse_msg(self, msg):
        if not isinstance(msg, dict): msg = json.loads(msg)
        return msg

    def send(self, id, oMsg):
        self.write('retry: 10000\n')
        if id is None: id = ''
        self.write('id:' + id + '\ndata:')
        json.dump(oMsg, self, sort_keys=True, separators=(',', ':') )
        self.write('\n\n')

    def on_connection_close(self):
        self.oMsgPool.close(self.id)
        logger.info('SSE [%s] %s closed' % (self.id, self.get_remote_ip()))

    def on_finish(self):
        logger.info('SSE [%s] %s finish' % (self.id, self.get_remote_ip()))
