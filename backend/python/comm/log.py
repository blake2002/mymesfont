#! /bin/env python
#-*- coding:utf-8 -*-
import os, sys, re
import time, platform, cPickle
import random

from os.path import *
from logging import *
from logging.handlers import DatagramHandler

from hite.mes.comm import config

if sys.platform == 'win32':
    def create_link(sSource, sTarget):
        oLink = _shell.CreateShortcut(sSource + '.lnk')
        oLink.TargetPath = sTarget
        oLink.Save()

    import  win32com.client
    _shell = win32com.client.Dispatch('WScript.shell')
    os.symlink = create_link

s = os.sep
gHost = platform.node()

class Dummy: pass

class Shelf(dict):
    def __init__(self, f):
        self.f = f
        if os.path.isfile(f):
            m = cPickle.load( open(f, 'rb') )
            dict.__init__(self, m)

    def writeback(self, m):
        f = open(self.f, 'wb')
        if not m: m = dict(self)
        cPickle.dump(m, f, -1)

class Singleton(type):
    def __init__(self, *args, **kwargs):
        type.__init__(self, *args, **kwargs)
        self.__instance = None

    def __call__(self, *args, **kwargs):
        if self.__instance is None:
            self.__instance = type.__call__(self, *args, **kwargs)
        return self.__instance

def _logger(self):
    f = time.strftime('%y-%m-log/%d-')
    if self.pLog != f:
        if self.pLog: self.remove_log()

        self.pLog = f
        f = self.pHome + f + self.sName + '.log'
        i = f.rfind('/')
        if not os.path.isdir(f[:i]): os.mkdir(f[:i])
        self.init_logger( open(f, 'a') )
    return self.oLogger

_LOG_LEVEL_DICT = {
    "DEBUG": DEBUG,
    "INFO": INFO,
    "WARN": WARN,
    "WARNING": WARN,
    "ERROR": ERROR,
    "FATAL": FATAL
}

class Global:
    __metaclass__ = Singleton
    def __init__(self, sName = '', nPort = 0):
        pPy = config.logger.get('dir')
        self.pHome = pPy + s

        log_level = config.logger.get('level')
        if not log_level: log_level = 'INFO'
        kLevel = _LOG_LEVEL_DICT.get(log_level)

        oLogger = getLogger(gHost)
        oLogger.propagate = 0
        oLogger.setLevel(kLevel)
        self.oLogger = oLogger

        self.log = self.oLogger
        if nPort:
            self.hLog = DatagramHandler(sName, nPort)
            self.log.addHandler(self.hLog)
        elif sName:
            self.sName = sName
            self.pLog = ''
            Global.log = property(_logger)
        else:
            self.init_logger()

    def remove_log(self):
        h = self.hLog
        self.oLogger.removeHandler(h)
        h.close()
        h.release()

    def init_logger(self, f = sys.stdout):
        # DEBUG, INFO, WARNING, ERROR, CRITICAL
        hLog = StreamHandler(f)
        #fmtLog = Formatter('%(asctime)s [%(name)s] %(levelname)s - %(message)s')
        fmtLog = Formatter('%(asctime)s [%(levelname)s] <%(thread)d> %(message)s')
        hLog.setFormatter(fmtLog)

        self.hLog = hLog
        self.oLogger.addHandler(hLog)

oGlobal = Global('options')
logger = oGlobal.log

if __name__ == '__main__':
    logger.info('test utils global logger!')
    print dir(oGlobal)
    print vars(oGlobal)
