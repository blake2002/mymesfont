#! /bin/env python
#-*- coding:utf-8 -*-
import sys, json
from redis import StrictRedis
from hite.mes.comm import config

rc = None

def get_redis(make_default=True):
    global rc
    if make_default and rc: return rc

    if not config.rc_config: config.load()

    kwargs = {
        'db': int(config.rc_config.get('db')),
        'host': config.rc_config.get('host'),
        'port': int(config.rc_config.get('port'))}
    rc = StrictRedis(**kwargs)
    if make_default:
        G = globals()
        G['rc'] = rc
    return rc

rc = get_redis()

def redis_clear(redis_conn=None, keys=None):
    if not redis_conn: redis_conn = get_redis()
    if keys is None: keys = redis_conn.keys()

    pipe = redis_conn.pipeline()
    for k in keys: pipe.delete(k)
    pipe.execute()

def hset(name, kwargs, timeout=None):
    redis_conn = get_redis()
    pipe = redis_conn.pipeline()

    for k,v in kwargs.items():
        pipe.hset(name, k, v)

    if timeout: pipe.expire(name, timeout)
    pipe.execute()

def hget(name):
    redis_conn = get_redis()

    v = redis_conn.hgetall(name)
    return v

def hget_item(name, key):
    redis_conn = get_redis()

    v = redis_conn.hget(name, key)
    return v

def hdel(name):
    redis_conn = get_redis()
    pipe = redis_conn.pipeline()

    pipe.delete(name)
    pipe.execute()

def sadd(name, datas, timeout=None):
    redis_conn = get_redis()
    pipe = redis_conn.pipeline()

    for d in datas:
        pipe.sadd(name, d)

    if timeout: pipe.expire(name, timeout)
    pipe.execute()

def sget(name):
    redis_conn = get_redis()
    return redis_conn.smembers(name)

def srem(name, value):
    redis_conn = get_redis()
    pipe = redis_conn.pipeline()

    pipe.srem(name, value)
    pipe.execute()

def spop(name):
    redis_conn = get_redis()

    return redis_conn.spop(name)

def ladd(name, datas, timeout=None):
    redis_conn = get_redis()
    pipe = redis_conn.pipeline()

    if isinstance(datas, list):
        for d in datas:
            pipe.rpush(name, d)
    else: pipe.rpush(name, datas)

    if timeout: pipe.expire(name, timeout)
    pipe.execute()

def lget(name):
    redis_conn = get_redis()

    return redis_conn.lrange(name, 0 , -1)

def llen(name):
    redis_conn = get_redis()

    return redis_conn.llen(name)

def lpop(name):
    redis_conn = get_redis()

    return redis_conn.lpop(name)

def blpop(name): # block the redis connection until push datas to the key(=name)
    redis_conn = get_redis()

    return redis_conn.blpop(name)

def set(key, value, redis_conn=None, timeout=None):
    if not redis_conn: redis_conn = get_redis()

    pipe = redis_conn.pipeline()
    M = {key: value}
    pipe.mset(M)

    if timeout: pipe.expire(key, timeout)

    pipe.execute()

def list_keys(key, prefix=True, redis_conn=None):
    if not redis_conn: redis_conn = get_redis()

    if prefix: key = key + '*'
    else: key = '*' + key

    return redis_conn.keys(key)

def set_multi(D, redis_conn=None, key_prefix=None, timeout=None):
    if not redis_conn: redis_conn = get_redis()

    pipe = redis_conn.pipeline()
    if key_prefix:
        M = {}
        for k,v in D.items(): M[key_prefix+k] = v
    else: M = D

    pipe.mset(M)

    if timeout:
        for k in M.keys(): pipe.expire(k, timeout)
    pipe.execute()

def get_multi(key_l, redis_conn=None, key_prefix=None):
    if not redis_conn: redis_conn = get_redis()

    keys = []
    if key_prefix: keys = [key_prefix + k for k in key_l]
    else: keys = key_l
    return redis_conn.mget(keys)

def delete_multi(key_l, redis_conn=None, key_prefix=None):
    if not redis_conn: redis_conn = get_redis()

    for k in key_l:
        if key_prefix: k = key_prefix + k
        redis_conn.delete(k)

if __name__ == '__main__': pass
