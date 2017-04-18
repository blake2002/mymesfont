define("pages/device/device/add/_drive.js",function(require, exports, module) {
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
const index_3 = require("../../../../components/util/index");
const index_4 = require("../../../../components/options-select/index");
const react_router_1 = require("react-router");
const value_1 = require("../../../../components/global/value");
const index_5 = require("../../../../components/privileges/index");
;
;
/**
 * 驱动
 *
 * @class DeviceDrive
 * @extends {PureComponentGenerics<IDeviceDriveProps, IDeviceDriveState>}
 */
class DeviceDrive extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            data: [],
            template: [],
            _ID: '',
            driverValue: '',
            driverText: '',
            addDriverVisible: false
        };
        this.mixins = [react_router_1.History];
        /**
         * 临时记录值
         *
         * @type {NSDevicesCommunicateParameter[]}
         * @memberOf DeviceDrive
         */
        this.temporaryData = [];
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            let { data } = yield index_2.get('/device_attribute', {
                deviceId: this.props.deviceId,
                categroy: 'NSDevicesDriver'
            });
            this.state.data = data.NSDevicesDriver;
            this.state._ID = data._ID;
            this.state.template = data.NSDriverTemplate;
            this.setState(this.state);
        });
    }
    componentWillMount() {
        // post('/delete_device_driver', {
        //     deviceId: this.props.deviceId,
        //     _ID: '9795e1e7-5374-46cf-9aa3-a0ca86451a8e',
        //     itemIds: ['12f8d3f3-67a4-4778-b17c-9db975a0e733']
        // });
        this.getData();
    }
    onDel(index) {
        if (this.state.data.length === 1) {
            index_1.message.error('最后一个驱动不可删除！');
            return;
        }
        let data = this.state.data[index];
        if (!data._stateType) {
            data._stateType = 'delete';
        }
        else {
            this.state.data.splice(index, 1);
        }
        this.setState(this.state);
    }
    /**
     * 获取驱动模版
     *
     * @returns
     *
     * @memberOf DeviceDrive
     */
    getDriverConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            let { data } = yield index_2.get('/device_driver_config', { driverId: this.state.driverValue });
            return data;
        });
    }
    /**
     * 添加新驱动
     *
     *
     * @memberOf DeviceAdd
     */
    addDriver() {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield this.getDriverConfig();
            this.state.template.push(data);
            this.state.data.push({
                NSDriverLogicDevice: [this.getNewDevice(this.state.template.length - 1)],
                DriverID: this.state.driverText,
                _stateType: 'add'
            });
            this.driverModal(false);
            this.setState(this.state);
        });
    }
    getNewDevice(index) {
        let template = this.state.template[index];
        let value = template.NSDevicesCommunicateParameter.map(value => {
            let cp = {
                _uuid: index_3.uuid(),
                _stateType: 'add',
                ParameterName: value.Column,
                ParameterValue: value.DefaultValue || ''
            };
            return cp;
        });
        return {
            _uuid: index_3.uuid(),
            _stateType: 'add',
            DriverDeviceID: '',
            NSDevicesCommunicateDataBlock: [this.newDataBlock(index)],
            NSDevicesCommunicateParameter: value
        };
    }
    newDataBlock(index) {
        let template = this.state.template[index];
        let value = template.NSDevicesCommunicateDataBlockParameter.map(value => {
            return {
                _uuid: index_3.uuid(),
                _stateType: 'add',
                ParameterName: value.Column,
                ParameterValue: value.DefaultValue || ''
            };
        });
        return {
            DataBlockID: '',
            _uuid: index_3.uuid(),
            _stateType: 'add',
            NSDevicesCommunicateDataBlockParameter: value
        };
    }
    /**
     * 添加驱动弹窗 显示/隐藏
     *
     * @param {any} bl
     *
     * @memberOf DeviceAdd
     */
    driverModal(bl) {
        this.state.addDriverVisible = bl;
        this.setState(this.state);
    }
    /**
     * 驱动修改页面
     *
     * @returns
     *
     * @memberOf DeviceAdd
     */
    adddDriverRender() {
        return React.createElement(index_1.Modal, { title: '新增驱动', visible: this.state.addDriverVisible, onOk: this.addDriver.bind(this), onCancel: () => this.driverModal(false) },
            React.createElement(index_4.default, { style: { width: '100%' }, onChange: (value, text) => {
                    this.state.driverValue = value;
                    this.state.driverText = text;
                }, type: 'driver' }));
    }
    ajaxSave() {
        return __awaiter(this, void 0, void 0, function* () {
            let failData = this.getUpdateDataNSDevicesDriver('fail');
            if (failData.length) {
                index_1.message.error('通信参数端口号重复！');
                return;
            }
            let updateData = this.getUpdateDataNSDevicesDriver('update');
            if (updateData.length) {
                console.log('更新数据:', updateData);
                yield index_2.post('/modified_device_driver', {
                    deviceId: this.props.deviceId,
                    _ID: this.state._ID,
                    props: updateData
                });
            }
            let deleteDate = this.getUpdateDataNSDevicesDriver('delete');
            if (deleteDate.length) {
                console.log('删除数据:', deleteDate);
                yield index_2.post('/delete_device_driver', {
                    _ID: this.state._ID,
                    deviceId: this.props.deviceId,
                    itemIds: deleteDate
                });
            }
            let addDate = this.getUpdateDataNSDevicesDriver('add');
            if (addDate.length) {
                console.log('添加数据:', addDate);
                yield index_2.post('/new_device_driver', {
                    _ID: this.state._ID,
                    deviceId: this.props.deviceId,
                    categroy: 'NSDevicesDriver',
                    props: {
                        NSDevicesDriver: addDate
                    }
                });
            }
            this.getData();
            index_1.message.success('保存成功！');
        });
    }
    /**
     * 是否有改动
     *
     * @returns
     *
     * @memberOf DeviceDrive
     */
    isChange() {
        let updateData = this.getUpdateDataNSDevicesDriver('update');
        let deleteDate = this.getUpdateDataNSDevicesDriver('delete');
        let addDate = this.getUpdateDataNSDevicesDriver('add');
        if (updateData.length || deleteDate.length || addDate.length) {
            return true;
        }
        else {
            return false;
        }
    }
    getUpdateDataNSDevicesDriver(type) {
        this.temporaryData = [];
        let data = this.state.data.map(value => this.getUpdateDataByDriverData(value, type)).filter(value => value);
        if (type === 'add') {
            return data;
        }
        return this.temporaryData;
    }
    getUpdateDataByDriverData(data, type) {
        data = Object.assign({}, data);
        data.NSDriverLogicDevice = data.NSDriverLogicDevice.map(value => this.getUpdateDataByNSDriverLogicDevice(value, type)).filter(value => value);
        if (data._stateType === type) {
            switch (type) {
                case 'delete':
                    this.temporaryData.push(data._ID);
                    break;
            }
        }
        if (data.NSDriverLogicDevice.length) {
            return data;
        }
    }
    getUpdateDataByNSDriverLogicDevice(data, type) {
        data = Object.assign({}, data);
        data.NSDevicesCommunicateDataBlock = data.NSDevicesCommunicateDataBlock.map(value => this.getUpdateDataByNSDevicesCommunicateDataBlock(value, type)).filter(value => value);
        data.NSDevicesCommunicateParameter = data.NSDevicesCommunicateParameter.map(value => this.getUpdateDataByNSDevicesCommunicateParameter(value, type)).filter(value => value);
        if (data._stateType === type) {
            switch (type) {
                case 'update':
                    this.temporaryData.push({
                        _ID: data._ID,
                        ParameterName: 'DriverDeviceID',
                        ParameterValue: data.DriverDeviceID
                    });
                    break;
                case 'delete':
                    this.temporaryData.push(data._ID);
                    break;
            }
            return data;
        }
        if (data.NSDevicesCommunicateDataBlock.length) {
            return data;
        }
    }
    getUpdateDataByNSDevicesCommunicateDataBlock(data, type) {
        data = Object.assign({}, data);
        data.NSDevicesCommunicateDataBlockParameter = data.NSDevicesCommunicateDataBlockParameter.map(value => this.getUpdateDataByNSDevicesCommunicateParameter(value, type)).filter(value => value);
        if (data._stateType === type) {
            switch (type) {
                case 'update':
                    this.temporaryData.push({
                        _ID: data._ID,
                        ParameterName: 'DataBlockID',
                        ParameterValue: data.DataBlockID
                    });
                    break;
                case 'delete':
                    this.temporaryData.push(data._ID);
                    break;
            }
            return data;
        }
        if (data.NSDevicesCommunicateDataBlockParameter.length) {
            return data;
        }
    }
    getUpdateDataByNSDevicesCommunicateParameter(data, type) {
        data = Object.assign({}, data);
        if (data._stateType === type) {
            switch (type) {
                case 'update':
                    this.temporaryData.push({
                        _ID: data._ID,
                        ParameterName: data.ParameterName,
                        ParameterValue: data.ParameterValue
                    });
                    break;
                case 'fail':
                    this.temporaryData.push({
                        _ID: data._ID,
                        ParameterName: data.ParameterName,
                        ParameterValue: data.ParameterValue
                    });
                    break;
                case 'delete':
                    this.temporaryData.push(data._ID);
                    break;
            }
            return data;
        }
    }
    render() {
        let { state, props } = this;
        return (React.createElement("section", null,
            state.data.map((value, index) => {
                if (value._stateType !== 'delete') {
                    value._uuid = value._uuid || index_3.uuid();
                    return React.createElement(Drive, { key: value._uuid, data: value, template: state.template[index], onDel: () => this.onDel(index) });
                }
            }),
            this.adddDriverRender()));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DeviceDrive;
;
;
class Drive extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {};
    }
    newDataBlock() {
        let value = this.props.template.NSDevicesCommunicateDataBlockParameter.map(value => {
            return {
                _uuid: index_3.uuid(),
                _stateType: 'add',
                ParameterName: value.Column,
                ParameterValue: value.DefaultValue || ''
            };
        });
        return {
            DataBlockID: '',
            _uuid: index_3.uuid(),
            _stateType: 'add',
            NSDevicesCommunicateDataBlockParameter: value
        };
    }
    addDevice() {
        let value = this.props.template.NSDevicesCommunicateParameter.map(value => {
            let cp = {
                _uuid: index_3.uuid(),
                _stateType: 'add',
                ParameterName: value.Column,
                ParameterValue: value.DefaultValue || ''
            };
            return cp;
        });
        this.props.data.NSDriverLogicDevice.push({
            _uuid: index_3.uuid(),
            _stateType: 'add',
            DriverDeviceID: '',
            NSDevicesCommunicateDataBlock: [this.newDataBlock()],
            NSDevicesCommunicateParameter: value
        });
        this.setState(this.state);
    }
    onDel(index) {
        if (this.props.data.NSDriverLogicDevice.length === 1) {
            index_1.message.error('最后一个设备不可删除！');
            return;
        }
        let data = this.props.data.NSDriverLogicDevice[index];
        if (!data._stateType) {
            data._stateType = 'delete';
        }
        else {
            this.props.data.NSDriverLogicDevice.splice(index, 1);
        }
        this.setState(this.state);
    }
    render() {
        let { state, props } = this;
        let { data } = props;
        return React.createElement("section", { className: 'device-add' },
            React.createElement("section", { className: 'device-add-title' },
                data.DriverID,
                React.createElement(index_5.default, { value: '/device/devices/update/nsDevicesDriver:removeDriver' },
                    React.createElement(index_1.Button, { className: 'ml20', onClick: () => this.props.onDel() }, "\u5220\u9664")),
                React.createElement(index_5.default, { value: '/device/devices/update/nsDevicesDriver:addLogicDevice' },
                    React.createElement(index_1.Button, { className: 'ml20', onClick: () => this.addDevice() }, "\u65B0\u589E\u8BBE\u5907"))),
            data.NSDriverLogicDevice.map((value, index) => {
                if (value._stateType !== 'delete') {
                    value._uuid = value._uuid || index_3.uuid();
                    return React.createElement(Device, { key: value._uuid, data: value, template: props.template, onDel: () => this.onDel(index) });
                }
            }));
    }
}
;
;
/**
 * 设备
 *
 * @class Device
 * @extends {PureComponentGenerics<IDeviceProps, IDeviceState>}
 */
class Device extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {};
    }
    dataBlockAdd() {
        let value = this.props.template.NSDevicesCommunicateDataBlockParameter.map(value => {
            return {
                _uuid: index_3.uuid(),
                _stateType: 'add',
                ParameterName: value.Column,
                ParameterValue: value.DefaultValue || ''
            };
        });
        this.props.data.NSDevicesCommunicateDataBlock.push({
            DataBlockID: '',
            _uuid: index_3.uuid(),
            _stateType: 'add',
            NSDevicesCommunicateDataBlockParameter: value
        });
        this.setState(this.state);
    }
    onChange(e) {
        let target = e.target;
        this.props.data.DriverDeviceID = target.value;
        if (!this.props.data._stateType) {
            this.props.data._stateType = 'update';
        }
        this.setState(this.state);
    }
    onDel(index) {
        if (this.props.data.NSDevicesCommunicateDataBlock.length === 1) {
            index_1.message.error('最后一个数据块不可删除！');
            return;
        }
        let data = this.props.data.NSDevicesCommunicateDataBlock[index];
        if (!data._stateType) {
            data._stateType = 'delete';
        }
        else {
            this.props.data.NSDevicesCommunicateDataBlock.splice(index, 1);
        }
        this.setState(this.state);
    }
    render() {
        let { state, props } = this;
        let { data } = props;
        return (React.createElement("section", { className: 'device-add-content' },
            React.createElement("section", { className: 'cf' },
                React.createElement("section", { className: 'device-add-box', onChange: this.onChange.bind(this) },
                    React.createElement("table", { className: 'table-from' },
                        React.createElement("tbody", null,
                            React.createElement("tr", null,
                                React.createElement("td", null, "\u8BBE\u5907")),
                            React.createElement("tr", null,
                                React.createElement("td", null,
                                    React.createElement(index_1.Input, { "data-key": 'title', onChange: this.onChange.bind(this), value: data.DriverDeviceID, placeholder: '请输入' }))))),
                    React.createElement("div", { className: 'tr' },
                        React.createElement(index_5.default, { value: '/device/devices/update/nsDevicesDriver:removeLogicDevice' },
                            React.createElement(index_1.Button, { onClick: () => this.props.onDel() }, "\u5220\u9664")),
                        React.createElement(index_5.default, { value: '/device/devices/update/nsDevicesDriver:addDataBlock' },
                            React.createElement(index_1.Button, { onClick: () => this.dataBlockAdd(), className: 'ml20' }, "\u65B0\u589E\u6570\u636E\u5757")))),
                React.createElement(CommParam, { data: data.NSDevicesCommunicateParameter, template: props.template.NSDevicesCommunicateParameter })),
            props.data.NSDevicesCommunicateDataBlock.map((value, index) => {
                if (value._stateType !== 'delete') {
                    value._uuid = value._uuid || index_3.uuid();
                    return React.createElement(DataBlock, { template: props.template.NSDevicesCommunicateDataBlockParameter, data: value, key: value._uuid, onDel: () => this.onDel(index) });
                }
            })));
    }
}
;
;
/**
 * 通讯参数
 *
 * @class CommunicationParameters
 * @extends {PureComponentGenerics<ICommParamProps, ICommParamState>}
 */
class CommParam extends React.Component {
    render() {
        let { state, props } = this;
        let { data } = props;
        let template = props.template.filter(value => value.Column !== 'Enabled');
        let checkedBox = props.template.find(value => value.Column === 'Enabled');
        return (React.createElement("section", { className: 'comm-param' },
            React.createElement("div", { className: 'comm-param-title' }, "\u901A\u8BAF\u53C2\u6570"),
            React.createElement(Parameter, { data: data, template: checkedBox }),
            React.createElement("table", { className: 'table-from table-from-sm mr20' }, template.map((value, index) => {
                if (index % 2 === 0) {
                    let tr2 = template[index + 1];
                    return React.createElement("tbody", { key: index },
                        React.createElement("tr", null,
                            React.createElement("td", null, value.ColumnHeader),
                            tr2 && React.createElement("td", null, tr2.ColumnHeader)),
                        React.createElement("tr", null,
                            React.createElement("td", null,
                                React.createElement(Parameter, { data: data, template: value })),
                            tr2 && React.createElement("td", null,
                                React.createElement(Parameter, { data: data, template: tr2 }))));
                }
            }))));
    }
}
;
;
/**
 * 数据块
 *
 * @class DataBlock
 * @extends {PureComponentGenerics<IDataBlockProps, IDataBlockState>}
 */
class DataBlock extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            name: ''
        };
    }
    onChange(e) {
        let target = e.target;
        this.props.data.DataBlockID = target.value;
        if (!this.props.data._stateType) {
            this.props.data._stateType = 'update';
        }
        this.setState(this.state);
    }
    render() {
        let { state, props } = this;
        let data = props.data.NSDevicesCommunicateDataBlockParameter;
        let checkedBox = props.template.find(value => value.Column === 'Enabled');
        let template = props.template.filter(value => value.Column !== 'Enabled');
        return (React.createElement("section", { className: 'comm-param data-block' },
            React.createElement("div", { className: 'comm-param-title' },
                "\u6570\u636E\u5757",
                React.createElement(index_5.default, { value: '/device/devices/update/nsDevicesDriver:removeDataBlock' },
                    React.createElement(index_1.Button, { className: 'btn-del', onClick: () => this.props.onDel() }, "\u5220\u9664"))),
            React.createElement(Parameter, { data: data, template: checkedBox }),
            React.createElement("table", { className: 'table-from table-from-sm mr20' },
                React.createElement("tbody", null,
                    React.createElement("tr", null,
                        React.createElement("td", null, "\u6570\u636E\u5757\u540D\u79F0")),
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement(index_1.Input, { value: props.data.DataBlockID, onChange: this.onChange.bind(this) })))),
                template.map((value, index) => {
                    return React.createElement("tbody", { key: value.Column },
                        React.createElement("tr", null,
                            React.createElement("td", null, value.ColumnHeader)),
                        React.createElement("tr", null,
                            React.createElement("td", null,
                                React.createElement(Parameter, { data: data, template: value }))));
                }))));
    }
}
;
;
/**
 * 新增驱动
 *
 * @class DriveAdd
 * @extends {PureComponentGenerics<IDriveAddProps, IDriveAddState>}
 */
class DriveAdd extends React.Component {
    render() {
        return (React.createElement("section", { className: 'drive-add' },
            React.createElement("table", { className: 'table-from table-from-sm' },
                React.createElement("tbody", null,
                    React.createElement("tr", null,
                        React.createElement("td", null, "\u9A71\u52A8")),
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement(index_1.Select, { style: { width: '100%' }, defaultValue: '1' },
                                React.createElement(index_1.Option, { value: '1' }, "\u5206\u7EC41"),
                                React.createElement(index_1.Option, { value: '2' }, "\u5206\u7EC42"),
                                React.createElement(index_1.Option, { value: '3' }, "\u5206\u7EC4"))))))));
    }
}
;
;
class Parameter extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {};
        this.data = this.props.data.find(data => data.ParameterName === this.props.template.Column);
    }
    onChangeInput(e) {
        let target = e.target;
        this.changeValue(target.value);
    }
    onChangeSelect(value) {
        this.changeValue(value);
    }
    onChangeSwitch(value) {
        this.changeValue(value ? '1' : '0');
    }
    changeValue(value) {
        this.data.ParameterValue = value;
        if (!this.data._stateType) {
            this.data._stateType = 'update';
        }
        this.setState(this.state);
    }
    onBlur(e) {
        return __awaiter(this, void 0, void 0, function* () {
            let target = e.target;
            let value = target.value;
            if (this.data.ParameterName === 'CommParameter') {
                let str = value.match(/^[^,]+,/g);
                if (str) {
                    let bl = yield this.ajaxCheck(str[0]);
                    if (!bl) {
                        this.data._stateType = 'fail';
                        index_1.message.error('通信参数端口号重复！');
                    }
                }
            }
        });
    }
    ajaxCheck(port) {
        return __awaiter(this, void 0, void 0, function* () {
            let { data } = yield index_2.get('/check_driver_com_port', {
                deviceId: value_1.default.query['DeviceID'],
                comPort: port
            });
            return data['result'];
        });
    }
    objectToArray(object) {
        let arr = [];
        for (let key in object) {
            if (object.hasOwnProperty(key)) {
                let element = object[key];
                arr.push({
                    value: key,
                    text: element
                });
            }
        }
        return arr;
    }
    render() {
        let { props } = this;
        let value = this.data.ParameterValue;
        switch (props.template.ControlType) {
            case 'CheckBox':
                return React.createElement(index_1.Switch, { onChange: this.onChangeSwitch.bind(this), checked: value === '1' ? true : false });
            case 'ComboBox':
                let arr = this.objectToArray(props.template.Val2Disp);
                return React.createElement(index_1.Select, { value: value, style: { width: '100%' }, onChange: this.onChangeSelect.bind(this) }, arr.map((value, index) => {
                    return React.createElement(index_1.Option, { key: index, value: value.value }, value.text);
                }));
            default:
                return React.createElement(index_1.Input, { value: value, onBlur: this.onBlur.bind(this), onChange: this.onChangeInput.bind(this), placeholder: '' });
        }
    }
}
});
//# sourceMappingURL=_drive.js.map
