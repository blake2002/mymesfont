#! /bin/env python
#-*- coding:utf-8 -*-
import re
import time, datetime
import random
import json, hashlib

from uuid import uuid4

from hite.mes.comm import config

KEY = 'TRANSFORMERS_OPTIMUSPRIME'

FROM_MOBILE_CLIENT = '00'
FROM_PC_CLIENT = '01'
FROM_MOBILE_WEB_CLIENT = '02'

def sign(data):
    if type(data) == dict: cont = json.dumps(data)
    else: cont = data

    m = hashlib.md5()
    m.update(cont + KEY)
    return m.hexdigest().upper()

def random_str(length, nd=0, nl=0, nu=0, no=0):
    sd = '23456789'
    sl = 'abcdefghijkmnpqrstuvwxyz'
    su = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
#so = '!@#$%^*()~-_=+[{]};:,./|<>'
    so = '^&*()_' # HP-UX supports only these

    sx,nx = '',length
    if nd >= 0: sx += sd; nx -= nd
    if nl >= 0: sx += sl; nx -= nl
    if nu >= 0: sx += su; nx -= nu
    if no >= 0: sx += so; nx -= no

    s = []
    random.seed()
    for i in range(nd): s.append(random.choice(sd))
    for i in range(nl): s.append(random.choice(sl))
    for i in range(nu): s.append(random.choice(su))
    for i in range(no): s.append(random.choice(so))
    for i in range(nx): s.append(random.choice(sx))
    random.shuffle(s)

    return ''.join(s)[:length]

def crypt_mobile(s):
    pattern = re.compile(r'\d')
    match = pattern.match(s)

    if match and len(s) >= 11:
        return s[:3] + '****' + s[7:]
    else: return s

def callback_send(sess_id, key):
    return key == sess_id

def split_msg(word, count, total=True):
    msg_list = []

    j = 0
    while (j < len(word)):
        i = 0
        content = ''
        msg = word[j:]
        while (i < count):
            m = msg[i:i+1]
            if not m: break
            if ord(m) > 0x81: # gbk
                content = content + msg[i:i+2]
                i = i + 2
            else:
                content = content + msg[i:i+1]
                i = i + 1
        if content:
            msg_list.append(content)
            if not total: break
        j = j + len(content)
    return msg_list

def gen_unique_id():
    return str(uuid4())

# 将字符串转换为日期格式
def format_str2timestamp(d, f):
    return datetime.datetime.strptime(d, f)

# 将日期格式转换为字符串
def format_timestamp2str(d, f):
    return d.strftime(f);

def gen_unique_sn():
    dt = str(time.mktime(datetime.datetime.now().timetuple()))
    dt = dt.split('.')[0]
    return '%s%s' % (dt, random_str(6, 6))

def json_print(str, ident=1):
    print json.dumps(str, ident=ident)

if __name__ == '__main__':
    # logger.info('test utils global logger!')
    # print dir(oGlobal)
    # print vars(oGlobal)

    print crypt_pw('111111')
    #print crypt_mobile('13611911577')
    #s = u'n的中文处理还是比较麻烦的，utf-8的字符串的长度是1-6个字符，一不小心就会从中截断，出现所谓的乱码。下面这个函数提供了，从一段utf-8编码的字符串中，截取固定长度的字串。ord(char)将字符转换称整数，根据utf-8的编码规则，确定每个utf-8的字占用几个字符，从而避免截断的情况。'
    #s_gbk = s.encode('gbk')
    #l = split_msg(s_gbk, 20, False)
    #print l[0].decode('gbk')

    print sign({'test': 'hello'})



