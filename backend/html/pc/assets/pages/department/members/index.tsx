import * as React from 'react';
import DeviceCom from '../../device/device/index';
import { post, get } from '../../../components/ajax/index';
import deviceDetails from '../../device/device/_details';
import { DeviceDataOperation, objectToArray } from '../../../components/template-input/index';
import {
    Table, Modal, InputSearch, message, Tabs, TabPane, Button, Menu, Dropdown
} from '../../../components/antd/index';
import { Link } from 'react-router';
import { MainLeft, MainRightTitle } from '../../_main';
import { SelectMember } from '../../device/device/add/_variable';

import Privileges, { havePrivileges } from '../../../components/privileges/index';
export let privileges = '/department/users';


class Details extends deviceDetails {
    treeTitle = '组织架构'
    ignoreList = ['Name', 'UserID']
    treeType = 'department_tree'


    menu = <Menu onClick={this.menuClick.bind(this)}>
        {
            havePrivileges('/department/users:move') &&
            <Menu.Item key='move'>
                移动
        </Menu.Item>
        }
        {
            havePrivileges('/department/users:delete') &&
            <Menu.Item key='delete'>
                删除
        </Menu.Item>
        }
    </Menu>

    renderTitle() {
        return <h4>
            <p>{this.getValue('Name')}</p>
            <p>{this.getValue('UserID')}</p>
        </h4>;
    }

    renderRegion() {
        return '';
    }

    async ajaxMoveDevice(idArray) {

        await post('/user_belongs', {
            operate: 'append',
            deptUserIds: idArray,
            departmentId: this.state.treeSelectId
        });
        await post('/user_belongs', {
            operate: 'remove',
            deptUserIds: idArray,
            departmentId: this.props.regionId
        });

        this.props.onChange();
        message.success('移动成功！');
    }


    async ajaxDelete() {
        await post('/delete_user', {
            deptUserIds: [this.props.id]
        });
        this.props.onChange();
        message.success('删除成功！')
    }

    async ajaxUpdate() {
        let { data } = await post('/modified_user', {
            deptUserId: this.props.id,
            props: {
                NSUsers: this.deviceDataOperation.getUpdate()
            }
        });
        this.props.onChange();
        message.success('修改成功！')
    }

    renderFooter() {
        let { props, state } = this;
        return <section className='component-slip-footer'>
            {
                (this.getValue('Top') === '0') || (this.getValue('Top') == null) ?
                    <Button onClick={() => this.topChange('1')}>置顶</Button> :
                    <Button onClick={() => this.topChange('0')}>取消置顶</Button>
            }

            <Privileges value='/department/users:modify'>
                <Link to={{
                    pathname: '/department/members/update',
                    query: { ...props.query, deptUserId: props.id }
                }} ><Button>修改</Button></Link>
            </Privileges>
            {this.getValue('Enable') === 'true' ?
                <Button privileges='/department/users:enable'
                    onClick={() => this.enableChange(false)}>禁用</Button> :
                <Button privileges='/department/users:enable'
                    onClick={() => this.enableChange(true)}>启动</Button>}

            <Dropdown overlay={this.menu}><Button>更多</Button></Dropdown>
        </section>;
    }



    async getData() {
        let { data } = await get('/user_detail', {
            deptUserId: this.props.id
        });
        data.NSUsers = objectToArray(data.NSUsers);

        this.state.data.NSDevices = data.NSUsers;


        this.state.data.NSDevicesTemplate = data.NSUsersTemplate;
        this.deviceDataOperation = new DeviceDataOperation(
            'NSDevices', this.props.id, this.state.data.NSDevices,
            this.state.data.NSDevicesTemplate.Props);

        this.setState(this.state);
    }


}


export default class Com extends DeviceCom {
    columns = [{
        width: '150px',
        title: '用户编号',
        dataIndex: 'UserID',
        key: '1'
    }, {
        width: '150px',
        title: '姓名',
        dataIndex: 'Name',
        key: '2'
    }, {
        width: '200px',
        title: '手机',
        dataIndex: 'Tel',
        key: '3'
    }, {
        width: '200px',
        title: '邮箱',
        dataIndex: 'Email',
        key: '4'
    }, {
        width: '200px',
        title: '微信',
        dataIndex: 'WeixinID',
        key: '5'
    }, {
        title: '上次登录时间',
        dataIndex: 'GpsTimeStamp',
        key: '6'
    }, {
        width: '100px',
        title: '启用/禁用',
        dataIndex: 'Enable',
        key: '7',
        render: this.columnsRender.bind(this)
    }]

    addUrl = '/department/members/add'
    title = '人员'
    ajaxGetUrl = '/user_list'
    treeType: any = 'department_tree'

    async ajaxGet() {
        let { props } = this;
        let regionId = await this.getRegionId();
        let { data } = await get(this.ajaxGetUrl, Object.assign({
            departmentId: regionId,
            pageIndex: props.query.current || 1,
            pageSize: this.state.pageSize,
            cateFilter: props.query.cateFilter || 'all'
        }, {}));
        return data;
    }

    titleRender() {
        let { state } = this;
        let titleText = `全部${this.title}(${state.count.all})`;

        if (this.props.query.cateFilter === 'concerned') {
            titleText = `已关注(${state.count.concerned})`;
        }

        if (this.props.query.cateFilter === 'disabled') {
            titleText = `禁用(${state.count.disabled})`;
        }


        return <MainRightTitle title={this.state.title}
            text={titleText}
            menu={this.menuRender()} >
            {
                this.titleAddRender()
            }
        </MainRightTitle >
    }

    onOk(data: {
        [key: string]: string,
    }[]) {
        this.ajaxAdd(data.map(value => value['UserID']));
    }

    async ajaxAdd(idArray) {
        await post('/user_belongs', {
            operate: 'append',
            departmentId: this.props.query.regionId,
            deptUserIds: idArray
        });
        message.success('添加成功！');
        this.componentDidMount();
    }

    async ajaxCount() {
        let regionId = await this.getRegionId();
        let { data } = await get('/user_count', {
            departmentId: regionId
        });
        this.state.count = data;
        this.setStateMerge();
        return data;
    }

    async ajaxGetDetail() {
        let { data } = await get('/user_detail', {
            deptUserId: this.props.query.Id
        });
        let Path = []
        if (data.NSUsers.DepartmentPath) {
            Path = data.NSUsers.DepartmentPath[0].Path;
        } else {
            Path = data.NSUsers.Organization[0].Path;
        }
        this.state.regionId = Path[Path.length - 1].ID;
        return {
            pageCount: 1,
            pageIndex: 1,
            pageList: [data.NSUsers]
        };
    }

    titleAddRender() {
        let { state } = this;
        this.props.query.regionId = this.state.regionId;

        if (!this.props.query.Id) {
            return <span>
                <Privileges value='/department/users:add'>
                    <a onClick={() => {
                        (this.refs['SelectVar'] as any).modalShow(true);
                    }}>选择{this.title}</a>
                </Privileges>
                <SelectMember ref='SelectVar' onOk={this.onOk.bind(this)}></SelectMember>
                <Privileges value='/department/users/add'>
                    <Link className='ml10' to={{
                        pathname: this.addUrl,
                        query: this.props.query
                    }}>新增{this.title}</Link>
                </Privileges>
            </span>;
        }
    }


    async ajaxUpdate(value, key?: string) {
        let dataProps: any = [];
        if (key) {
            dataProps.push({
                'ParameterName': key,
                'ParameterValue': value[key]
            });
        }

        await post('/modified_user', {
            deptUserId: value.key,
            props: {
                NSUsers: dataProps
            }
        });
        message.success('修改成功！')
    }


    /**
     * 导航渲染
     * 
     * 
     * @memberOf Device
     */
    navRender() {
        return <Tabs type='card'>
            <TabPane tab='人员管理' key='人员管理'>
            </TabPane>
        </Tabs>;
    }

    /**
     * 根据选中删除
     * 
     * @param {any[]} value
     * 
     * @memberOf Com
     */
    async ajaxDelete(value: any[]) {
        let arr = value.map(value => value.UserID);
        await post('/delete_user', {
            deptUserIds: arr
        });
        this.modalSlipVisible(false);
        this.componentDidMount();
        message.success('删除成功！')
    }

    /**
     * 删除渲染
     * 
     * @returns
     * 
     * @memberOf Com
     */
    selectRender() {
        return <section>
            <ul className='ul-details'>
                {this.state.selectedRows.map((value, index) => {
                    return <li key={index + 1}>{value['UserID'] + ' ' + value['Name']}</li>;
                })}
            </ul>
            <section className='component-slip-footer'>
                <Button privileges='/department/users:move'
                    onClick={() => {
                        this.state.treeVisible = true;
                        this.setState(this.state);
                    }}>移动</Button>
                <Button privileges='/department/users:delete'
                    onClick={() => this.onDelete(this.state.selectedRows)}>删除</Button>
            </section>
        </section>;
    }

    /**
     * 详情渲染
     * 
     * @returns {JSX.Element}
     * 
     * @memberOf Com
     */
    detailsRender(): JSX.Element {
        let { state } = this;
        return <Details id={this.state.detailsDataSource.UserID}
            regionId={this.state.regionId}
            query={this.props.query}
            onChange={() => this.getDataSource()} />;
    }


    renderMainLeft() {
        return <MainLeft type='member' treeType={this.treeType}
            regionId={this.state.regionId} ref='tree'></MainLeft>;
    }



}



interface IDeviceProps {
    /**
     * 区域id
     * 
     * @type {string}
     * @memberOf IDeviceProps
     */
    id: string,

    current: string
};

interface IDeviceState {

};



