#! /bin/env python
#-*- coding:utf-8 -*-
import os, sys
import re, struct, json
import time
import getopt

from tornado.ioloop import IOLoop
from tornado.web import Application, url, RequestHandler

from hite.mes.comm.service import start_thread
from hite.mes.comm import config

class HiteApplication(Application):
    def __init__(self):
        self.oMsgPool = Message()

        settings = {
            "cookie_secret": config.cookie.get('secret'),
            #"login_url": "/login.html",
            #"xsrf_cookies": True,
            #"static_path": config.usr_dir
        }

        m = {'oMsgPool': self.oMsgPool}

        prefix = r'/%s' %  config.prefix_api
        print 'app prefix: '+prefix
        handlers = [
            (r'%s/test_api' % prefix, comm.TestApi, m),
            (r'%s/my_token' % prefix, auth.Token, m),
            (r'%s/login' % prefix, auth.Login, m),
            (r'%s/logout' % prefix, auth.Logout, m),
            (r'%s/roles' % prefix, auth.Roles, m),
            (r'%s/privileges' % prefix, auth.Privileges, m),
            (r'%s/dict_options' % prefix, comm.DictOptions, m),
            (r'%s/search_region_tree' % prefix, tree.SearchRegionTree, m),
            (r'%s/region_tree' % prefix, tree.RegionTree, m),
            (r'%s/region_children' % prefix, tree.RegionChildren, m),
            (r'%s/region_tree_options' % prefix, tree.RegionTreeOptions, m),
            (r'%s/region_tree_forefather' % prefix, tree.RegionTreeForefather, m),
            (r'%s/search_department_tree' % prefix, tree.SearchDepartmentTree, m),
            (r'%s/department_tree' % prefix, tree.DepartmentTree, m),
            (r'%s/department_children' % prefix, tree.DepartmentChildren, m),
            (r'%s/department_tree_forefather' % prefix, tree.DepartmentTreeForefather, m),
            (r'%s/member_list' % prefix, user.MemberListFromRegionTree, m),
            (r'%s/member_count' % prefix, user.MemberCountFromRegionTree, m),
            (r'%s/member_belongs' % prefix, user.MemberBelongsFromRegionTree, m),
            (r'%s/member_detail' % prefix, user.MemberDetailFromRegionTree, m),
            (r'%s/concern_member' % prefix, user.ConcernMemberFromRegionTree, m),
            (r'%s/unconcern_member' % prefix, user.UnTagMemberFromRegionTree, m),
            (r'%s/tag_member' % prefix, user.TagMemberFromRegionTree, m),
            (r'%s/untag_member' % prefix, user.UnTagMemberFromRegionTree, m),
            (r'%s/user_template' % prefix, user.UserTemplate, m),
            (r'%s/user_list' % prefix, user.UserListFromDepartmentTree, m),
            (r'%s/user_count' % prefix, user.UserCountFromDepartmentTree, m),
            (r'%s/user_belongs' % prefix, user.UserBelongsFromDepartmentTree, m),
            (r'%s/user_detail' % prefix, user.UserDetailFromDepartmentTree, m),
            (r'%s/new_user' % prefix, user.AddNewUserToDepartmentTree, m),
            (r'%s/modified_user' % prefix, user.ModifyUserFromDepartmentTree, m),
            (r'%s/delete_user' % prefix, user.DeleteUserFromDepartmentTree, m),
            (r'%s/device_list' % prefix, device.DeviceListFromRegionTree, m),
            (r'%s/device_detail' % prefix, device.DeviceDetailFromRegionTree, m),
            (r'%s/device_count' % prefix, device.DeviceCountFromRegionTree, m),
            (r'%s/device_belongs' % prefix, device.DeviceBelongsFromRegionTree, m),
            (r'%s/device_attribute' % prefix, device.DeviceAttribute, m),
            (r'%s/device_ui' % prefix, device.DeviceAttribute, m),
            (r'%s/device_driver_config' % prefix, device.DeviceDriverConfig, m),
            (r'%s/device_template' % prefix, device.DeviceTemplate, m),
            (r'%s/check_driver_com_port' % prefix, device.CheckDriverDomPort, m),
            (r'%s/new_device' % prefix, device.AddNewDeviceToRegionTree, m),
            (r'%s/modified_device' % prefix, device.ModifyDeviceFromRegionTree, m),
            (r'%s/delete_device' % prefix, device.DeleteDeviceFromRegionTree, m),
            (r'%s/move_device' % prefix, device.MoveDeviceFromRegionTree, m),
            (r'%s/concern_device' % prefix, device.ConcernDeviceFromRegionTree, m),
            (r'%s/unconcern_device' % prefix, device.UnTagDeviceFromRegionTree, m),
            (r'%s/tag_device' % prefix, device.TagDeviceFromRegionTree, m),
            (r'%s/untag_device' % prefix, device.UnTagDeviceFromRegionTree, m),
            (r'%s/new_device_driver' % prefix, driver.AddNewDeviceDriver, m),
            (r'%s/modified_device_driver' % prefix, driver.ModifyDeviceDriver, m),
            (r'%s/delete_device_driver' % prefix, driver.DeleteDeviceDriver, m),
            (r'%s/menu_list' % prefix, sysmenu.MenuList, m),
            (r'%s/new_menu' % prefix, sysmenu.NewMenu, m),
            (r'%s/modified_menu' % prefix, sysmenu.ModifiedMenu, m),
            (r'%s/delete_menu' % prefix, sysmenu.DeleteMenu, m),
            (r'%s/tag_list' % prefix, tag.TagList, m),
            (r'%s/new_tag' % prefix, tag.NewTag, m),
            (r'%s/modified_tag' % prefix, tag.ModifiedTag, m),
            (r'%s/delete_tag' % prefix, tag.DeleteTag, m),
            (r'%s/tag_device_list' % prefix, tag.TagTargetList, m),
            (r'%s/tag_member_list' % prefix, tag.TagTargetList, m),
            (r'%s/new_device_attribute' % prefix, model.NewModelItem, m),
            (r'%s/modified_device_attribute' % prefix, model.ModifyModelItem, m),
            (r'%s/delete_device_attribute' % prefix, model.DeleteModelItem, m),
            (r'%s/sys/role_list' % prefix, role.RoleList, m),
            (r'%s/sys/role_list_template' % prefix, role.RoleTemplate, m),
            (r'%s/sys/role_template' % prefix, role.RoleTemplate, m),
            (r'%s/sys/role_detail' % prefix, role.RoleDetail, m),
            (r'%s/sys/add_role' % prefix, role.NewRole, m),
            (r'%s/sys/modified_role' % prefix, role.ModifyRole, m),
            (r'%s/sys/delete_role' % prefix, role.DeleteRole, m),
            (r'%s/sys/role_auth_for_menu' % prefix, role.RoleMenuAuth, m),
            (r'%s/sys/dict_list' % prefix, comm.DictList, m),
            (r'%s/sys/dict_template' % prefix, comm.DictTemplate, m),
            (r'%s/sys/new_dict' % prefix, comm.AddDict, m),
            (r'%s/sys/modified_dict' % prefix, comm.ModifyDict, m),
            (r'%s/sys/delete_dict' % prefix, comm.DeleteDict, m),
            (r'%s/system_model_list' % prefix, model.ModelList, m),
            (r'%s/custom_model_list' % prefix, model.ModelList, m),
            (r'%s/model_template' % prefix, model.ModelTemplate, m),
            (r'%s/model_detail' % prefix, model.ModelDetail, m),
            (r'%s/new_model' % prefix, model.NewModel, m),
            (r'%s/modify_model' % prefix, model.ModifyModel, m),
            (r'%s/delete_model' % prefix, model.DeleteModel, m),
            (r'%s/publish_model' % prefix, model.PublishModel, m),
            (r'%s/model_node_detail' % prefix, model.ModelNodeDetail, m),
            (r'%s/new_model_node' % prefix, model.NewModelNode, m),
            (r'%s/modify_model_node' % prefix, model.ModifyModelNode, m),
            (r'%s/model_related_node_options' % prefix, model.ModelRelatedNodeOptions, m),
            (r'%s/delete_model_node' % prefix, model.DeleteModelNode, m),
            (r'%s/model_nodeindex' % prefix, model.ModelNodeIndex, m),
            (r'%s/upsert_model_nodeindex' % prefix, model.UpsertModelNodeIndex, m),
            (r'%s/model_nodeindex_property' % prefix, model.ModelNodeIndexProperty, m),
            (r'%s/model_node_property' % prefix, model.ModelNodeProperty, m),
            (r'%s/upsert_model_node_property' % prefix, model.UpsertModelNodeProperty, m),
            (r'%s/system_model_node_template' % prefix, model.ModelTemplate, m),
            (r'%s/custom_model_node_template' % prefix, model.ModelTemplate, m),
            (r'%s/model_property_template' % prefix, model.ModelTemplate, m),
            (r'%s/model_nodeindex_template' % prefix, model.ModelTemplate, m),
            (r'%s/model_cluster_state_list' % prefix, model.ModelClusterStateList, m),
            (r'%s/model_cluster_node_state' % prefix, model.ModelClusterNodeState, m),
            (r'%s/model_cluster_state_template' % prefix, model.ModelClusterTemplate, m),
            (r'%s/model_cluster_node_state_template' % prefix, model.ModelClusterTemplate, m),
            (r'%s/report_dirs' % prefix, report.ReportList, m),
            (r'%s/report_designtime_list' % prefix, report.ReportList, m),
            (r'%s/report_runtime_list' % prefix, report.ReportList, m),
            (r'%s/report_create_dir' % prefix, report.ReportCreateDir, m),
            (r'%s/report_modify_dir' % prefix, report.ReportModifyDir, m),
            (r'%s/report_delete_dir' % prefix, report.ReportDeleteDir, m),
            (r'%s/report_upload' % prefix, report.UploadReport, m),
        ]
        sse_handlers = [
            (r'%s/events' % prefix, event.Event, m),
        ]
        handlers.extend(sse_handlers)

        Application.__init__(self, handlers, **settings)

        auth_consumer = consumer.AuthConsumer(self.oMsgPool)
        auth_consumer.setDaemon(True)
        auth_consumer.start()

        dm_consumer = consumer.DMConsumer(self.oMsgPool)
        dm_consumer.setDaemon(True)
        dm_consumer.start()

#        wf_consumer = consumer.WFConsumer(self.oMsgPool)
#        wf_consumer.setDaemon(True)
#        wf_consumer.start()

#        rtd_consumer = consumer.RTDataConsumer(self.oMsgPool)
#        rtd_consumer.setDaemon(True)
#        rtd_consumer.start()
#
#        alarm_consumer = consumer.AlarmConsumer(self.oMsgPool)
#        alarm_consumer.setDaemon(True)
#        alarm_consumer.start()
#
#        #start_thread(check_oMsgPool_Timeout, (self.oMsgPool,))
        start_thread(MessageTimeout, (self.oMsgPool,))

def main():
    logger.info('Main Start...')

    app = HiteApplication()
    print 'listen: %s' % config.node.get('manager_port')
    app.listen(config.node.get('manager_port'))

    IOLoop.instance().start()

if __name__ == '__main__':
    # pip install tornado futures
    # https://pypi.python.org/pypi/MySQL-python/1.2.5

    print 'start ... '
    reload(sys)
    sys.setdefaultencoding('utf-8')

    conf = prefix_api = mq_selector = None
    if len(sys.argv) > 1:
        try:
            opts, args = getopt.getopt(sys.argv[1:], '', ['conf=', 'prefix=', 'selector='])
        except getopt.GetoptError, err:
            print str(err)
            usage()
            sys.exit(2)

        for opt, val in opts:
            if opt == '--conf': conf = val
            if opt == '--prefix': prefix_api = val
            if opt == '--selector': mq_selector = val

    if conf is not None: config.load(conf)
    else: config.load()

    if prefix_api is not None: config.prefix_api = prefix_api
    if mq_selector is not None: config.mq_selector = mq_selector+str(int(time.time()))

    from hite.mes.comm import consumer
    from hite.mes.comm.log import logger
    from hite.mes.comm.message import *

    from hite.mes.comm import handler
    from hite.mes.app import auth, event, device, user, tree, comm, sysmenu, driver, model, role, tag, report

    main()
