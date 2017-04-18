import * as React from 'react';
import DeviceCom from '../device/index';
import { post, get } from '../../../components/ajax/index';
import DeviceDetails from '../device/_details';
import { DeviceDataOperation, objectToArray } from '../../../components/template-input/index';
import { Link } from 'react-router';
import {
    Table, Modal, InputSearch, message, Button, Dropdown, Menu
} from '../../../components/antd/index';
import { MainLeft, MainRightTitle } from '../../_main';
import { SelectMember } from '../../device/device/add/_variable';
import { MyTreeSelect } from '../selectTree/selectTree';
import Privileges, { havePrivileges } from '../../../components/privileges/index';
export let privileges = '/device/members';

export default class Com extends DeviceCom {
    columns = [{
        width: '150px',
        title: '人员编号',
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
    }]
    ajaxLableGetUrl = '/tag_member_list'
    addUrl = '/device/members/add'
    title = '人员'
    ajaxGetUrl = '/member_list'

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

    async ajaxCount() {
        let regionId = await this.getRegionId();
        let {data} = await get('/member_count', {
            regionId: regionId
        });
        this.state.count = data;
        this.setStateMerge();
        return data;
    }


    async ajaxGetDetail() {
        let {data} = await get('/member_detail', {
            memberId: this.props.query.Id
        });
        let Path = data.NSUsers.RegionPath[0].Path;
        this.state.regionId = Path[Path.length - 1].ID;
        return {
            pageCount: 1,
            pageIndex: 1,
            pageList: [data.NSUsers]
        };
    }

    /**
     * 根据选中删除
     * 
     * @param {any[]} value
     * 
     * @memberOf Device
     */
    async ajaxDelete(value: any[]) {
        let arr = value.map(value => value.UserID);
        await post('/member_belongs', {
            operate: 'remove',
            regionId: this.props.query.regionId,
            memberIds: arr
        });
        this.modalSlipVisible(false);
        this.componentDidMount();
        message.success('删除成功！')
    }


    menuRender() {
        let {state} = this;
        return <Menu onClick={this.onMenuClick.bind(this)}>
            <Menu.Item key='all'>
                全部{this.title}（{state.count.all}）
            </Menu.Item>
            <Menu.Item key='concerned'>
                已关注（{state.count.concerned}）
            </Menu.Item>
        </Menu>;
    }

    /**
     * 选择框渲染
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
                <Button privileges='/device/members:move' >移动</Button>
                <Button privileges='/device/members:remove'
                    onClick={() => this.onDelete(this.state.selectedRows)}>移除</Button>
            </section>
        </section>;
    }

    async ajaxAdd(idArray) {
        await post('/member_belongs', {
            operate: 'append',
            regionId: this.props.query.regionId,
            memberIds: idArray
        });
        message.success('添加成功！');
        this.componentDidMount();
    }

    onOk(data: {
        [key: string]: string,
    }[]) {
        this.ajaxAdd(data.map(value => value['UserID']));
    }

    titleAddRender() {
        let {state} = this;
        return state.regionType !== 'NSPlanets' &&
            (<span>
            <Privileges value='/device/members:add'>
                <a onClick={() => {
                    (this.refs['SelectVar'] as any).modalShow(true);
                }}>选择{this.title}</a>
                </Privileges>
                <SelectMember ref='SelectVar' onOk={this.onOk.bind(this)}></SelectMember>
            </span>);
    }


    /**
     * 详情渲染
     * 
     * @returns {JSX.Element}
     * 
     * @memberOf Com
     */
    detailsRender(): JSX.Element {
        let {state} = this;
        return <MemberDetails
            regionId={this.state.regionId}
            id={this.state.detailsDataSource.UserID}
            query={this.props.query}
            onChange={() => this.getDataSource()} />;
    }

    renderMainLeft() {
        return <MainLeft LabelType='user' type='relationMember' treeType={this.treeType}
            regionId={this.state.regionId} ref='tree'></MainLeft>;
    }


    renderTree() {
        return <Modal
            onOk={this.onOkTree.bind(this)}
            visible={this.state.treeVisible} title={'移动'} onCancel={() => {
                this.state.treeVisible = false;
                this.setState(this.state);
            }}>
            <MyTreeSelect
                jurisdiction='part'
                onGetNode={this.onGetNode.bind(this)} treeType={this.treeType} />
        </Modal>;
    }
}


export class MemberDetails extends DeviceDetails {
    ignoreList = ['Name', 'UserID']


    renderTree() {
        return <Modal
            onOk={this.onOkTree.bind(this)}
            visible={this.state.treeVisible} title={'移动'} onCancel={() => {
                this.state.treeVisible = false;
                this.setState(this.state);
            }}>
            <MyTreeSelect
                jurisdiction='part'
                onGetNode={this.onGetNode.bind(this)} treeType={this.treeType} />
        </Modal>;
    }

    async getData() {
        let {data} = await get('/member_detail', {
            memberId: this.props.id
        });
        data.NSUsers = objectToArray(data.NSUsers);

        this.state.data.NSDevices = data.NSUsers;


        this.state.data.NSDevicesTemplate = data.NSUsersTemplate;
        this.deviceDataOperation = new DeviceDataOperation(
            'NSDevices', this.props.id, this.state.data.NSDevices,
            this.state.data.NSDevicesTemplate.Props);
        this.setState(this.state);
    }

    async ajaxUpdate() {
        
        let {data} = await post('/top_member', {
            memberId: this.props.id,
            props: {
                NSUsers: this.deviceDataOperation.getUpdate()
            }
        });
        this.props.onChange();
        message.success('修改成功！')
    }

    async onTagOk() {
        await post('/tag_member', {
            memberIds: [this.props.id],
            tagNames: this.state.selectTagList
        });

        this.state.tagModalVisible = false;
        this.setState(this.state);
        message.success('添加成功！');
    }

      async ajaxConcern(bl = true) {
        let ajaxUrl = bl ? '/concern_member' : '/unconcern_member'

        if (bl) {
            await post(ajaxUrl, {
                memberId: this.props.id
            });
        } else {
            await post(ajaxUrl, {
                memberIds: [this.props.id]
            });
        }

        let msg = bl ? '关注成功！' : '取消关注成功！';
        this.componentWillMount();
        message.success(msg);
    }


    async ajaxMoveDevice(idArray) {

        await post('/member_belongs', {
            operate: 'append',
            memberIds: idArray,
            regionId: this.state.treeSelectId
        });
        await post('/member_belongs', {
            operate: 'remove',
            memberIds: idArray,
            regionId: this.props.regionId
        });

        this.props.onChange();
        message.success('移动成功！');
    }   
    

    async ajaxGetTag() {
        let {data} = await get('/tag_list', {
            category: 'user'
        });

        this.state.tagList = [];
        data.TagList.forEach(value => {
            this.state.tagList.push({
                label: value['Name'],
                value: value['Name']
            })
        });

        this.setState(this.state);
    }

    renderTitle() {
        return <h4>
            <p>{this.getValue('Name')}</p>
            <p>{this.getValue('UserID')}</p>
        </h4>;
    }

    renderFooter() {
        let {props, state} = this;
        return <section className='component-slip-footer'>
            {
                (this.getValue('Top') === '1') || (this.getValue('Top') == null) ?
                    <Button onClick={() => this.topChange('1')}>置顶</Button> :
                    <Button onClick={() => this.topChange('0')}>取消置顶</Button>
            }
            <Dropdown overlay={this.menu}><Button>更多</Button></Dropdown>
        </section>;
    }
}
