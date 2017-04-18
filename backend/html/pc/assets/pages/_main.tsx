import * as React from 'react';
import { PureComponentGenerics, PageGenerics } from '../components/global/components';
import {
    Tabs, TabPane, InputSearch, Dropdown,
    Icon, Menu, Table, Pagination, ModalSlip, Button
} from '../components/antd/index';
import { get, post } from '../components/ajax/index';
import { hashHistory } from 'react-router';
import { TreeList } from './device/tree/tree-list'
import globalValue from '../components/global/value';
import { trim } from '../components/util/index';
import { Label } from './device/label/label'
import Privileges, { havePrivileges } from '../components/privileges/index';

interface IDeviceMainLeftProps {
    data: {
        url: string,
        name: string,
        privileges: string,
        operations?: any
    }[],
};
interface IDeviceMainLeftState { };
export class Nav extends React.Component<IDeviceMainLeftProps, IDeviceMainLeftState> {

    /**
     * 获取当前页面的key
     * 
     * @returns
     * 
     * @memberOf DeviceMainLeft
     */
    getActuveKey() {

        let url = globalValue.url;

        let obj = this.props.data.find(value => value.url === url);

        return this.props.data.indexOf(obj).toString();
    }

    tabsOnChange(key) {
        let url = this.props.data[key].url;
        hashHistory.push(url);
    }

    getOperations() {
        let url = globalValue.url;
        let obj = this.props.data.find((value) => {
            return value.url === url;
        });
        // if(obj.operations != ''){ 
        return obj.operations;
        // }
        // else{ 
        //     return <span/>;
        // }
    }

    public render(): JSX.Element {
        return <Tabs type='card'
            tabBarExtraContent={this.getOperations()}
            onChange={this.tabsOnChange.bind(this)}
            activeKey={this.getActuveKey()}>
            {
                this.props.data.map((value, index) => {
                    return havePrivileges(value.privileges) && <TabPane tab={value.name} key={index.toString()}>
                    </TabPane>
                })
            }
        </Tabs>
    }
}



interface IMainRightTabsProps {
    /**
     * 左边内容
     * 
     * @type {JSX.Element}
     * @memberOf IMainRightTabsProps
     */
    leftContent?: JSX.Element,
};
interface IMainRightTabsState { };
/**
 * 右边头部标签页
 *
 * @export
 * @class MainRightTabs
 * @extends {PureComponentGenerics<IMainRightTabsProps, IMainRightTabsState>}
            */
export class MainRightTabs extends React.Component<IMainRightTabsProps, IMainRightTabsState> {

    public render(): JSX.Element {
        let {props} = this;
        return <section className='main-right-tabs'>
            <div className='main-right-tabs-left ml20 mr20'>
                {props.leftContent}
            </div>
            {props.children}
        </section>;
    }
}



interface IMainLeftTreeProps {
    regionId?: string,
    disabled?: boolean
    treeType?: 'region_tree' | 'department_tree',
    type?: 'device' | 'member' | 'relationMember'
    LabelType?: 'user' | 'device'
};
interface IMainLeftTreeState { };
/**
 * 左边区域
 *
 * @class MainLeft
 * @extends {PureComponentGenerics<IMainLeftTreeProps, IMainLeftTreeState>}
            */
export class MainLeft extends React.Component<IMainLeftTreeProps, IMainLeftTreeState> {

    state: {
        seachText: string,
        regionList: {
            ID: string
            Name: string,
            Path: {
                Name: string
            }[]
        }[],
        deviceList: {
            DeviceID: string,
            DeviceName: string,
            DeviceType: string
        }[],
        memberList: {
            Name: string
            UserID: string
        }[]
    } = {
        seachText: globalValue.query['seach'] || '',
        regionList: null,
        deviceList: null,
        memberList: null
    }

    id: string
    name: string
    type: string
    getRegionNameResolve: (value: {
        id: string,
        name: string,
        type: string
    }) => void;
    getRegionName(): Promise<{
        id: string,
        name: string,
        type: string
    }> {
        this.getRegionNameResolve = null;
        return new Promise((resolve) => {
            // return resolve({
            //     id: '125',
            //     name: '2222'
            // });
            if (this.name) {
                resolve({
                    id: this.id,
                    name: this.name,
                    type: this.type
                });
            } else {
                this.getRegionNameResolve = resolve;
            }
        })
    }


    async ajaxSeach() {
        let {data} = await get({
            url: this.props.type !== 'member' ? '/search_region_tree' : '/search_department_tree',
            data: {
                searchTarget: this.props.type === 'relationMember' ? 'member' : 'device',
                keyword: trim(this.state.seachText),
                top: 10,
                pageIndex: -1,
                pageSize: -1
                // __request: {
                //     'RegionList': [{
                //         'ID': '125',
                //         'Name': 'xxx' + this.state.seachText + 'xxx',
                //         'Path': [{
                //             'ID': '33',
                //             'Name': '中国'
                //         }]
                //     }],
                //     'DeviceList': [{
                //         'DeviceID': '1111', // 设备ID
                //         'DeviceName': 'DDD' + this.state.seachText + 'DDD', // 设备名称
                //         'DeviceType': '1号机组' // 设备类型
                //     }]
                // }
            },
            type: 2
        });

        this.state.regionList = data.RegionList || data.DepartmentList;
        this.state.deviceList = data.DeviceList;
        this.state.memberList = data.MemberList || data.UserList;
        this.setState(this.state);
        return data;
    }

    onChange?(e) {
        let target: HTMLButtonElement = e.target;
        this.state.seachText = target.value;
        this.setState(this.state);
        if (trim(this.state.seachText)) {
            this.ajaxSeach();
        }
    }

    renderBlue(text: string) {
        let str = text.replace(new RegExp(this.state.seachText, 'g'),
            `<span className="blue">${this.state.seachText}</span>`);
        return <span dangerouslySetInnerHTML={{ __html: str }}></span>
    }

    getPathString(arr: any[]) {
        let str = '';
        arr.forEach(value => str += (value.Name + '-'));
        str.replace(/\-&/g, '');
        return str;
    }

    onDeviceClick(obj) {
        globalValue.jump(globalValue.url, {
            Id: obj.DeviceID || obj.UserID
        })
    }

    onRegionClick(obj) {
        globalValue.jump(globalValue.url, {
            regionId: obj.ID
        })
    }

    /**
     * 渲染搜索
     * 
     * @returns
     * 
     * @memberOf MainLeft
     */
    renderSeach() {
        let {state, props} = this;
        return <section className='h100 oa'>
            {
                state.regionList && <dl>
                    <dt>区域节点</dt>
                    {
                        state.regionList.map((value, index) => {
                            return <dd key={index} onClick={() => this.onRegionClick(value)}>
                                {this.getPathString(value.Path)}
                                {this.renderBlue(value.Name)}
                            </dd>
                        })
                    }
                </dl>
            }
            {
                state.deviceList && <dl>
                    <dt>设备</dt>
                    {
                        state.deviceList.map((value, index) => {
                            return <dd key={index} onClick={() => this.onDeviceClick(value)}>
                                <p>{this.renderBlue(value.DeviceID)}</p>
                                <p>{value.DeviceName}</p>
                            </dd>
                        })
                    }
                </dl>
            }
            {
                state.memberList && <dl>
                    <dt>人员</dt>
                    {
                        state.memberList.map((value, index) => {
                            return <dd key={index} onClick={() => this.onDeviceClick(value)}>
                                <p>{this.renderBlue(value.Name)}</p>
                                <p>{value.UserID}</p>
                            </dd>
                        })
                    }
                </dl>
            }
        </section>
    }

    renderTreeAndTag() {
        return <Tabs type='card' defaultActiveKey={globalValue.query['tagName'] ? '2' : '1'}>
            <TabPane tab={this.props.treeType === 'department_tree'
                ? '组织架构' : '区域架构'} key='1'>
                <section className='tabpane-content'>
                    <TreeList
                        disabled={this.props.disabled}
                        treeType={this.props.treeType}
                        regionId={this.props.regionId}
                        onClick={(id, name) => {
                            globalValue.jump(globalValue.url, {
                                regionId: id
                            })
                        }}
                        onCompleted={(id, name, type) => {
                            this.id = id;
                            this.name = name;
                            this.type = type;
                            if (this.getRegionNameResolve) {
                                this.getRegionNameResolve({
                                    id: this.id,
                                    name: this.name,
                                    type: this.type
                                });
                            }
                        }}
                    />
                </section>
            </TabPane>
            {
                this.props.treeType === 'department_tree' || <TabPane tab='标签' key='2'>
                    <Label type={this.props.LabelType || 'device'}
                        selectedName={globalValue.query['tagName']}
                        onLabelClick={obj =>
                            globalValue.jump(globalValue.url, {
                                tagName: obj.name
                            })
                        } />
                </TabPane>
            }
        </Tabs>
    }


    renderInit() {
        let {state, props} = this;
        return trim(state.seachText) === '' ?
            this.renderTreeAndTag()
            : this.renderSeach()
    }

    onSearch() {

        let str: string = globalValue.url;
        str = str.replace(/\/[^\/]+$/g, '/seach')


        delete globalValue.query['seachCurrent'];
        globalValue.jump(str, {
            ...globalValue.query,
            seach: this.state.seachText
        });
    }

    public render(): JSX.Element {
        let {state, props} = this;
        return (<section className={'main-left ' +
            (trim(state.seachText) === '' || this.props.children ? '' : 'skin-gray')}>
            <section className='box-seach'>
                <InputSearch style={{ width: '100%' }}
                    value={this.state.seachText}
                    onSearch={this.onSearch.bind(this)}
                    onChange={this.onChange.bind(this)}
                    placeholder='请输入关键字' />
            </section>
            <section className='main-left-content'>
                {
                    (this.props.children && !this.state.regionList) ||
                        (this.props.children && !this.state.seachText)
                        ? this.props.children : this.renderInit()
                }
            </section>
        </section >);
    }
}


interface IMainRightTitleProps {
    title: JSX.Element | string
    text: string,
    menu: JSX.Element
};
interface IMainRightTitleState { };
export class MainRightTitle extends React.Component<IMainRightTitleProps, IMainRightTitleState> {
    public render(): JSX.Element {
        let {props} = this;
        return (<section className='main-right-title'>
            <h3>
                {props.title}
            </h3>
            <div className='cf'>
                <span className='fl'>
                    {this.props.children}
                </span>
                <div className='fr'>
                    {props.text}
                    {props.text && <Dropdown overlay={props.menu} trigger={['click']}>
                        <Icon className='ml5 cp' type='bars' />
                    </Dropdown>}
                </div>
            </div>
        </section>);
    }
}


interface IMainRightContentProps {

    /**
     * 详情页面
     * 
     * @type {JSX.Element}
     * @memberOf IMainRightContentProps
     */
    detailsRender: JSX.Element,

    /**
     * 详情标题
     *
     * @type {string}
            * @memberOf IMainRightContentProps
     */
    detailsTitle: string

    /**
     * 表头
     *
     * @type {*}
            * @memberOf IMainRightContentProps
     */
    columns: any

    /**
     * 点击行的时候
     *
     *
     * @memberOf IMainRightContentProps
     */
    onRowClick: (record: any, index: number) => void


    /**
     * 表格数据查询条件
     *
     * @type {*}
            * @memberOf IMainRightContentProps
     */
    dataSource: any

    /**
     * 标题
     *
     * @type {string}
            * @memberOf IMainRightContentProps
     */
    title: JSX.Element | string
    /**
     * 统计ajax接口
     *
     * @type {string}
            * @memberOf IMainRightContentProps
     */
    ajaxCount: string

    /**
     * 标题里面右边的文字
     *
     * @type {string}
            * @memberOf IMainRightContentProps
     */
    titleText: string
    /**
     * 标题里面右边的下拉
     *
     * @type {JSX.Element}
            * @memberOf IMainRightContentProps
     */
    titleMenu: JSX.Element

    /**
     * 标题模块 子集 渲染
     *
     * @type {JSX.Element}
            * @memberOf IMainRightContentProps
     */
    titleRender: JSX.Element

    /**
     * 批量选择页面
     *
     * @type {JSX.Element}
            * @memberOf IMainRightContentProps
     */
    selectRender?: JSX.Element,
    /**
     * 批量选择标题
     *
     * @type {string}
            * @memberOf IMainRightContentProps
     */
    selectTitle?: string
    selectChange?: (selectedRowKeys: string, record: any[]) => void



    /**
     * 又弹窗显示
     *
     * @type {boolean}
            * @memberOf IMainRightContentProps
     */
    modalSlipVisible?: boolean

    onModalSlipCancel?: () => void

    query: {
        id: string,
        current: string
    }

    loading: boolean
};
interface IMainRightContentState {
    total: number
    dataSource: any
    modalSlipContent: string
};
export class MainRightContent extends React.Component<IMainRightContentProps, IMainRightContentState> {

    state = {
        dataSource: [],
        dataSourceIndex: 0,

        modalSlipContent: 'select',
        modalSlipTitle: '',

        total: 0,
        pageSize: 12,



        selectedRows: [],
        selectedRowKeys: [],

        count: null
    }


    componentWillMount() {
        this.ajaxCount();
    }


    shouldComponentUpdate(props: IMainRightContentProps) {
        let query = this.props.query;
        let queryN = props.query;

        if (query.current !== queryN.current) {
            this.props.query.current = queryN.current;
            this.ajaxCount();
        }
        return true;
    }


    /**
     * 头部标题渲染
     *
     * @returns
     *
     * @memberOf MainRightContent
     */
    titleRender() {
        let {state, props} = this;
        let titleText = ``;
        if (state.count !== null) {
            titleText = `${props.titleText}(${state.count})`;
        }
        return <MainRightTitle title={props.title}
            text={titleText} menu={this.props.titleMenu} >
            {this.props.titleRender}
        </MainRightTitle>
    }

    /**
     * 获取统计数量
     *
     * @returns
     *
     * @memberOf MainRightContent
     */
    async ajaxCount() {
        let {data} = await get(this.props.ajaxCount, {
            regionId: this.props.query.id || 125
        });
        this.state.count = data.count;
        this.setState(this.state);
        return data;
    }

    async onRowClick(record, index) {
        this.state.modalSlipContent = 'details';
        this.state.modalSlipTitle = this.props.detailsTitle;
        await this.props.onRowClick(record, index);
        this.setState(this.state);
    }

    onPaginationChange(index) {
        let query = Object.assign({}, globalValue.query);
        query['current'] = index;
        globalValue.jump(globalValue.url, query);
    }

    /**
     * 选中改变事件
     *
     * @param {any} selectedRowKeys
     * @param {any} selectedRows
     *
     * @memberOf MainRightContent
     */
    selectChange(selectedRowKeys, selectedRows) {
        this.state.selectedRows = selectedRows;
        this.state.modalSlipTitle = this.props.selectTitle || '批量选择';
        this.state.modalSlipContent = 'select';

        this.state.selectedRowKeys = [];
        selectedRows.forEach(value => {
            this.state.selectedRowKeys.push(value.key);
        });
        this.props.selectChange(selectedRowKeys, selectedRows);
    }

    getModalSlipContent() {
        switch (this.state.modalSlipContent) {
            case 'select':
                return this.props.selectRender;
            default:
                return this.props.detailsRender;
        }
    }

    public render(): JSX.Element {
        let {props, state} = this;
        return (<section className='main-right-content'>
            {this.titleRender()}

            <Table className='mt20' rowSelection={{
                selectedRowKeys: state.selectedRowKeys,
                onChange: this.selectChange.bind(this)
            }} onRowClick={this.onRowClick.bind(this)} loading={props.loading}
                pagination={false} dataSource={state.dataSource} columns={props.columns} />

            <Pagination className='mt20'
                current={parseInt(props.query.current || '1', null)}
                total={state.total}
                pageSize={state.pageSize}
                onChange={this.onPaginationChange.bind(this)} />

            <ModalSlip title={state.modalSlipTitle}
                onCancel={() => this.props.onModalSlipCancel()}
                visible={props.modalSlipVisible}>
                {this.getModalSlipContent()}
            </ModalSlip>

            {props.children}
        </section>);
    }
}



