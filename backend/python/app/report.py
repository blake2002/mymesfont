#! /bin/env python
#-*- coding:utf-8 -*-
import json, sys, urllib
import os, base64, datetime, time
import requests
from functools import partial
from concurrent.futures import *

from tornado.gen import coroutine
from tornado.gen import Return as genReturn
from tornado.httpclient import HTTPRequest, AsyncHTTPClient

from hite.mes.comm import config
from hite.mes.comm.log import logger

from hite.mes.comm.handler import HttpClientHandler, HandlerError

REPORT_DIRS = config.report_server.get('url') + '/dirs'
REPORT_CREATE_DIR = config.report_server.get('url') + '/dir/create'
REPORT_MODIFY_DIR = config.report_server.get('url') + '/dir/edit'
REPORT_DELETE_DIR = config.report_server.get('url') + '/dir/del'
REPORT_UPLOAD_DIR = config.report_server.get('url') + '/upload'

# 配置管理平台: 报表管理目录及文件获取接口
class ReportList(HttpClientHandler):
    @coroutine
    def post(self):
        try:
            form_data = self.post_init()

            if not form_data.get('name'): form_data['name'] = '$'

            path = self.get_request_path()
            if path == 'report_dirs': flag = "0"
            elif path == 'report_designtime_list': flag = "1"
            elif path == 'report_runtime_list': flag = "2"
            else:
                raise HandlerError(self.rsp_code['params_merror'], "%s does not support"%path)

            form_data['flag'] = flag

            rsp = yield self.do_post(REPORT_DIRS, form_data)
            self.send(rsp)

        except HandlerError as e:
            self._send(e.json_msg)

# 配置管理平台: 报表新增目录
class ReportCreateDir(HttpClientHandler):
    @coroutine
    def post(self):
        try:
            self.post_init('parent', 'name')

            args = {'parent': self.parent, 'name': self.name, 'user': self.user_id}

            rsp = yield self.do_post(REPORT_CREATE_DIR, args)
            self.send(rsp)

        except HandlerError as e:
            self._send(e.json_msg)

# 配置管理平台: 报表编辑目录
class ReportModifyDir(HttpClientHandler):
    @coroutine
    def post(self):
        try:
            self.post_init('parent', 'dirId', 'name')

            args = {'parent': self.parent, 'id': self.dirId, 'name': self.name, 'user': self.user_id}

            rsp = yield self.do_post(REPORT_MODIFY_DIR, args)
            self.send(rsp)

        except HandlerError as e:
            self._send(e.json_msg)

# 配置管理平台: 报表删除目录
class ReportDeleteDir(HttpClientHandler):
    @coroutine
    def post(self):
        try:
            self.post_init('dirId')

            args = {'id': self.dirId}

            rsp = yield self.do_post(REPORT_DELETE_DIR, args)
            self.send(rsp)

        except HandlerError as e:
            self._send(e.json_msg)

# 配置管理平台: 上传报表
class UploadReport(HttpClientHandler):
    @coroutine
    def post(self):
        try:
            self.set_header('Access-Control-Allow-Origin', '*')
            self.get_require_args('path', 'dirId', 'userId')

            form_data = {'path': self.path, 'dirId': self.dirId, 'user': self.userId}
            file_metas = self.request.files['file'] #提取表单中‘name’为‘file’的文件元数据
            if not file_metas:
                raise HandlerError(self.rsp_code['params_error'], "upload file required")

            files = []
            for f in file_metas:
                fd = '/tmp/%s' % f['filename']
                with open(fd, 'w') as w: w.write(f['body'])
                files.append({'file': open(fd)})

             #TODO
            # 暂时以同步模式实现
            for f in files:
                try:
                    resp = requests.post(REPORT_UPLOAD_DIR, data=form_data, files=f)
                    if resp.status_code != 200:
                        raise HandlerError(self.rsp_code['system_error'], "upload file error")
                    # print resp.reason
                    # print resp.headers
                    # print resp.encoding
                    rsp = json.loads(resp.text.encode('ISO-8859-1'))
                finally: f['file'].close()
            self.send(rsp)

            '''
            content_type, body = self.encode_multipart_formdata(form_data, files)

            http_client = AsyncHTTPClient()
            headers = {"Content-Type": content_type, "Content-Length": str(len(body))}
            request = HTTPRequest(url=REPORT_UPLOAD_DIR, method='POST', body=body, headers=headers)

            rsp = yield http_client.fetch(request)
            self.send(self.parse_response(rsp))
            '''

        except HandlerError as e:
            self._send(e.json_msg)

    def encode_multipart_formdata(self, fields, files):
        """
        fields is a sequence of (name, value) elements for regular form fields.
        files is a sequence of (name, filename, value) elements for data to be uploaded as files
        Return (content_type, body) ready for httplib.HTTP instance
        """
        BOUNDARY = '----------ThIs_Is_tHe_bouNdaRY_$'
        CRLF = '\r\n'
        L = []
        for key, value in fields.items():
            L.append('--' + BOUNDARY)
            L.append('Content-Disposition: form-data; name="%s"' % key)
            L.append('')
            L.append(value)
        for (key, filename, value) in files:
            L.append('--' + BOUNDARY)
            L.append('Content-Disposition: form-data; name="%s"; filename="%s"' % (key, filename))
            L.append('Content-Type: %s' % self.get_content_type(filename))
            L.append('')
            L.append(value)
        L.append('--' + BOUNDARY + '--')
        L.append('')
        body = CRLF.join(L)
        content_type = 'multipart/form-data; boundary=%s' % BOUNDARY
        return content_type, body

    def get_content_type(self, filename):
        return mimetypes.guess_type(filename)[0] or 'application/octet-stream'

if __name__ == '__main__':
    f = open('/tmp/reportall2.rpt1490259900', 'r')
    ff = f.read()
    f.close()

    print urllib.quote(ff).encode('utf-8')
