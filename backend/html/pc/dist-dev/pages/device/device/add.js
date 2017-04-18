define("pages/device/device/add.js",function(require, exports, module) {
"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
const index_2 = require("../../../components/ajax/index");
const _main_1 = require("../../_main");
const index_3 = require("../../../components/template-table/index");
const value_1 = require("../../../components/global/value");
require("./add.css");
/**
 * 页面权限
 *
 */
exports.privileges = '/device/devices/add';
;
/**
 * 新增设备
 *
 * @export
 * @class DeviceAdd
 * @extends {PageGenerics<IDeviceAddProps, any>}
 */
class DeviceAdd extends components_1.PageGenerics {
    constructor() {
        super(...arguments);
        this.title = '设备属性';
        this.treeType = 'region_tree';
        this.returnUrl = '/device/device/index';
        this.state = {};
    }
    /**
     * 保存ajax
     *
     *
     * @memberOf DeviceAdd
     */
    ajaxSave() {
        return __awaiter(this, void 0, void 0, function* () {
            let newData = this.refs['AddInformation'].getData();
            let { data } = yield index_2.post({
                url: '/new_device',
                data: {
                    companyId: this.props.query.regionId || 125,
                    props: { NSDevices: newData }
                }
            });
            this.props.jump('/device/device/update', __assign({}, this.props.query, { DeviceID: newData.find(value => value.ParameterName === 'DeviceID').ParameterValue }));
            index_1.message.success('新增成功！');
        });
    }
    /**
     * 新增驱动渲染
     *
     * @returns
     *
     * @memberOf DeviceAdd
     */
    tabBarExtraContentRender() {
        return React.createElement("section", { className: 'device-add-menu' },
            React.createElement(index_1.Button, { privileges: '/device/devices/add:save', className: 'ml20', type: 'primary', onClick: this.ajaxSave.bind(this) }, "\u521B\u5EFA"));
    }
    AddInformationRender() {
        return React.createElement(AddInformation, { ref: 'AddInformation' });
    }
    renderMainLeft() {
        return React.createElement(_main_1.MainLeft, { disabled: true, type: 'device', treeType: this.treeType, regionId: this.props.query['regionId'] });
    }
    render() {
        let { state, props } = this;
        return React.createElement("section", { className: 'h100 page-device' },
            this.renderMainLeft(),
            React.createElement("section", { className: 'main-right' },
                React.createElement("section", { className: 'main-right-tabs' },
                    React.createElement("div", { className: 'main-right-tabs-left ml20 mr20' },
                        React.createElement(index_1.Button, { onClick: () => {
                                value_1.default.jump(this.returnUrl, this.props.query);
                            } }, " \u8FD4\u56DE")),
                    React.createElement(index_1.Tabs, { activeKey: '1', type: 'card', tabBarExtraContent: this.tabBarExtraContentRender() },
                        React.createElement(index_1.TabPane, { tab: this.title, key: '1' }))),
                React.createElement("section", { className: 'main-right-content page-deviceadd ' }, this.AddInformationRender())));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DeviceAdd;
;
;
/**
 * 新增设备-表单
 *
 * @class AddInformation
 * @extends {React.Component<IAddInformationProps, IAddInformationState>}
 */
class AddInformation extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            data: {
                NSDevices: [],
                NSDevicesTemplate: {
                    Props: []
                }
            }
        };
        this.templateUrl = '/device_template';
        this.key = 'NSDevicesTemplate';
    }
    /**
     * 用于给父级获取数据
     *
     * @returns
     *
     * @memberOf AddInformation
     */
    getData() {
        return this.state.data.NSDevices;
    }
    /**
     * 获取设备模版
     *
     *
     * @memberOf AddInformation
     */
    ajaxGet() {
        return __awaiter(this, void 0, void 0, function* () {
            let { data } = yield index_2.get(this.templateUrl, {
                categroy: 'NSDevices'
            });
            let AddData = data[this.key].Props;
            this.state.data = {
                NSDevices: AddData.map(value => {
                    return {
                        ParameterName: value.Name,
                        ParameterValue: value.DefaultValue || ''
                    };
                }),
                NSDevicesTemplate: {
                    Props: AddData
                }
            };
            this.setState(this.state);
        });
    }
    /**
     * 根据模版找值
     *
     * @param {NSDevices} value
     * @returns
     *
     * @memberOf AddInformation
     */
    getValue(template) {
        let { NSDevices } = this.state.data;
        return NSDevices.find(data => data.ParameterName === template.Name);
    }
    /**
     * 是否显示
     *
     * @param {DevicesTemplate} template
     * @returns
     *
     * @memberOf AddInformation
     */
    isShow(template) {
        let show = true;
        if (!template) {
            show = false;
        }
        else {
            if (template.Visible === 'false') {
                show = false;
            }
            if (template.Form && template.Form.Type === 'Hidden') {
                show = false;
            }
            if (template.Name === 'Latitude') {
                show = false;
            }
        }
        return show;
    }
    render() {
        let { props, state } = this;
        let { data } = state;
        return (React.createElement("section", null,
            React.createElement(index_3.default, { data: this.state.data.NSDevices, template: this.state.data.NSDevicesTemplate.Props })));
    }
    /**
     * 渲染后执行
     *
     *
     * @memberOf AddInformation
     */
    componentDidMount() {
        this.ajaxGet();
    }
}
exports.AddInformation = AddInformation;
});
//# sourceMappingURL=add.js.map
