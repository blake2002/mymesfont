import * as React from 'react';
export { React };
import { Link } from 'react-router';
import { PageGenerics } from '../../../components/global/components';
import { Menu, Button, Switch, message, Table, Pagination, ModalSlip, Modal } from '../../../components/antd/index';
import { post, get } from '../../../components/ajax/index';

import { MainLeft, MainRightTitle } from '../../_main';
// import { DeviceData } from './types';
import Nav from '../_nav';
import Details from './_details';
import './index.css';
import globalValue from '../../../components/global/value';
import { MyTreeSelect } from '../selectTree/selectTree';
import Privileges, { havePrivileges } from '../../../components/privileges/index';


/**
 * 页面权限
 *
 */
export let privileges = '/device/devices/add';


interface IDeviceProps {
    /**
     * 区域id
     * 
     * @type {string}
     * @memberOf IDeviceProps
     */
    regionId: string,

    /**
     * 设备id
     * 
     * @type {string}
     * @memberOf IDeviceProps
     */
    Id: string,

    current: string,

    cateFilter: 'all' | 'concerned' | 'disabled',

    tagName: string
};

interface IDeviceState {

};


/**
 * 设备管理页面
 * 
 * @export
 * @class Device
 * @extends {PageGenerics<IDeviceProps, IDeviceState>}
 */
export default class Device extends PageGenerics<IDeviceProps, IDeviceState> {

    /**
     * 表单 columns 属性
     * 
     * 
     * @memberOf Device
     */
    columns = [{
        title: '设备编号',
        dataIndex: 'DeviceID',
        key: '1'
    }, {
        width: '150px',
        title: '实时数据库',
        dataIndex: 'RTDBID',
        key: '2'
    }, {
        width: '150px',
        title: '设备名称',
        dataIndex: 'DeviceName',
        key: '3'
    }, {
        width: '25%',
        title: '设备型号',
        dataIndex: 'DeviceType',
        key: '4'
    }, {
        width: '100px',
        title: '启用/禁用',
        dataIndex: 'Enable',
        key: '5',
        render: this.columnsRender.bind(this)
    }]
    title = '设备'
    addUrl = '/device/device/add'
    ajaxGetUrl = '/device_list'
    ajaxLableGetUrl = '/tag_device_list'
    ajaxUpdata = '/modified_device';
    treeType: any = 'region_tree'


    state = {
        detailsDataSource: null,
        dataSource: [],
        modalSlipVisible: false,
        modalSlipType: 'select',
        loading: true,
        count: {
            all: 0,
            concerned: 0,
            disabled: 0
        },
        cateFilter: 'all',
        total: 0,
        pageSize: 12,
        selectedIndex: null,
        selectedRows: [],
        selectedRowKeys: [],

        modalSlipTitle: this.title + '详情',
        title: '',
        regionId: this.props.query.regionId,
        regionType: 'NSPlanets',

        treeVisible: false,
        treeSelectId: ''
    }


    rowClassName(record, index) {
        if (index === this.state.selectedIndex) {
            return 'selected-td';
        }
    }

    async getRegionId() {
        let regionId = this.props.query.regionId;
        if (!regionId) {
            if (!this.state.regionId) {
                await this.setTitle();
            }
            regionId = this.state.regionId;
        }
        return regionId;
    }

    /**
     * 获取统计数量
     * 
     * @returns
     * 
     * @memberOf MainRightContent
     */
    async ajaxCount() {
        let regionId = await this.getRegionId();
        let { data } = await get('/device_count', {
            regionId: regionId
        });
        this.state.count = data;
        this.setStateMerge();
        return data;
    }

    /**
     * 更新
     * 
     * @param {any} value
     * @param {string} [key]
     * 
     * @memberOf Device
     */
    async ajaxUpdate(value, key?: string) {
        let dataProps: any = [];
        if (key) {
            dataProps.push({
                'ParameterName': key,
                'ParameterValue': value[key]
            });
        }

        await post(this.ajaxUpdata, {
            deviceId: value.DeviceID,
            props: {
                NSDevices: dataProps
            }
        });
        message.success('修改成功！')
    }

    /**
     * 根据选中设备删除
     * 
     * @param {any[]} value
     * 
     * @memberOf Device
     */
    async ajaxDelete(value: any[]) {
        let arr = value.map(value => value.DeviceID);
        await post('/delete_device', {
            deviceIds: arr
        });
        this.modalSlipVisible(false);
        this.componentDidMount();
        message.success('删除成功！')
    }


    async ajaxGetDetail() {
        let { data } = await get('/device_detail', {
            deviceId: this.props.query.Id,
            categroy: 'NSDevices'
        });
        let Path = data.NSDevices.RegionPath[0].Path;
        this.state.regionId = Path[Path.length - 1].ID;
        return {
            pageCount: 1,
            pageIndex: 1,
            pageList: [data.NSDevices]
        };
    }

    async ajaxGet() {
        let { props } = this;
        let regionId = await this.getRegionId();
        let { data } = await get(this.ajaxGetUrl, Object.assign({
            regionId: regionId,
            pageIndex: props.query.current || 1,
            pageSize: this.state.pageSize,
            cateFilter: props.query.cateFilter || 'all'
        }, {}));
        return data;
    }

    async ajaxGetList() {
        let { props } = this;

        if (this.props.query.tagName) {
            let { data } = await get(this.ajaxLableGetUrl, Object.assign({
                tagName: this.props.query.tagName,
                pageSize: this.state.pageSize,
                pageIndex: props.query.current || 1,
            }, {}));
            return data;
        } else if (this.props.query.Id) {
            return await this.ajaxGetDetail();
        } else {
            return await this.ajaxGet();
        }
    }

    /**
     * table数据更新
     * 
     * 
     * @memberOf Device
     */
    async getDataSource() {
        let { props } = this;

        this.state.loading = true;

        let data = await this.ajaxGetList();
        if (data.pageCount < props.query.current) {
            props.query.current = data.pageCount;
        }

        // 清空选中！
        this.state.selectedRowKeys = [];
        this.onSelectChange('', []);

        this.state.dataSource = data.pageList;
        this.state.dataSource.forEach((value, index) => {
            value.key = index.toString();
        });

        this.state.total = data.pageCount * this.state.pageSize;
        this.state.loading = false;
        this.setStateMerge();
    }
    /**
     * 弹窗显示隐藏
     * 
     * @param {any} bl
     * 
     * @memberOf Device
     */
    modalSlipVisible(bl) {
        this.state.modalSlipVisible = bl;
        this.setStateMerge();
    }

    /**
     * 选择框删除事件
     * 
     * @param {any[]} value
     * 
     * @memberOf Device
     */
    onDelete(value: any[]) {
        Modal.confirm({
            title: '删除',
            content: '确定删除吗？',
            onOk: () => this.ajaxDelete(value)
        })
    }

    async ajaxMoveDevice(idArray) {
        await post('/move_device', {
            deviceIds: idArray,
            newCompanyId: this.state.treeSelectId
        });

        this.state.treeVisible = false;
        this.componentDidMount();
        message.success('移动成功！');
    }

    onGetNode(obj) {
        this.state.treeSelectId = obj[0].id;
    }

    onOkTree() {
        this.ajaxMoveDevice(this.state.selectedRows.map(value => value.DeviceID));
    }

    renderTree() {
        return <Modal
            onOk={this.onOkTree.bind(this)}
            visible={this.state.treeVisible} title={'移动'} onCancel={() => {
                this.state.treeVisible = false;
                this.setState(this.state);
            }}>
            <MyTreeSelect
                jurisdiction='only'
                onGetNode={this.onGetNode.bind(this)} treeType={this.treeType} />
        </Modal>;
    }


    async onTagDelete() {
        let row = this.state.selectedRows;
        await post('/untag_device', {
            deviceIds: row.map(value => value.DeviceID),
            tagNames: [this.props.query.tagName]
        });

        message.success('删除成功！');

        this.componentDidMount();
    }

    /**
     * 选择框渲染
     * 
     * @returns
     * 
     * @memberOf Device
     */
    selectRender() {
        return <section>
            <ul className='ul-details'>
                {this.state.selectedRows.map((value, index) => {
                    return <li key={index + 1}>{value['DeviceID'] + ' ' + value['DeviceName']}</li>;
                })}
            </ul>
            <section className='component-slip-footer'>
                <Button
                    privileges='/device/devices:move'
                    onClick={() => {
                        this.state.treeVisible = true;
                        this.setState(this.state);
                    }}>移动</Button>
                {this.props.query.tagName && <Button onClick={this.onTagDelete.bind(this)}>删除标签</Button>}
                <Button privileges='/device/devices:delete'
                    onClick={() => this.onDelete(this.state.selectedRows)}>删除</Button>
            </section>
        </section>;
    }

    /**
     * 详情渲染
     * 
     * @returns {JSX.Element}
     * 
     * @memberOf Device
     */
    detailsRender(): JSX.Element {
        let { state } = this;
        return <Details
            regionId={this.state.regionId}
            id={this.state.detailsDataSource.DeviceID}
            query={this.props.query}
            onChange={() => this.getDataSource()} />;
    }

    /**
     * 筛选点击事件
     * 
     * 
     * @memberOf Device
     */
    onMenuClick(obj) {
        let key = obj.key;
        this.props.query.cateFilter = key;
        globalValue.jump(globalValue.url, this.props.query);
    }

    /**
     * 筛选渲染
     * 
     * @returns
     * 
     * @memberOf Device
     */
    menuRender() {
        let { state } = this;
        return <Menu onClick={this.onMenuClick.bind(this)}>
            <Menu.Item key='all'>
                全部设备（{state.count.all}）
            </Menu.Item>
            <Menu.Item key='concerned'>
                已关注（{state.count.concerned}）
            </Menu.Item>
            <Menu.Item key='disabled'>
                禁用（{state.count.disabled}）
            </Menu.Item>
        </Menu>;
    }

    /**
     * 改变标题
     * 
     * 
     * @memberOf Device
     */
    async setTitle() {
        let tree: any = this.refs['tree'];
        let obj = await tree.getRegionName();

        this.state.title = obj.name;
        this.state.regionId = obj.id;
        this.state.regionType = obj.type;
        this.setStateMerge();
    }

    /**
     * 头部标题渲染
     * 
     * @returns
     * 
     * @memberOf MainRightContent
     */
    titleRender() {
        let {state} = this;
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

    titleAddRender() {
        let {state} = this;
        this.props.query.regionId = this.state.regionId;
        return <Privileges value='/device/devices:new'>
            {state.regionType === 'NSCompanys' && <Link to={{
            pathname: this.addUrl,
            query: this.props.query
            }}>新增{this.title}</Link>}
        </Privileges>
    }

    /**
     * 禁用按钮改变事件
     * 
     * @param {any} checked
     * @param {any} value
     * 
     * @memberOf Device
     */
    async onSwitchChange(checked, value) {
        value.Enable = checked.toString();
        await this.ajaxUpdate(value, 'Enable')
        this.setStateMerge();
    }

    /**
     * 启用禁用的渲染
     * 
     * @param {any} text
     * @param {any} value
     * @returns
     * 
     * @memberOf Device
     */
    columnsRender(text, value) {
        return <span onClick={(e) => e.stopPropagation()}>
            <Switch onChange={(checked) => this.onSwitchChange(checked, value)}
                checked={text === 'true' ? true : false}></Switch>
        </span>;
    }

    /**
     * 分页改变事件
     * 
     * @param {any} index
     * 
     * @memberOf Device
     */
    onPaginationChange(index) {
        let query = Object.assign({}, globalValue.query);
        query['current'] = index;
        globalValue.jump(globalValue.url, query);
    }

    /**
     * 行点击事件
     * 
     * @param {any} record
     * @param {any} index
     * 
     * @memberOf Device
     */
    onRowClick(record, index) {
        this.state.selectedIndex = index;
        this.state.detailsDataSource = record;
        this.state.modalSlipTitle = this.title + '详情';
        this.state.modalSlipType = 'details';
        this.modalSlipVisible(true);
        this.setStateMerge();
    }

    /**
     * 选中改变事件
     * 
     * @param {any} selectedRowKeys
     * @param {any} selectedRows
     * 
     * @memberOf Device
     */
    onSelectChange(selectedRowKeys, selectedRows) {
        this.state.selectedRows = selectedRows;
        this.state.modalSlipTitle = '批量选择';
        this.state.modalSlipType = 'select';

        this.state.selectedRowKeys = [];
        selectedRows.forEach(value => {
            this.state.selectedRowKeys.push(value.key);
        });

        this.modalSlipVisible(selectedRows.length !== 0);
        this.setStateMerge();
    }

    getTableHeight() {
        let height = document.body.clientHeight - 355;
        if (height <= this.state.dataSource.length * 55) {
            return height;
        } else {
            return null;
        }
    }

    /**
     * 导航渲染
     * 
     * 
     * @memberOf Device
     */
    navRender() {
        return <Nav />;
    }


    /**
     * 额外渲染
     * 
     * 
     * @memberOf Device
     */
    extraRender() {
        
    }

    renderMainLeft() {
        return <MainLeft type='device' treeType={this.treeType}
                regionId={this.state.regionId} ref='tree'></MainLeft>;
    }

    public render(): JSX.Element {
        let {state, props} = this;
        return <section className='h100 page-device'>
            {this.renderMainLeft()}
            <section className='main-right'>
                {this.navRender()}
                <section className='main-right-content'>
                    <section className='main-right-content-box'>
                        {this.props.query.tagName ? false : this.titleRender()}
                        <Table className='mt20'
                            scroll={{ y: this.getTableHeight() }}
                            rowSelection={{
                                selectedRowKeys: state.selectedRowKeys,
                                onChange: this.onSelectChange.bind(this)
                            }}
                            onRowClick={this.onRowClick.bind(this)}
                            loading={state.loading}
                            rowClassName={this.rowClassName.bind(this)}
                            pagination={false} dataSource={state.dataSource} columns={this.columns} />

                        <Pagination className='mt20'
                            current={parseInt(props.query.current || '1', null)}
                            total={state.total}
                            pageSize={state.pageSize}
                            onChange={this.onPaginationChange.bind(this)} />

                        <ModalSlip title={state.modalSlipType === 'select' ? '批量选择' : this.title + '详情'}
                            onCancel={() => this.modalSlipVisible(false)}
                            visible={state.modalSlipVisible}>
                            {state.modalSlipType === 'select' ? this.selectRender() : this.detailsRender()}
                        </ModalSlip>

                        {props.children}

                        {this.extraRender()}
                        {this.renderTree()}
                    </section>
                </section>
            </section>
        </section>;
    }

    /**
     * 组件渲染完毕获取ajax数据
     * 
     * 
     * @memberOf Device
     */
   async componentDidMount() {

        await this.setTitle();

        this.ajaxCount();
        this.getDataSource();
    }
}

