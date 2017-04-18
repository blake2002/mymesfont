define("pages/device/device/update.js",function(require, exports, module) {
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const React = require("react");
exports.React = React;
const components_1 = require("../../../components/global/components");
const index_1 = require("../../../components/antd/index");
const _main_1 = require("../../_main");
const index_2 = require("../../../components/ajax/index");
const _information_1 = require("./add/_information");
const _drive_1 = require("./add/_drive");
const _variable_1 = require("./add/_variable");
require("./add.css");
const value_1 = require("../../../components/global/value");
const index_3 = require("../../../components/privileges/index");
exports.privileges = '/device/devices/update';
;
;
class DeviceAdd extends components_1.PageGenerics {
    constructor() {
        super(...arguments);
        this.state = {
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
        };
        /**
         * 右侧切换tabs
         *
         *
         * @memberOf DeviceAdd
         */
        this.tabsArray = (() => {
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
                return index_3.havePrivileges(value.privileges);
            });
        })();
    }
    componentWillMount() {
        // this.getConfig().then(() => {
        // this.getData(this.state.attributeKey);
        // })
        let tabKey = this.props.query.tabKey;
        if (tabKey) {
            if (['NSDevices', 'NSDevicesDriver', 'NSDevicesVarInfo', 'NSDevicesAlarmInfo'].indexOf(tabKey) !== -1) {
                this.state.tabKey = '1';
                this.state.attributeKey = tabKey;
            }
            else {
                this.state.tabKey = '2';
                this.state.configureKey = tabKey;
            }
        }
        // 拦截页面跳转
        let router = this.props._router.router;
        router.setRouteLeaveHook(this.props._router.route, (e) => {
            let com = this.getSelectTabRef();
            if (com.isChange()) {
                index_1.Modal.confirm({
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
            }
            else {
                return true;
            }
        });
        // const { route } = this.props;
        // const { router } = this.context
        // router.setRouteLeaveHook(route, this.routerWillLeave)
    }
    componentWillUnmount() {
        let router = this.props._router.router;
        router.setRouteLeaveHook(this.props._router.route, null);
    }
    getSelectTabRef() {
        let key = this.state.tabKey === '1' ? this.state.attributeKey : this.state.configureKey;
        let com = this.refs[key];
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
            };
        });
    }
    ajaxModifiedDevice(props) {
        return __awaiter(this, void 0, void 0, function* () {
            let deviceId = this.props.query.DeviceID;
            yield index_2.post('/modified_device', { deviceId, props: props });
            index_1.message.success('修改成功!');
        });
    }
    onChangeTabs(key) {
        if (key === '1') {
            this.onChangeAttribute(this.state.attributeKey);
        }
        else {
            this.onChangeAttribute(this.state.configureKey);
        }
    }
    /**
     * 获取详细
     *  //分类 NSDevices-信息, NSDevicesDriver-驱动, NSDevicesAlarmInfo-报警, NSDevicesVarInfo-变量
     * @param {('NSDevices' | 'NSDevicesDriver' | 'NSDevicesAlarmInfo' | 'NSDevicesVarInfo')} categroy
     *
     * @memberOf DeviceAdd
     */
    getData(categroy) {
        return __awaiter(this, void 0, void 0, function* () {
            let deviceId = this.props.query.DeviceID;
            if (!this.state.dataAjax[categroy]) {
                let { data } = yield index_2.get('/device_attribute', { deviceId, categroy });
                if (categroy === 'NSDevices') {
                    this.state.data[categroy] = data;
                }
                else if (categroy === 'NSDevicesDriver') {
                    this.state.data[categroy] = data[categroy];
                    this.state.data['NSDriverTemplate'] = data['NSDriverTemplate'];
                }
                else {
                    this.state.data[categroy] = data[categroy];
                }
                this.setState(this.state);
                this.state.dataAjax[categroy] = true;
                this.state._ID = data._ID;
            }
            return this.state.data[categroy];
        });
    }
    onVariableChange(e, value, key) {
        let target = e.target;
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
                return React.createElement("section", { className: 'device-add-menu' },
                    React.createElement(index_3.default, { value: '/device/devices/update/nsDevices:save' },
                        React.createElement(index_1.Button, { className: 'ml20', type: 'primary', onClick: () => {
                                this.refs['NSDevices'].ajaxUpdate();
                            } }, "\u4FDD\u5B58")));
            case 'NSDevicesDriver':
                return React.createElement("section", { className: 'device-add-menu' },
                    React.createElement(index_1.Button, { className: 'ml20', privileges: '/device/devices/update/nsDevicesDriver:addDriver', onClick: () => this.refs['NSDevicesDriver'].driverModal(true) }, "\u65B0\u589E\u9A71\u52A8"),
                    React.createElement(index_1.Button, { className: 'ml20', type: 'primary', privileges: '/device/devices/update/nsDevicesDriver:save', onClick: () => this.refs['NSDevicesDriver'].ajaxSave() }, "\u4FDD\u5B58"));
            case 'NSDevicesVarInfo':
                return React.createElement("section", { className: 'device-add-menu' },
                    React.createElement(index_1.Button, { className: 'ml20', privileges: '/device/devices/update/nsDevicesVarInfo:new', onClick: () => {
                            this.refs['NSDevicesVarInfo'].add();
                            this.scrollBottom();
                        } }, "\u65B0\u589E\u53D8\u91CF"),
                    React.createElement(index_1.Button, { privileges: '/device/devices/update/nsDevicesVarInfo:moveUp', className: 'ml20', onClick: () => {
                            this.refs[key].moveUp();
                        } }, "\u4E0A\u79FB"),
                    React.createElement(index_1.Button, { privileges: '/device/devices/update/nsDevicesVarInfo:moveDown', className: 'ml20', onClick: () => {
                            this.refs[key].moveDown();
                        } }, "\u4E0B\u79FB"),
                    React.createElement(index_1.Button, { privileges: '/device/devices/update/nsDevicesVarInfo:save', className: 'ml20', type: 'primary', onClick: () => {
                            this.refs['NSDevicesVarInfo'].ajaxUpdate();
                            this.scrollBottom();
                        } }, "\u4FDD\u5B58"));
            case 'NSDevicesAlarmInfo':
                return React.createElement("section", { className: 'device-add-menu' },
                    React.createElement(index_1.Button, { className: 'ml20', privileges: '/device/devices/update/nsDevicesAlarmInfo:new', onClick: () => {
                            this.refs['NSDevicesAlarmInfo'].add();
                            this.scrollBottom();
                        } }, "\u65B0\u589E\u62A5\u8B66"),
                    React.createElement(index_1.Button, { className: 'ml20', privileges: '/device/devices/update/nsDevicesAlarmInfo:moveUp', onClick: () => {
                            this.refs[key].moveUp();
                        } }, "\u4E0A\u79FB"),
                    React.createElement(index_1.Button, { className: 'ml20', privileges: '/device/devices/update/nsDevicesAlarmInfo:moveDown', onClick: () => {
                            this.refs[key].moveDown();
                        } }, "\u4E0B\u79FB"),
                    React.createElement(index_1.Button, { className: 'ml20', privileges: '/device/devices/update/nsDevicesAlarmInfo:save', type: 'primary', onClick: () => {
                            this.refs['NSDevicesAlarmInfo'].ajaxUpdate();
                        } }, "\u4FDD\u5B58"));
            case 'NSDutyCard':
                return React.createElement("section", { className: 'device-add-menu' },
                    React.createElement(index_1.Button, { privileges: '/device/devices/uiUpdate/nsDutyCard:add', className: 'ml20', onClick: () => {
                            this.refs[key].modalShow();
                        } }, "\u9009\u62E9\u4EBA\u5458"),
                    React.createElement(index_1.Button, { privileges: '/device/devices/uiUpdate/nsDutyCard:save', className: 'ml20', type: 'primary', onClick: () => {
                            this.refs[key].ajaxUpdate();
                        } }, "\u4FDD\u5B58"));
            default:
                let obj = this.tabsArray.find(value => value.categroy === key);
                if (!obj) {
                    return value_1.default.jump('/error', {
                        code: 401
                    });
                }
                return React.createElement("section", { className: 'device-add-menu' },
                    React.createElement(index_1.Button, { privileges: obj.privileges + ':add', className: 'ml20', onClick: () => {
                            this.refs[key].modalShow();
                        } }, "\u9009\u62E9\u53D8\u91CF"),
                    React.createElement(index_1.Button, { privileges: obj.privileges + ':moveUp', className: 'ml20', onClick: () => {
                            this.refs[key].moveUp();
                        } }, "\u4E0A\u79FB"),
                    React.createElement(index_1.Button, { privileges: obj.privileges + ':moveDown', className: 'ml20', onClick: () => {
                            this.refs[key].moveDown();
                        } }, "\u4E0B\u79FB"),
                    React.createElement(index_1.Button, { privileges: obj.privileges + ':save', className: 'ml20', type: 'primary', onClick: () => {
                            this.refs[key].ajaxUpdate();
                        } }, "\u4FDD\u5B58"));
        }
    }
    scrollBottom() {
        let target = this.refs['scroll-box'];
        setTimeout(() => {
            target.scrollTop = 999999;
        }, 0);
    }
    onChangeAttribute(key) {
        let com = this.getSelectTabRef();
        if (com.isChange()) {
            index_1.Modal.confirm({
                title: '警告',
                content: '有未保存的修改数据！是否离开页面！',
                okText: '离开',
                cancelText: '返回',
                onOk: () => {
                    this.props.query.tabKey = key;
                    this.props.jump('/device/device/update', this.props.query);
                }
            });
        }
        else {
            this.props.query.tabKey = key;
            this.props.jump('/device/device/update', this.props.query);
        }
    }
    renderAttribute() {
        let { state, props } = this;
        return React.createElement(index_1.Tabs, { tabPosition: 'right', activeKey: state.attributeKey, onChange: this.onChangeAttribute.bind(this) },
            index_3.havePrivileges('/device/devices/update/nsDevices') &&
                React.createElement(index_1.TabPane, { tab: '信息', key: 'NSDevices' },
                    React.createElement(_information_1.default, { ref: 'NSDevices', deviceId: this.props.query.DeviceID })),
            index_3.havePrivileges('/device/devices/update/nsDevicesDriver') &&
                React.createElement(index_1.TabPane, { tab: '驱动', key: 'NSDevicesDriver' },
                    React.createElement(_drive_1.default, { ref: 'NSDevicesDriver', deviceId: this.props.query.DeviceID })),
            index_3.havePrivileges('/device/devices/update/nsDevicesVarInfo') &&
                React.createElement(index_1.TabPane, { tab: '变量', key: 'NSDevicesVarInfo' },
                    React.createElement(_variable_1.default, { ref: 'NSDevicesVarInfo', categroy: 'NSDevicesVarInfo', showText: 'VarName', privileges: '/device/devices/update/nsDevicesVarInfo', deviceId: this.props.query.DeviceID })),
            index_3.havePrivileges('/device/devices/update/nsDevicesAlarmInfo') &&
                React.createElement(index_1.TabPane, { tab: '报警', key: 'NSDevicesAlarmInfo' },
                    React.createElement(_variable_1.default, { ref: 'NSDevicesAlarmInfo', categroy: 'NSDevicesAlarmInfo', showText: 'AlarmID', privileges: '/device/devices/update/nsDevicesAlarmInfo', deviceId: this.props.query.DeviceID })));
    }
    renderConfig() {
        let { state, props } = this;
        return React.createElement(index_1.Tabs, { tabPosition: 'right', activeKey: state.configureKey, onChange: this.onChangeAttribute.bind(this) }, this.tabsArray.map(value => {
            return React.createElement(index_1.TabPane, { tab: value.name, key: value.categroy },
                React.createElement(_variable_1.default, { ref: value.categroy, categroy: value.categroy, showText: value.showText, privileges: value.privileges, deviceId: this.props.query.DeviceID }));
        }));
    }
    render() {
        let { state, props } = this;
        return React.createElement("section", { ref: 'gan', className: 'h100 page-device' },
            React.createElement(_main_1.MainLeft, { treeType: 'region_tree', disabled: true, regionId: this.props.query['regionId'] }),
            React.createElement("section", { className: 'main-right' },
                React.createElement("section", { className: 'main-right-tabs' },
                    React.createElement("div", { className: 'main-right-tabs-left ml20 mr20' },
                        React.createElement(index_1.Button, { onClick: () => {
                                let query = this.props.query;
                                delete query.DeviceID;
                                delete query.tabKey;
                                value_1.default.jump('/device/device/index', query);
                            } }, " \u8FD4\u56DE")),
                    React.createElement(index_1.Tabs, { type: 'card', activeKey: this.state.tabKey, tabBarExtraContent: this.tabBarExtraContentRender(), onChange: this.onChangeTabs.bind(this) },
                        index_3.havePrivileges('/device/devices/update') &&
                            React.createElement(index_1.TabPane, { tab: '设备属性', key: '1' }),
                        index_3.havePrivileges('/device/devices/uiUpdate') &&
                            React.createElement(index_1.TabPane, { tab: 'UI配置', key: '2' }))),
                React.createElement("section", { className: 'main-right-content page-deviceadd' },
                    React.createElement("section", { className: 'main-right-content-box', ref: 'scroll-box' }, state.tabKey === '1' ? this.renderAttribute() : this.renderConfig()))));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DeviceAdd;
});
//# sourceMappingURL=update.js.map
