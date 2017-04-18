define("pages/model/system/_update.js",function(require, exports, module) {
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
const index_2 = require("../../../components/template-table/index");
const index_3 = require("../../../components/template-input/index");
const index_4 = require("../../../components/antd/index");
require("./index.css");
const _variable_1 = require("../../device/device/add/_variable");
const index_5 = require("../../../components/util/index");
/**
 * 页面权限
 *
 */
exports.privileges = '/device/devices/add';
;
;
/**
 * 设备管理页面
 *
 * @export
 * @class Device
 * @extends {PageGenerics<IDeviceProps, IDeviceState>}
 */
class Device extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            data: [],
            name: null,
            template: [],
            activeKey: '1'
        };
    }
    ajaxGetData() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.props.data.level !== 'model') {
                let temUrl = this.props.type === 'system' ? '/system_model_node_template' : '/custom_model_node_template';
                let { data } = yield index_1.get(temUrl, {
                    modelName: this.props.modelName
                });
                this.state.template = data.ModelTemplate.Props.filter(value => value.Name !== 'Index');
                let detailData = yield index_1.get('/model_node_detail', {
                    modelName: this.props.modelName,
                    nodeName: this.props.name
                });
                this.state.data = index_3.objectToArray(detailData.data.Model);
                this.setState(this.state);
            }
            else {
                let { data } = yield index_1.get('/model_template');
                this.state.template = data.ModelTemplate.Props;
                let detailData = yield index_1.get('/model_detail', {
                    modelName: this.props.modelName
                });
                this.state.data = index_3.objectToArray(detailData.data.Model);
                this.setState(this.state);
            }
        });
    }
    ajaxSave() {
        return __awaiter(this, void 0, void 0, function* () {
            let newName = this.state.data.find(value => value.ParameterName === 'Name').ParameterValue;
            if (this.props.data.level === 'model') {
                yield index_1.post('/modify_model', {
                    modelName: this.props.modelName,
                    props: {
                        Models: this.state.data
                    }
                });
                if (newName !== this.props.modelName) {
                    // location.reload();
                    this.state.name = newName;
                }
            }
            else {
                yield index_1.post('/modify_model_node', {
                    nodeName: this.props.name,
                    modelName: this.props.modelName,
                    props: {
                        ModelNodes: this.state.data
                    }
                });
                if (newName !== this.props.name) {
                    // location.reload();
                    this.state.name = newName;
                }
            }
            index_4.message.success('修改成功！');
        });
    }
    tabBarExtraContentRender() {
        if (this.state.activeKey === '1') {
            return React.createElement(index_4.Button, { privileges: '/department/users/update:save', className: 'ml20', type: 'primary', onClick: this.ajaxSave.bind(this) }, "\u4FDD\u5B58");
        }
        else {
            return React.createElement("span", null,
                React.createElement(index_4.Button, { className: 'ml20', onClick: () => {
                        this.refs['content'].modalShow();
                    } }, "\u65B0\u589E\u7D22\u5F15"),
                React.createElement(index_4.Button, { className: 'ml20', type: 'primary', onClick: () => {
                        this.refs['content'].ajaxUpdate();
                    } }, "\u4FDD\u5B58"));
        }
    }
    render() {
        let { state, props } = this;
        return React.createElement("section", { className: 'main-right' },
            React.createElement("section", { className: 'main-right-tabs' },
                React.createElement("div", { className: 'main-right-tabs-left ml20 mr20' },
                    React.createElement(index_4.Button, { onClick: () => this.props.onReturn(state.name) }, "\u8FD4\u56DE")),
                React.createElement(index_4.Tabs, { activeKey: this.state.activeKey, type: 'card', onChange: (key) => {
                        this.state.activeKey = key;
                        this.setState(this.state);
                    }, tabBarExtraContent: this.tabBarExtraContentRender() },
                    React.createElement(index_4.TabPane, { tab: '数据属性', key: '1' },
                        React.createElement("section", { className: 'main-right-content page-deviceadd ' },
                            React.createElement(index_2.default, { data: this.state.data, template: state.template }))),
                    this.props.data.level !== 'model' &&
                        React.createElement(index_4.TabPane, { tab: '索引', key: '2' },
                            React.createElement("section", { className: 'main-right-content page-deviceadd ' },
                                React.createElement(TableContent, { ref: 'content', showText: 'Name', name: props.name, modelName: props.modelName }))))));
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.modelName !== nextProps.modelName || this.props.name !== nextProps.name) {
            this.props = nextProps;
            this.componentDidMount();
        }
    }
    /**
     * 组件渲染完毕获取ajax数据
     *
     *
     * @memberOf Device
     */
    componentDidMount() {
        this.ajaxGetData();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Device;
class TableContent extends _variable_1.default {
    constructor() {
        super(...arguments);
        this.banArray = ['Name'];
    }
    ajaxGetDate() {
        return __awaiter(this, void 0, void 0, function* () {
            let { data } = yield index_1.get('/model_nodeindex', {
                modelName: this.props.modelName,
                nodeName: this.props.name
            });
            let indexDataTemplate = yield index_1.get('/model_nodeindex_template', {
                modelName: this.props.modelName,
                nodeName: this.props.name
            });
            this.state.template = indexDataTemplate.data.ModelTemplate.Props;
            data['ModelNodeIndex'].forEach((value, index) => {
                for (let key in value) {
                    if (value.hasOwnProperty(key)) {
                        let element = value[key];
                        value[key] = {
                            ParameterName: key,
                            ParameterValue: element
                        };
                    }
                }
                value.key = index_5.uuid();
            });
            return data['ModelNodeIndex'];
        });
    }
    ajaxUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            let updateList = [];
            this.state.data.forEach(value => {
                let obj = {};
                for (let key in value) {
                    let element = value[key];
                    delete element['_stateType'];
                    if (key !== 'key') {
                        obj[key] = element.ParameterValue;
                    }
                }
                updateList.push(obj);
            });
            yield index_1.post('/upsert_model_nodeindex', {
                modelName: this.props.modelName,
                nodeName: this.props.name,
                props: updateList
            });
            // this.componentWillMount();
            index_4.message.success('保存成功!');
        });
    }
    getData(categroy) {
        return __awaiter(this, void 0, void 0, function* () {
            this.state.loading = true;
            this.setState(this.state);
            let data = yield this.ajaxGetDate();
            this.state.loading = false;
            // this.state.data = [data[this.props.categroy][0]];
            this.state.data = data;
            this.state._ID = data._ID;
            this.saveColums();
            this.setState(this.state);
        });
    }
    modalShow() {
        this.refs['SelectMember'].modalShow(true);
    }
    onOk(selectedRows) {
        selectedRows.forEach(value => {
            this.state.data.push(this.getTemplateData(value));
        });
        this.setState(this.state);
    }
    getTemplateData(obj) {
        let data = {
            key: index_5.uuid()
        };
        this.state.template.forEach(value => {
            let key = value['Name'];
            data[key] = {
                ParameterName: key,
                ParameterValue: obj[key] || ''
            };
        });
        return data;
    }
    additional() {
        return React.createElement(SelectMember, { ref: 'SelectMember', onOk: this.onOk.bind(this), modelName: this.props.modelName, name: this.props.name });
    }
}
;
;
class SelectMember extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            visible: false,
            loading: true,
            selectedRows: [],
            selectedRowKeys: [],
            data: []
        };
        this.columns = [
            {
                title: '名称',
                dataIndex: 'Name',
                key: 'Name'
            },
            {
                title: '描述',
                dataIndex: 'Description',
                key: 'Description'
            }
        ];
    }
    modalShow(bl) {
        if (bl && this.state.data.length === 0) {
            this.getNSDevicesVarInfoList();
        }
        this.setState({
            visible: bl
        });
    }
    ajaxGetDate() {
        return __awaiter(this, void 0, void 0, function* () {
            let { data } = yield index_1.get('/model_nodeindex_property', {
                modelName: this.props.modelName,
                nodeName: this.props.name
            });
            this.state.data = data.ModelNodeIndexProperty;
            this.state.data.forEach((value, index) => {
                value.key = value.Name;
            });
            return data;
        });
    }
    getNSDevicesVarInfoList() {
        return __awaiter(this, void 0, void 0, function* () {
            this.state.loading = true;
            let data = yield this.ajaxGetDate();
            this.state.loading = false;
            this.setState(this.state);
        });
    }
    handleOk() {
        this.props.onOk(this.state.selectedRows);
        this.modalShow(false);
        // 清空选中
        this.state.selectedRowKeys = [];
        this.state.selectedRows = [];
    }
    selectChange(selectedRowKeys) {
        this.state.selectedRowKeys = selectedRowKeys;
        this.state.selectedRows = [];
        this.state.selectedRowKeys.forEach((value, index) => {
            let data = this.state.data.find(data => data['key'] === value);
            this.state.selectedRows.push(data);
        });
        this.setState(this.state);
    }
    render() {
        let { state, props } = this;
        return React.createElement(index_4.Modal, { title: '选择人员', visible: this.state.visible, onOk: this.handleOk.bind(this), onCancel: () => this.modalShow(false) },
            React.createElement("div", { className: 'modal-Content' },
                React.createElement(index_4.Table, { className: 'edit-table mt20', loading: state.loading, dataSource: this.state.data, columns: this.columns, pagination: false, scroll: { y: 400 }, rowSelection: {
                        selectedRowKeys: state.selectedRowKeys,
                        onChange: this.selectChange.bind(this)
                    } })));
    }
}
exports.SelectMember = SelectMember;
});
//# sourceMappingURL=_update.js.map
