define("pages/device/device/add/_information.js",function(require, exports, module) {
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
const index_1 = require("../../../../components/antd/index");
const index_2 = require("../../../../components/ajax/index");
const index_3 = require("../../../../components/template-input/index");
const value_1 = require("../../../../components/global/value");
;
;
/**
 * 设备信息
 *
 * @class DeviceDrive
 * @extends {PureComponentGenerics<IDeviceDriveProps, IDeviceDriveState>}
 */
class DeviceDrive extends React.Component {
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
    }
    getTemplate(value) {
        let { NSDevicesTemplate } = this.state.data;
        let { Props } = NSDevicesTemplate;
        return Props.find(data => data.Name === value.ParameterName);
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            let { data } = yield index_2.get('/device_attribute', {
                deviceId: this.props.deviceId,
                categroy: 'NSDevices'
            });
            this.state.data = data;
            this.setState(this.state);
        });
    }
    ajaxUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            let Operation = new index_3.DeviceDataOperation('NSDevices', '', this.state.data.NSDevices, this.state.data.NSDevicesTemplate.Props);
            let data = Operation.getUpdate();
            if (!data.length) {
                index_1.message.success('请修改数据！');
                return;
            }
            // 添加hidden的值
            // this.state.data.NSDevicesTemplate.Props.forEach(value => {
            //     if (value.Form && value.Form.Type === 'Hidden') {
            //         let dev = this.state.data.NSDevices.find(devices => devices.ParameterName === value.Name);
            //         data.push(dev);
            //     }
            // });
            let deviceId = this.props.deviceId;
            yield index_2.post('/modified_device', {
                deviceId, props: {
                    NSDevices: data
                }
            });
            index_1.message.success('修改成功!');
            value_1.default.query['deviceId'] = this.getValue({ Name: 'deviceId' }).ParameterValue;
            value_1.default.jump(value_1.default.url, value_1.default.query);
        });
    }
    componentWillMount() {
        this.getData();
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
    /**
     * 是否有改动
     *
     * @returns
     *
     * @memberOf Com
     */
    isChange() {
        let data = this.state.data.NSDevices.filter(value => value._stateType === 'update');
        if (data.length) {
            return true;
        }
        else {
            return false;
        }
    }
    render() {
        let { props, state } = this;
        let { data } = state;
        return (React.createElement("section", null,
            React.createElement("table", { className: 'table-from' }, data.NSDevicesTemplate.Props.map(template => {
                let value = this.getValue(template);
                let bl = this.isShow(template);
                if (bl) {
                    return React.createElement("tbody", { key: value.ParameterName },
                        React.createElement("tr", null, template.Name === 'Longitude' ?
                            React.createElement("td", null, "\u7ECF\u7EAC\u5EA6") :
                            React.createElement("td", null, template.Description)),
                        React.createElement("tr", null,
                            React.createElement("td", null,
                                React.createElement(index_3.default, { data: value, dataList: data.NSDevices, template: template }))));
                }
            }))));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DeviceDrive;
});
//# sourceMappingURL=_information.js.map
