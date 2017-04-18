define("pages/department/members/update.js",function(require, exports, module) {
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
const index_1 = require("../../../components/ajax/index");
const index_2 = require("../../../components/antd/index");
const components_1 = require("../../../components/global/components");
const _main_1 = require("../../_main");
const value_1 = require("../../../components/global/value");
const index_3 = require("../../../components/template-table/index");
const index_4 = require("../../../components/template-input/index");
exports.privileges = '/department/users/update';
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
        this.treeType = 'department_tree';
        this.returnUrl = '/department/members/index';
        this.title = '人员属性';
        this.state = {};
    }
    ajaxSave() {
        return __awaiter(this, void 0, void 0, function* () {
            this.refs['AddInformation'].ajaxUpdate();
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
            React.createElement(index_2.Button, { privileges: '/department/users/update:save', className: 'ml20', type: 'primary', onClick: this.ajaxSave.bind(this) }, "\u4FDD\u5B58"));
    }
    AddInformationRender() {
        return React.createElement(AddInformation, { ref: 'AddInformation', deptUserId: this.props.query.deptUserId });
    }
    render() {
        let { state, props } = this;
        return React.createElement("section", { className: 'h100 page-device' },
            React.createElement(_main_1.MainLeft, { disabled: true, type: 'member', treeType: this.treeType, regionId: this.props.query['regionId'] }),
            React.createElement("section", { className: 'main-right' },
                React.createElement("section", { className: 'main-right-tabs' },
                    React.createElement("div", { className: 'main-right-tabs-left ml20 mr20' },
                        React.createElement(index_2.Button, { onClick: () => {
                                delete this.props.query.deptUserId;
                                value_1.default.jump(this.returnUrl, this.props.query);
                            } }, " \u8FD4\u56DE")),
                    React.createElement(index_2.Tabs, { activeKey: '1', type: 'card', tabBarExtraContent: this.tabBarExtraContentRender() },
                        React.createElement(index_2.TabPane, { tab: this.title, key: '1' }))),
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
        this.key = 'NSUsersTemplate';
        this.state = {
            data: {
                NSDevices: [],
                NSDevicesTemplate: {
                    Props: []
                }
            }
        };
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
            let { data } = yield index_1.get('/user_detail', {
                deptUserId: this.props.deptUserId
            });
            let AddData = data[this.key].Props;
            this.state.data = {
                NSDevices: index_4.objectToArray2(data.NSUsers),
                NSDevicesTemplate: {
                    Props: AddData
                }
            };
            this.setState(this.state);
        });
    }
    ajaxUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            let Operation = new index_4.DeviceDataOperation('NSDevices', '', this.state.data.NSDevices, this.state.data.NSDevicesTemplate.Props);
            let data = Operation.getUpdate();
            if (!data.length) {
                index_2.message.success('请修改数据！');
                return;
            }
            let deptUserId = this.props.deptUserId;
            yield index_1.post('/modified_user', {
                deptUserId, props: {
                    NSUsers: Operation.getUpdate()
                }
            });
            index_2.message.success('修改成功!');
            // globalValue.query['deptUserId'] = this.getValue({ Name: 'UserID' }).ParameterValue;
            // globalValue.jump(globalValue.url, globalValue.query);
            this.componentDidMount();
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
//# sourceMappingURL=update.js.map
