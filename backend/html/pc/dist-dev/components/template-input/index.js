define("components/template-input/index.js",function(require, exports, module) {
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const index_1 = require("../ajax/index");
const index_2 = require("../antd/index");
const React = require("react");
const moment = require("moment");
const index_3 = require("../switch-text/index");
const index_4 = require("../map-input/index");
const selectTree_1 = require("../../pages/device/selectTree/selectTree");
const _tree_1 = require("../../pages/model/system/_tree");
class DeviceDataOperation {
    constructor(categroy, deviceId, data, template) {
        this.categroy = categroy;
        this.deviceId = deviceId;
        this.data = data;
        this.template = template;
    }
    /**
     * 获取值
     *
     * @param {string} key
     * @returns
     *
     * @memberOf DeviceClass
     */
    getValue(key) {
        let data = this.data.find(value => value.ParameterName === key);
        return data && data.ParameterValue;
    }
    /**
     * 更新值
     *
     * @param {string} key
     * @param {string} value
     *
     * @memberOf DeviceDrive
     */
    update(key, value) {
        let data = this.data.find(value => value.ParameterName === key);
        if (data) {
            if (!data._stateType) {
                data._stateType = 'update';
            }
            data.ParameterValue = value;
        }
        else {
            this.data.push({
                ParameterValue: value,
                ParameterName: key,
                _stateType: 'update'
            });
        }
    }
    getData() {
        let data = JSON.parse(JSON.stringify(this.data));
        data.forEach(value => {
            if (value.ParameterName === 'Organization') {
                value.ParameterValue = value.ParameterValue.map(value => {
                    return value.Path[value.Path.length - 1].ID;
                });
            }
            if (value.ParameterName === 'Area') {
                value.ParameterValue = value.ParameterValue.map(value => {
                    return value.Path[value.Path.length - 1].ID;
                });
            }
            if (value.ParameterName === 'ID') {
                value.ParameterValue = value.ParameterValue.map(value => {
                    return value.ID;
                });
            }
        });
        return data;
    }
    getData2() {
        let data = JSON.parse(JSON.stringify(this.data.filter(value => value._stateType === 'update')));
        data.forEach(value => {
            if (value.ParameterName === 'Organization') {
                value.ParameterValue = value.ParameterValue.map(value => {
                    return value.Path[value.Path.length - 1].ID;
                });
                value.OriginalParameterValue = value.OriginalParameterValue.map(value => {
                    return value.Path[value.Path.length - 1].ID;
                });
                return;
            }
            if (value.ParameterName === 'Area') {
                value.ParameterValue = value.ParameterValue.map(value => {
                    return value.Path[value.Path.length - 1].ID;
                });
                value.OriginalParameterValue = value.OriginalParameterValue.map(value => {
                    return value.Path[value.Path.length - 1].ID;
                });
                return;
            }
            delete value.OriginalParameterValue;
        });
        console.log(data);
        return data;
    }
    /**
     * 获取ajax data
     *
     * @returns
     *
     * @memberOf DeviceDrive
     */
    getUpdate() {
        let data = JSON.parse(JSON.stringify(this.data.filter(value => value._stateType === 'update')));
        data.forEach(value => {
            if (value.ParameterName === 'Organization') {
                value.ParameterValue = value.ParameterValue.map(value => {
                    return value.Path[value.Path.length - 1].ID;
                });
            }
            else if (value.ParameterName === 'Area') {
                value.ParameterValue = value.ParameterValue.map(value => {
                    return value.Path[value.Path.length - 1].ID;
                });
            }
            else if (value.ParameterName === 'Role') {
                value.ParameterValue = value.ParameterValue.map(value => {
                    return value.ID;
                });
            }
        });
        // 添加hidden的值
        // this.template.forEach(value => {
        //     if (value.Form && value.Form.Type === 'Hidden') {
        //         let dev = this.data.find(devices => devices.ParameterName === value.Name);
        //         data.push(dev);
        //     }
        // });
        return data;
    }
    /**
     * ajax修改
     *
     *
     * @memberOf DeviceClass
     */
    ajaxUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            let { data } = yield index_1.post('/modified_device', {
                deviceId: [this.deviceId],
                props: {
                    ['${this.categroy}']: this.getUpdate()
                }
            });
            // this.setState(this.state);
            index_2.message.success('修改成功！');
        });
    }
}
exports.DeviceDataOperation = DeviceDataOperation;
;
;
class ParameterText extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {};
    }
    render() {
        let { props } = this;
        let value = props.data ? props.data.ParameterValue : '';
        let from = props.template.Form;
        let text = value;
        switch (from && from.Type) {
            case 'ComboBox':
                let data = from.Options.find(option => option.Key === value);
                text = data ? data.Value : '';
                break;
            case 'MapPicker':
                let latitude = this.props.dataList.find(value => value.ParameterName === 'Latitude').ParameterValue;
                text = latitude + ',' + value;
                break;
            case 'Switch':
                if (!from.Options) {
                    from.Options = [{ Value: '禁用', Key: '0' }, { Value: '启用', Key: '1' }];
                }
                let Sdata = from.Options.find(val => val.Key === value);
                text = Sdata ? Sdata.Value : '';
                break;
            case 'OrgPicker':
                text = value.map((value, index) => {
                    return React.createElement("span", { key: index },
                        this.getPath(value.Path),
                        React.createElement("br", null));
                });
                break;
        }
        return React.createElement("span", null, text);
    }
    getPath(value) {
        let text = '';
        value.forEach(value => {
            text += value.Name + '-';
        });
        text = text.replace(/\-$/g, '');
        ;
        return text;
    }
}
exports.ParameterText = ParameterText;
const dateFormat = 'YYYY/MM/DD HH:mm';
;
;
class TemplateInput extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {};
    }
    onChangeInput(e) {
        let target = e.target;
        this.changeValue(target.value);
    }
    onChangeSwitch(value) {
        this.changeValue(value ? '1' : '0');
    }
    onChangeSelect(value) {
        this.changeValue(value);
    }
    onChangeDatePicker(value, text) {
        this.changeValue(text);
    }
    changeValue(value) {
        let { props } = this;
        props.data.ParameterValue = value;
        if (!props.data._stateType) {
            props.data._stateType = 'update';
        }
        if (this.props.onChange) {
            this.props.onChange();
        }
        this.setState(this.state);
    }
    onOkMapInput(value) {
        let latitude = this.props.dataList.find(value => value.ParameterName === 'Latitude');
        latitude.ParameterValue = value.latitude;
        if (!latitude._stateType) {
            latitude._stateType = 'update';
        }
        this.changeValue(value.longitude);
    }
    render() {
        let { props } = this;
        let value = props.data.ParameterValue;
        let from = props.template.Form;
        switch (from && from.Type) {
            case 'ComboBox':
                let data = from.Options || [];
                return React.createElement(index_2.Select, { value: value, style: { width: '100%' }, onChange: this.onChangeSelect.bind(this) }, data.map((value, index) => {
                    return React.createElement(index_2.Option, { key: value.Key, value: value.Key }, value.Value);
                }));
            case 'Switch':
                return React.createElement(index_2.Switch, { checked: value === '1' ? true : false, onChange: this.onChangeSwitch.bind(this) });
            case 'DateTimePicker':
                return React.createElement(index_2.DatePicker, { value: value && moment(value, dateFormat), style: { width: '100%' }, format: dateFormat, onChange: this.onChangeDatePicker.bind(this), showTime: true });
            case 'MapPicker':
                let latitude = this.props.dataList.find(value => value.ParameterName === 'Latitude').ParameterValue;
                return React.createElement(index_4.default, { value: {
                        latitude: latitude,
                        longitude: value
                    }, onOK: this.onOkMapInput.bind(this) });
            case 'RelatedRole':
                value = value || [];
                // props.data['OriginalParameterValue'] = value.map(value => {
                //     return value.Path[value.Path.length - 1].ID
                // });
                return React.createElement(RoleInput, { value: value, onChange: value => this.changeValue(value) });
            case 'OrgPicker':
                value = value || [];
                // props.data['OriginalParameterValue'] = value.map(value => {
                //     return value.Path[value.Path.length - 1].ID
                // });
                return React.createElement(TreeInput, { value: value || [], onChange: value => this.changeValue(value) });
            case 'AreaPicker':
                return React.createElement(TreeInput, { type: 'region_tree', value: value || [], onChange: value => this.changeValue(value) });
            case 'SystemDataNodePicker':
                return React.createElement(TreeNode, { value: value, onChange: value => this.changeValue(value) });
            case 'CustomDataNodePicker':
                return React.createElement(TreeNodeCustom, { value: value, onChange: value => this.changeValue(value) });
            default:
                return React.createElement(index_2.Input, { value: value, onChange: this.onChangeInput.bind(this), placeholder: '' });
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TemplateInput;
;
;
class TextInput extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {};
    }
    render() {
        let { state, props } = this;
        let { template, data } = props;
        return (React.createElement(index_3.default, { defaultShow: this.props.defaultShow, text: React.createElement(ParameterText, { template: template, data: data }), input: React.createElement(TemplateInput, { template: template, data: data, onChange: () => {
                    this.setState(this.state);
                } }) }));
    }
}
exports.TextInput = TextInput;
/**
 * 对象转数组
 *
 * @export
 * @param {{ [key: string]: any }} data
 * @returns {NSDevices[]}
 */
function objectToArray(data) {
    let array = [];
    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            let element = data[key];
            array.push({
                ParameterName: key,
                ParameterValue: element
            });
        }
    }
    return array;
}
exports.objectToArray = objectToArray;
function objectToArray2(data) {
    let array = [];
    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            let element = data[key];
            array.push({
                ParameterName: key,
                ParameterValue: element,
                OriginalParameterValue: JSON.parse(JSON.stringify(element))
            });
        }
    }
    return array;
}
exports.objectToArray2 = objectToArray2;
/**
 * 数组转对象
 *
 * @param {NSDevices[]} data
 * @returns {{ [key: string]: any }}
 */
function arrayToObject(data) {
    let obj = {};
    data.forEach(value => {
        obj[value.ParameterName] = value.ParameterValue;
    });
    return obj;
}
exports.arrayToObject = arrayToObject;
;
;
class RoleInput extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            data: [],
            visible: false,
            value: this.props.value.map(value => value.ID)
        };
    }
    ajaxGet() {
        return __awaiter(this, void 0, void 0, function* () {
            let { data } = yield index_1.get('/sys/role_list', {
                pageSize: 100,
                pageIndex: 1
            });
            this.state.data = data.roleList;
            this.setState(this.state);
        });
    }
    getPlainOptions() {
        return this.state.data.map(value => {
            return {
                label: value['Name'],
                value: value['ID']
            };
        });
    }
    onChange(value) {
        this.state.value = value;
        this.setState(this.state);
    }
    onDeselect() {
        console.log(1);
    }
    onClick() {
        this.state.value = this.props.value.map(value => value.ID);
        this.state.visible = true;
        this.setState(this.state);
    }
    onOk() {
        this.state.visible = false;
        this.setState(this.state);
        let newData = this.state.value.map(value => {
            return this.state.data.find(data => data.ID === value);
        });
        this.props.onChange(newData);
    }
    onDelClick(event, i) {
        this.props.onChange(this.props.value.filter((value, index) => index !== i));
        event.stopPropagation();
    }
    getName(value) {
        let obj = this.state.data.find(obj => obj.ID === value);
        return obj ? obj['Name'] : '';
    }
    render() {
        let { props, state } = this;
        return (React.createElement("span", null,
            React.createElement("div", { className: 'ant-select ant-select-enabled', style: { width: '100%' }, onClick: this.onClick.bind(this) },
                React.createElement("div", { className: 'ant-select-selection  ant-select-selection--multiple', role: 'combobox', "aria-autocomplete": 'list', "aria-haspopup": 'true', "aria-expanded": 'false' },
                    React.createElement("div", { className: 'ant-select-selection__rendered' },
                        React.createElement("ul", null, this.props.value.map((value, index) => React.createElement("li", { key: index, unselectable: true, className: 'ant-select-selection__choice', title: '11', style: { userSelect: 'none' } },
                            React.createElement("div", { className: 'ant-select-selection__choice__content' }, value.Name),
                            React.createElement("span", { onClick: (e) => this.onDelClick(e, index), className: 'ant-select-selection__choice__remove' }))))))),
            React.createElement(index_2.Modal, { title: '请选择', visible: state.visible, onOk: this.onOk.bind(this), onCancel: () => {
                    this.state.visible = false;
                    this.setState(this.state);
                } },
                React.createElement(index_2.CheckboxGroup, { options: this.getPlainOptions(), value: this.state.value, onChange: this.onChange.bind(this) }))));
    }
    /**
     * 组件渲染完毕获取ajax数据
     *
     *
     * @memberOf RoleInput
     */
    componentDidMount() {
        this.ajaxGet();
    }
}
;
;
class TreeInput extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            data: [],
            visible: false,
            value: this.props.value
        };
    }
    onOk() {
        this.state.visible = false;
        this.setState(this.state);
        this.props.onChange(this.state.value);
    }
    onClick() {
        this.state.value = Object.assign([], this.props.value);
        this.state.visible = true;
        this.setState(this.state);
    }
    onDelClick(event, i) {
        this.props.onChange(this.props.value.filter((value, index) => index !== i));
        event.stopPropagation();
    }
    getValueArray() {
        return this.props.value.map(value => {
            let obj = value.Path[value.Path.length - 1];
            return {
                id: obj.ID,
                name: obj.Name
            };
        });
    }
    onGetNode(value) {
        let obj = value.map(value => {
            return {
                Path: [{
                        ID: value.id,
                        Name: value.name
                    }]
            };
        });
        this.state.value = obj;
    }
    render() {
        let { props, state } = this;
        return (React.createElement("span", null,
            React.createElement("div", { className: 'ant-select ant-select-enabled', style: { width: '100%' }, onClick: this.onClick.bind(this) },
                React.createElement("div", { className: 'ant-select-selection  ant-select-selection--multiple', role: 'combobox', "aria-autocomplete": 'list', "aria-haspopup": 'true', "aria-expanded": 'false' },
                    React.createElement("div", { className: 'ant-select-selection__rendered' },
                        React.createElement("ul", null, this.props.value.map((value, index) => React.createElement("li", { key: index, unselectable: true, className: 'ant-select-selection__choice', title: '11', style: { userSelect: 'none' } },
                            React.createElement("div", { className: 'ant-select-selection__choice__content' }, value.Path[value.Path.length - 1].Name),
                            React.createElement("span", { onClick: (e) => this.onDelClick(e, index), className: 'ant-select-selection__choice__remove' }))))))),
            React.createElement(index_2.Modal, { title: '请选择', visible: state.visible, onOk: this.onOk.bind(this), onCancel: () => {
                    this.state.visible = false;
                    this.setState(this.state);
                } },
                React.createElement(selectTree_1.MyTreeSelect, { onGetNode: this.onGetNode.bind(this), treeType: this.props.type || 'department_tree', value: this.getValueArray(), multiple: true }))));
    }
}
;
;
class TreeNode extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            data: this.props.value,
            visible: false,
            value: this.props.value
        };
    }
    onDelClick(event) {
        this.props.onChange(null);
        event.stopPropagation();
    }
    onOk() {
        this.refs['system'].clearValue();
        this.state.visible = false;
        this.setState(this.state);
        this.props.onChange(this.state.value);
    }
    onClick() {
        this.state.value = Object.assign([], this.props.value);
        this.state.visible = true;
        this.setState(this.state);
    }
    onChange(value) {
        this.state.value = {
            DataModel: value.ModelName,
            DataNode: value.Name
        };
    }
    render() {
        let { props, state } = this;
        return (React.createElement("span", null,
            React.createElement("div", { className: 'ant-select ant-select-enabled', style: { width: '100%' }, onClick: this.onClick.bind(this) },
                React.createElement("div", { className: 'ant-select-selection  ant-select-selection--multiple', role: 'combobox', "aria-autocomplete": 'list', "aria-haspopup": 'true', "aria-expanded": 'false' },
                    React.createElement("div", { className: 'ant-select-selection__rendered' },
                        React.createElement("ul", null, this.props.value &&
                            React.createElement("li", { unselectable: true, className: 'ant-select-selection__choice', title: '11', style: { userSelect: 'none' } },
                                React.createElement("div", { className: 'ant-select-selection__choice__content' }, this.props.value.DataNode),
                                React.createElement("span", { onClick: (e) => this.onDelClick(e), className: 'ant-select-selection__choice__remove' })))))),
            React.createElement(index_2.Modal, { title: '请选择', visible: state.visible, onOk: this.onOk.bind(this), onCancel: () => {
                    this.refs['system'].clearValue();
                    this.state.visible = false;
                    this.setState(this.state);
                } },
                React.createElement(_tree_1.CheckTree, { ref: 'system', type: 'system', defaultValue: props.value && {
                        ModelName: props.value.DataModel,
                        Name: props.value.DataNode
                    }, onChange: this.onChange.bind(this) }))));
    }
}
;
class TreeNodeCustom extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            data: this.props.value,
            visible: false,
            value: this.props.value
        };
    }
    onDelClick(event) {
        this.props.onChange(null);
        event.stopPropagation();
    }
    onOk() {
        this.refs['system'].clearValue();
        if (this.refs['custom']) {
            this.refs['custom'].clearValue();
        }
        this.state.visible = false;
        this.setState(this.state);
        this.props.onChange(this.state.value);
    }
    onClick() {
        this.state.value = Object.assign([], this.props.value);
        this.state.visible = true;
        this.setState(this.state);
    }
    onChange(value) {
        this.state.value = {
            DataModel: value.ModelName,
            DataNode: value.Name
        };
    }
    render() {
        let { props, state } = this;
        return (React.createElement("span", null,
            React.createElement("div", { className: 'ant-select ant-select-enabled', style: { width: '100%' }, onClick: this.onClick.bind(this) },
                React.createElement("div", { className: 'ant-select-selection  ant-select-selection--multiple', role: 'combobox', "aria-autocomplete": 'list', "aria-haspopup": 'true', "aria-expanded": 'false' },
                    React.createElement("div", { className: 'ant-select-selection__rendered' },
                        React.createElement("ul", null, this.props.value &&
                            React.createElement("li", { unselectable: true, className: 'ant-select-selection__choice', title: '11', style: { userSelect: 'none' } },
                                React.createElement("div", { className: 'ant-select-selection__choice__content' }, this.props.value.DataNode),
                                React.createElement("span", { onClick: (e) => this.onDelClick(e), className: 'ant-select-selection__choice__remove' })))))),
            React.createElement(index_2.Modal, { title: '请选择', visible: state.visible, onOk: this.onOk.bind(this), onCancel: () => {
                    this.refs['system'].clearValue();
                    if (this.refs['custom']) {
                        this.refs['custom'].clearValue();
                    }
                    this.state.visible = false;
                    this.setState(this.state);
                } },
                React.createElement(index_2.Tabs, { type: 'card' },
                    React.createElement(index_2.TabPane, { tab: '系统', key: '1' },
                        React.createElement(_tree_1.CheckTree, { ref: 'system', type: 'system', defaultValue: props.value && {
                                ModelName: this.props.value.DataModel,
                                Name: this.props.value.DataNode
                            }, onChange: this.onChange.bind(this) })),
                    React.createElement(index_2.TabPane, { tab: '用户', key: '2' },
                        React.createElement(_tree_1.CheckTree, { ref: 'custom', type: 'custom', defaultValue: props.value && {
                                ModelName: this.props.value.DataModel,
                                Name: this.props.value.DataNode
                            }, onChange: this.onChange.bind(this) }))))));
    }
}
});
//# sourceMappingURL=index.js.map
