import * as React from 'react';
import DeviceAdd, { AddInformation } from '../../device/device/add';
import { post, get } from '../../../components/ajax/index';
import deviceDetails from '../../device/device/_details';
import { Tabs, TabPane, Button, message } from '../../../components/antd/index';
import { DeviceData, NSDevices, DevicesTemplate } from '../../device/device/types';
import { MainLeft } from '../../_main';
import Privileges, { havePrivileges } from '../../../components/privileges/index';
export let privileges = '/department/users/add';
export default class Com extends DeviceAdd {

    title = '人员属性'
    treeType: any = 'department_tree'
    returnUrl = '/department/members/index'

    async ajaxSave() {
        let newData: NSDevices[] = (this.refs['AddInformation'] as any).getData();
        let {data} = await post({
            url: '/new_user',
            data: {
                departmentId: this.props.query.regionId || 125,
                props: { NSUsers: newData }
            }
        });

        message.success('新增成功！')
        this.props.jump(this.props.url, this.props.query);
    }

    tabBarExtraContentRender() {
        return <section className='device-add-menu'>
            <Button privileges='/department/users/add:save'
                className='ml20' type='primary' onClick={this.ajaxSave.bind(this)}>创建</Button>
        </section>;
    }

    renderMainLeft() {
        return <MainLeft disabled={true}
            type='member'
            treeType={this.treeType}
            regionId={this.props.query['regionId']}></MainLeft>
    }


    AddInformationRender() {
        return <MembersAddInformation ref='AddInformation' />;
    }
}


class MembersAddInformation extends AddInformation {
    templateUrl = '/user_template'
    key = 'NSUsersTemplate'

}


