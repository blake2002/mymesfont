#! /bin/env python
#-*- coding:utf-8 -*-
import sys, json, time
import ConfigParser

DEFAULT_CONFIG_FILE = '/etc/hite/mes/config'

def load(filename=DEFAULT_CONFIG_FILE):
    data = globals()
    parser = ConfigParser.ConfigParser()
    parser.read(filename)

    section_list = parser.sections()

    for sect in section_list:
        kvs = parser.options(sect)
        data[sect] = dict(parser.items(sect))

    node = dict(parser.items('node'))
    data['master_url'] = 'http://%s:%d/' % (node.get('master'), int(node.get('port')))

    if 'white_list' in data:
        white_list = dict(data['white_list'])
        data['white_list'] = white_list.get('usrs').rstrip(',').split(',')

    data['mq_selector'] = 'mes%d' % int(time.time())

    data['prefix_api'] = 'mes_manager_api'

if __name__ == '__main__':
    import json
    print 'master_url:' + master_url
    print 'rc_config:'
    print json.dumps(rc_config, indent=1)
    print 'mq_config:'
    print json.dumps(mq, indent=1)
    print 'white_list:'
    print json.dumps(white_list, indent=1)
    print 'manager_port'
    print node.get('manager_port')
    print 'mq_selector:'
    print mq_selector
