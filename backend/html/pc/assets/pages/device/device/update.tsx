import * as React from 'react';
export { React };
import { PageGenerics } from '../../../components/global/components';
import { Tabs, TabPane, Button, message, Modal } from '../../../components/antd/index';
import { MainLeft } from '../../_main';
import { post, get } from '../../../components/ajax/index';
import OptionsSelect from '../../../components/options-select/index';
import { uuid } from '../../../components/util/index';

import Information from './add/_information';
import Drive from './add/_drive';
import Variable from './add/_variable';
import {
    DeviceData, VariableData, AlarmData, DriverData, DriverTemplate, NSDevices,
    NSDriverLogicDevice, NSDevicesCommunicateParameter, NSDevicesCommunicateDataBlock
} from './types';

import './add.css';
import globalValue from '../../../components/global/value';
import Privileges, { havePrivileges } from '../../../components/privileges/index';
export let privileges = '/device/devices/update';


type DeviceCategroy = 'NSDevices' | 'NSDevicesDriver' | 'NSDevicesAlarmInfo' | 'NSDevicesVarInfo';

interface IDeviceAddProps {
    regionId: string,

    DeviceID: string,

    tabKey: DeviceCategroy
};

interface IDeviceAddState {
    tabBarExtraContent: JSX.Element
    tabKey: string
    attributeKey: DeviceCategroy
    configureKey: string
    data: {
        NSDevices?: DeviceData
        NSDevicesDriver?: DriverData[]
        NSDevicesVarInfo?: VariableData[]
        NSDevicesAlarmInfo?: AlarmData[]
        NSDriverTemplate?: DriverTemplate[]
    },
    /**
     * ajax是否加载过
     * 
     * @type {{
     *         NSDevices: boolean
     *         NSDevicesDriver: boolean
     *         NSDevicesVarInfo: boolean
     *         NSDevicesAlarmInfo: boolean
     *         NSDriverTemplate: boolean
     *     }}
     * @memberOf IDeviceAddState
     */
    dataAjax: {
        NSDevices: boolean
        NSDevicesDriver: boolean
        NSDevicesVarInfo: boolean
        NSDevicesAlarmInfo: boolean
        NSDriverTemplate: boolean
    },
    adddDriverVisible: boolean,
    driverValue: string,
    _ID: string
};



export default class DeviceAdd extends PageGenerics<IDeviceAddProps, IDeviceAddState> {

    state: IDeviceAddState = {
        tabBarExtraContent: null,
        tabKey: '1',
        attributeKey: 'NSDevices',
        configureKey: 'NSDeviceUIOverview',
        data: {
            NSDevices: {
                NSDevices: [],
                NSDevicesTemplate: {
                    Props: []
                }
            },
            NSDevicesDriver: []
        },
        _ID: '',
        dataAjax: {
            NSDevices: false,
            NSDevicesDriver: false,
            NSDevicesVarInfo: false,
            NSDevicesAlarmInfo: false,
            NSDriverTemplate: false
        },
        adddDriverVisible: false,
        driverValue: ''
    }

    /**
     * 右侧切换tabs
     * 
     * 
     * @memberOf DeviceAdd
     */
    tabsArray = (() => {
        return [{
            name: '设备概览',
            categroy: 'NSDeviceUIOverview',
            privileges: '/device/devices/uiUpdate/nsDeviceUIOverview',
            showText: 'Description'
        }, {
            name: '运行状态',
            categroy: 'NSDeviceUIRunState',
            privileges: '/device/devices/uiUpdate/nsDeviceUIRunState',
            showText: 'Description'
        }, {
            name: '机组故障',
            categroy: 'NSDeviceUIFault',
            privileges: '/device/devices/uiUpdate/nsDeviceUIFault',
            showText: 'Description'
        }, {
            name: '机组参数',
            categroy: 'NSDeviceUIParam',
            privileges: '/device/devices/uiUpdate/nsDeviceUIParam',
            showText: 'Description'
        }, {
            name: '流程图',
            categroy: 'NSDeviceFlowChart',
            privileges: '/device/devices/uiUpdate/nsDeviceFlowChart',
            showText: 'Description'
        }, {
            name: '责任卡',
            categroy: 'NSDutyCard',
            privileges: '/device/devices/uiUpdate/nsDutyCard',
            showText: 'Description'
        }].filter(value => {
            return havePrivileges(value.privileges);
        })
    })()

    componentWillMount() {
        // this.getConfig().then(() => {
        // this.getData(this.state.attributeKey);
        // })
        let tabKey = this.props.query.tabKey;
        if (tabKey) {
            if (['NSDevices', 'NSDevicesDriver', 'NSDevicesVarInfo', 'NSDevicesAlarmInfo'].indexOf(tabKey) !== -1) {
                this.state.tabKey = '1';
                this.state.attributeKey = tabKey;
            } else {
                this.state.tabKey = '2';
                this.state.configureKey = tabKey;
            }
        }


        // 拦截页面跳转
        let router: any = this.props._router.router;
        router.setRouteLeaveHook(this.props._router.route, (e) => {
            let com = this.getSelectTabRef();
            if (com.isChange()) {
                Modal.confirm({
                    title: '警告',
                    content: '有未保存的修改数据！是否离开页面！',
                    okText: '离开',
                    cancelText: '返回',
                    onOk: () => {
                        router.setRouteLeaveHook(this.props._router.route, null);
                        this.props.jump(e.pathname, e.query);
                    }
                });
                return false;
            } else {
                return true;
            }
        })
        // const { route } = this.props;
        // const { router } = this.context
        // router.setRouteLeaveHook(route, this.routerWillLeave)
    }

    componentWillUnmount() {
        let router: any = this.props._router.router;
        router.setRouteLeaveHook(this.props._router.route, null);
    }

    getSelectTabRef() {
        let key = this.state.tabKey === '1' ? this.state.attributeKey : this.state.configureKey;
        let com = this.refs[key] as any;
        return com;
    }

    /**
     * 获取改变后的驱动
     * 
     * @returns
     * 
     * @memberOf DeviceAdd
     */
    getChangeDataNSDevices() {
        return this.state.data.NSDevices.NSDevices.filter(value => value._stateType === 'update').map(value => {
            return {
                ParameterName: value.ParameterName,
                ParameterValue: value.ParameterValue
            }
        });
    }

    async ajaxModifiedDevice(props) {
        let deviceId = this.props.query.DeviceID;
        await post('/modified_device', { deviceId, props: props });
        message.success('修改成功!');
    }


    onChangeTabs(key) {
        if (key === '1') {
            this.onChangeAttribute(this.state.attributeKey);
        } else {
            this.onChangeAttribute(this.state.configureKey)
        }
    }

    /**
     * 获取详细
     *  //分类 NSDevices-信息, NSDevicesDriver-驱动, NSDevicesAlarmInfo-报警, NSDevicesVarInfo-变量
     * @param {('NSDevices' | 'NSDevicesDriver' | 'NSDevicesAlarmInfo' | 'NSDevicesVarInfo')} categroy
     * 
     * @memberOf DeviceAdd
     */
    async getData(categroy: DeviceCategroy) {
        let deviceId = this.props.query.DeviceID;

        if (!this.state.dataAjax[categroy]) {
            let {data} = await get('/device_attribute', { deviceId, categroy });

            if (categroy === 'NSDevices') {
                this.state.data[categroy] = data;
            } else if (categroy === 'NSDevicesDriver') {
                this.state.data[categroy] = data[categroy];
                this.state.data['NSDriverTemplate'] = data['NSDriverTemplate'];
            } else {
                this.state.data[categroy] = data[categroy];
            }
            this.setState(this.state);
            this.state.dataAjax[categroy] = true;

            this.state._ID = data._ID;

        }

        return this.state.data[categroy];
    }

    onVariableChange(e, value: VariableData, key: string) {
        let target: HTMLButtonElement = e.target;
        value[key] = target.value;
    }




    /**
     * 新增驱动渲染
     * 
     * @returns
     * 
     * @memberOf DeviceAdd
     */
    tabBarExtraContentRender() {
        let key = this.state.tabKey === '1' ? this.state.attributeKey : this.state.configureKey;
        switch (key) {
            case 'NSDevices':
                return <section className='device-add-menu'>
                    <Privileges value='/device/devices/update/nsDevices:save'>
                        <Button className='ml20' type='primary'
                            onClick={() => {
                                (this.refs['NSDevices'] as any).ajaxUpdate()
                            }}>保存</Button>
                    </Privileges>
                </section>;
            case 'NSDevicesDriver':
                return <section className='device-add-menu'>
                    <Button className='ml20' privileges='/device/devices/update/nsDevicesDriver:addDriver'
                        onClick={() => (this.refs['NSDevicesDriver'] as any).driverModal(true)}>新增驱动</Button>
                    <Button className='ml20' type='primary'
                        privileges='/device/devices/update/nsDevicesDriver:save'
                        onClick={() => (this.refs['NSDevicesDriver'] as any).ajaxSave()}>保存</Button>
                </section>;
            case 'NSDevicesVarInfo':
                return <section className='device-add-menu'>
                    <Button className='ml20'
                        privileges='/device/devices/update/nsDevicesVarInfo:new'
                        onClick={() => {
                            (this.refs['NSDevicesVarInfo'] as any).add();
                            this.scrollBottom();
                        }}>新增变量</Button>
                    <Button
                        privileges='/device/devices/update/nsDevicesVarInfo:moveUp'
                        className='ml20' onClick={() => {
                            (this.refs[key] as any).moveUp();
                        }}>上移</Button>
                    <Button
                        privileges='/device/devices/update/nsDevicesVarInfo:moveDown'
                        className='ml20' onClick={() => {
                            (this.refs[key] as any).moveDown();
                        }}>下移</Button>
                    <Button privileges='/device/devices/update/nsDevicesVarInfo:save'
                        className='ml20' type='primary' onClick={() => {
                            (this.refs['NSDevicesVarInfo'] as any).ajaxUpdate();
                            this.scrollBottom();
                        }}>保存</Button>
                </section>;
            case 'NSDevicesAlarmInfo':
                return <section className='device-add-menu'>
                    <Button className='ml20'
                        privileges='/device/devices/update/nsDevicesAlarmInfo:new'
                        onClick={() => {
                            (this.refs['NSDevicesAlarmInfo'] as any).add();
                            this.scrollBottom();
                        }}>新增报警</Button>
                    <Button className='ml20'
                        privileges='/device/devices/update/nsDevicesAlarmInfo:moveUp'
                        onClick={() => {
                            (this.refs[key] as any).moveUp();
                        }}>上移</Button>
                    <Button className='ml20'
                        privileges='/device/devices/update/nsDevicesAlarmInfo:moveDown'
                        onClick={() => {
                            (this.refs[key] as any).moveDown();
                        }}>下移</Button>
                    <Button className='ml20'
                        privileges='/device/devices/update/nsDevicesAlarmInfo:save'
                        type='primary' onClick={() => {
                            (this.refs['NSDevicesAlarmInfo'] as any).ajaxUpdate();
                        }}>保存</Button>
                </section>;
            case 'NSDutyCard':
                return <section className='device-add-menu'>
                    <Button privileges='/device/devices/uiUpdate/nsDutyCard:add'
                        className='ml20' onClick={() => {
                            (this.refs[key] as any).modalShow()
                        }}>选择人员</Button>
                    <Button privileges='/device/devices/uiUpdate/nsDutyCard:save'
                        className='ml20' type='primary' onClick={() => {
                        (this.refs[key] as any).ajaxUpdate();
                    }}>保存</Button>
                </section>;
            default:
                let obj = this.tabsArray.find(value => value.categroy === key);

                if (!obj) {
                    return globalValue.jump('/error', {
                        code: 401
                    });
                }

                return <section className='device-add-menu'>
                    <Button privileges={obj.privileges + ':add'} className='ml20' onClick={() => {
                        (this.refs[key] as any).modalShow()
                    }}>选择变量</Button>
                    <Button privileges={obj.privileges + ':moveUp'} className='ml20' onClick={() => {
                        (this.refs[key] as any).moveUp();
                    }}>上移</Button>
                    <Button privileges={obj.privileges + ':moveDown'} className='ml20' onClick={() => {
                        (this.refs[key] as any).moveDown();
                    }}>下移</Button>
                    <Button privileges={obj.privileges + ':save'} className='ml20' type='primary' onClick={() => {
                        (this.refs[key] as any).ajaxUpdate();
                    }}>保存</Button>
                </section>;
        }
    }

    scrollBottom() {
        let target: HTMLHtmlElement = this.refs['scroll-box'] as any;

        setTimeout(() => {
            target.scrollTop = 999999;
        }, 0);
    }

    onChangeAttribute(key) {
        let com = this.getSelectTabRef();
        if (com.isChange()) {
            Modal.confirm({
                title: '警告',
                content: '有未保存的修改数据！是否离开页面！',
                okText: '离开',
                cancelText: '返回',
                onOk: () => {
                    this.props.query.tabKey = key;
                    this.props.jump('/device/device/update', this.props.query);
                }
            });
        } else {
            this.props.query.tabKey = key;
            this.props.jump('/device/device/update', this.props.query);
        }
    }

    renderAttribute() {
        let {state, props} = this;
        return <Tabs tabPosition='right' activeKey={state.attributeKey}
            onChange={this.onChangeAttribute.bind(this)}>
            {havePrivileges('/device/devices/update/nsDevices') &&
                <TabPane tab='信息' key='NSDevices'>
                    <Information ref='NSDevices' deviceId={this.props.query.DeviceID} />
                </TabPane>
            }
            {havePrivileges('/device/devices/update/nsDevicesDriver') &&
                <TabPane tab='驱动' key='NSDevicesDriver'>
                    <Drive ref='NSDevicesDriver' deviceId={this.props.query.DeviceID} />
                </TabPane>
            }
            {havePrivileges('/device/devices/update/nsDevicesVarInfo') &&
                <TabPane tab='变量' key='NSDevicesVarInfo'>
                    <Variable ref='NSDevicesVarInfo'
                        categroy='NSDevicesVarInfo'
                        showText='VarName'
                        privileges='/device/devices/update/nsDevicesVarInfo'
                        deviceId={this.props.query.DeviceID} />
                </TabPane>
            }
            {havePrivileges('/device/devices/update/nsDevicesAlarmInfo') &&
                <TabPane tab='报警' key='NSDevicesAlarmInfo'>
                    <Variable ref='NSDevicesAlarmInfo'
                        categroy='NSDevicesAlarmInfo'
                        showText='AlarmID'
                        privileges='/device/devices/update/nsDevicesAlarmInfo'
                        deviceId={this.props.query.DeviceID} />
                </TabPane>
            }
        </Tabs>;
    }


    renderConfig() {
        let {state, props} = this;
        return <Tabs tabPosition='right'
            activeKey={state.configureKey}
            onChange={this.onChangeAttribute.bind(this)}>
            {this.tabsArray.map(value => {
                return <TabPane tab={value.name} key={value.categroy}>
                    <Variable ref={value.categroy}
                        categroy={value.categroy}
                        showText={value.showText}
                        privileges={value.privileges}
                        deviceId={this.props.query.DeviceID} />
                </TabPane>
            })}
        </Tabs>;
    }

    render() {
        let {state, props} = this;
        return <section ref='gan' className='h100 page-device'>
            <MainLeft treeType='region_tree' disabled={true} regionId={this.props.query['regionId']}></MainLeft>
            <section className='main-right'>
                <section className='main-right-tabs'>
                    <div className='main-right-tabs-left ml20 mr20'>
                        <Button onClick={() => {
                            let query = this.props.query;
                            delete query.DeviceID
                            delete query.tabKey
                            globalValue.jump('/device/device/index', query);
                        }}> 返回</Button>
                    </div>
                    <Tabs type='card'
                        activeKey={this.state.tabKey}
                        tabBarExtraContent={this.tabBarExtraContentRender()}
                        onChange={this.onChangeTabs.bind(this)}>
                        {
                            havePrivileges('/device/devices/update') &&
                            <TabPane tab='设备属性' key='1'>
                            </TabPane>
                        }
                        {
                            havePrivileges('/device/devices/uiUpdate') &&
                            <TabPane tab='UI配置' key='2'>
                            </TabPane>
                        }
                    </Tabs>
                </section>
                <section className={'main-right-content page-deviceadd'} >
                    <section className='main-right-content-box' ref='scroll-box'>
                        {state.tabKey === '1' ? this.renderAttribute() : this.renderConfig()}
                    </section>
                </section>
            </section>
        </section>
    }
}
