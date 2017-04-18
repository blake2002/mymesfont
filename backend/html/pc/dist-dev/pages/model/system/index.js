define("pages/model/system/index.js",function(require, exports, module) {
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
const index_2 = require("../../../components/ajax/index");
const _tree_1 = require("./_tree");
const index_3 = require("../../../components/template-input/index");
const _update_1 = require("./_update");
const _variable_1 = require("../../device/device/add/_variable");
const index_4 = require("../../../components/util/index");
const index_5 = require("../../../components/template-input/index");
require("./index.css");
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
class Device extends components_1.PageGenerics {
    constructor() {
        super(...arguments);
        this.state = {
            name: this.props.query.name,
            modelName: this.props.query.modelName,
            tabKey: '1',
            treeType: 'system',
            treeData: {},
            contentType: 'index'
        };
        this.columns = [{
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
                key: '5'
            }];
    }
    getType() {
        if (this.state.modelName && this.state.name) {
            return 'node';
        }
        else if (this.state.modelName) {
            return 'model';
        }
    }
    onChangeTabs(key) {
        this.props.jump('/model/system/cluster');
    }
    navRender() {
        return React.createElement(index_1.Tabs, { type: 'card', activeKey: this.state.tabKey, onChange: this.onChangeTabs.bind(this), tabBarExtraContent: this.menuRender() },
            React.createElement(index_1.TabPane, { tab: '设计时', key: '1' }),
            React.createElement(index_1.TabPane, { tab: '运行时', key: '2' }));
    }
    menuRender() {
        let level = this.state.treeData.level;
        if (level === 'level2' || level === 'level3+') {
            return React.createElement("section", null,
                React.createElement(index_1.Button, { className: 'ml20', onClick: () => {
                        this.refs['NodeContent'].add();
                    } }, "\u65B0\u589E\u5C5E\u6027"),
                React.createElement(index_1.Button, { className: 'ml20', onClick: () => {
                        this.refs['NodeContent'].moveUp();
                    } }, "\u4E0A\u79FB"),
                React.createElement(index_1.Button, { className: 'ml20', onClick: () => {
                        this.refs['NodeContent'].moveDown();
                    } }, "\u4E0B\u79FB"),
                React.createElement(index_1.Button, { className: 'ml20', type: 'primary', onClick: () => {
                        this.refs['NodeContent'].ajaxUpdate();
                    } }, "\u4FDD\u5B58"));
        }
    }
    treeOnClick(name, modelName, data) {
        this.state.modelName = modelName;
        this.state.name = name;
        this.state.treeData = data;
        this.setStateMerge();
    }
    renderMainLeft() {
        let disabled = this.state.contentType === 'index';
        return (React.createElement("section", { className: 'main-left' },
            React.createElement("section", { className: 'main-left-content' },
                React.createElement(index_1.Tabs, { type: 'card', activeKey: this.state.treeType, onChange: (key) => {
                        this.state.treeType = key;
                        this.setStateMerge();
                    } },
                    React.createElement(index_1.TabPane, { tab: '系统模型', key: 'system' },
                        React.createElement("section", { className: 'tabpane-content' },
                            React.createElement(_tree_1.default, { disabled: !disabled, ref: 'systemTree', onClick: this.treeOnClick.bind(this), type: 'system' }))),
                    React.createElement(index_1.TabPane, { tab: '用户模型', key: 'custom' },
                        React.createElement("section", { className: 'tabpane-content' },
                            React.createElement(_tree_1.default, { disabled: !disabled, ref: 'customTree', onClick: this.treeOnClick.bind(this), type: 'custom' })))))));
    }
    /**
     * 头部标题渲染
     *
     * @returns
     *
     * @memberOf MainRightContent
     */
    contentRender() {
        let { state } = this;
        switch (state.treeData.level) {
            case 'model':
                return React.createElement(ModelContent, { onUpdataClick: () => this.changeContent('update'), modelName: this.state.modelName });
            case 'level2':
                if (state.name && state.modelName) {
                    return React.createElement(NodeContent, { onNodeClick: this.onNodeClick.bind(this), ref: 'NodeContent', onUpdataClick: () => this.changeContent('update'), name: this.state.name, modelName: this.state.modelName });
                }
                return;
            case 'level3+':
                if (state.name && state.modelName) {
                    return React.createElement(NodeContent, { ref: 'NodeContent', onNodeClick: this.onNodeClick.bind(this), onUpdataClick: () => this.changeContent('update'), name: this.state.name, modelName: this.state.modelName });
                }
                return;
            default:
                break;
        }
    }
    onNodeClick(modelName, name, ModelType) {
        if (ModelType === 'custom') {
            this.state.treeType = ModelType;
            this.refs['customTree'].onNodeClick(modelName, name);
        }
        else {
            this.state.treeType = ModelType;
            this.refs['systemTree'].onNodeClick(modelName, name);
        }
    }
    changeContent(value) {
        this.state.contentType = value;
        this.setStateMerge();
    }
    renderList() {
        return React.createElement("section", { className: 'main-right' },
            this.navRender(),
            React.createElement("section", { className: 'main-right-content' },
                React.createElement("section", { className: 'main-right-content-box' }, this.contentRender())));
    }
    renderContent() {
        let { state, props } = this;
        switch (this.state.contentType) {
            case 'update':
                if (this.state.modelName || this.state.name) {
                    return React.createElement(_update_1.default, { type: state.treeType, name: state.name, modelName: state.modelName, data: state.treeData, onReturn: (name) => {
                            state.contentType = 'index';
                            if (state.name) {
                                state.name = name || state.name;
                                this.state.treeData['Name'] = name || state.name;
                            }
                            else {
                                state.modelName = name || state.name;
                                this.state.treeData['ModelName'] = name || state.name;
                            }
                            this.setStateMerge();
                        } });
                }
                break;
            default:
                return this.renderList();
        }
    }
    render() {
        let { state, props } = this;
        return React.createElement("section", { className: 'h100 page-model' },
            this.renderMainLeft(),
            this.renderContent());
    }
    /**
     * 组件渲染完毕获取ajax数据
     *
     *
     * @memberOf Device
     */
    componentDidMount() {
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Device;
;
;
class NodeContent extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            data: {
                Description: '',
                Name: '',
                RelatedDataNode: { DataModel: '', DataNode: '', ModelType: '' },
                IsEmbeded: '',
                IsRecursive: ''
            },
            dataArray: [],
            template: [],
            loading: true
        };
    }
    ajaxGetData() {
        return __awaiter(this, void 0, void 0, function* () {
            let { data } = yield index_2.get('/model_node_detail', {
                modelName: this.props.modelName,
                nodeName: this.props.name
            });
            this.state.data = data['Model'];
            this.state.dataArray = index_3.objectToArray(this.state.data);
            this.state.dataArray.find(value => {
                if (value.ParameterName === 'RelatedDataNode') {
                    value.ParameterModelValue = JSON.parse(JSON.stringify(value.ParameterValue));
                    return true;
                }
            });
            this.state.loading = false;
            this.setState(this.state);
        });
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.modelName !== nextProps.modelName || this.props.name !== nextProps.name) {
            this.props = nextProps;
            this.state.loading = true;
            this.ajaxGetData();
        }
    }
    add() {
        this.refs['ModelNodeProperty']['add']();
    }
    moveUp() {
        this.refs['ModelNodeProperty']['moveUp']();
    }
    moveDown() {
        this.refs['ModelNodeProperty']['moveDown']();
    }
    ajaxUpdate() {
        this.refs['ModelNodeProperty']['ajaxUpdate']();
    }
    render() {
        let { props, state } = this;
        let { data } = state;
        let nodeLink = React.createElement("a", { onClick: () => {
                props.onNodeClick(data.RelatedDataNode.DataModel, data.RelatedDataNode.DataNode, data.RelatedDataNode.ModelType);
            } }, data.RelatedDataNode && data.RelatedDataNode.DataModel + ',' + data.RelatedDataNode.DataNode);
        return (React.createElement("section", null,
            React.createElement("section", { className: 'main-right-title' },
                React.createElement("h3", null,
                    data.Name,
                    React.createElement("span", { className: 'ml10' }, data.Description),
                    React.createElement("span", { className: 'ml40' },
                        "\u81EA\u9012\u5F52:",
                        data.IsRecursive === 'true' ? '是' : '否'),
                    React.createElement("span", { className: 'ml40' },
                        "\u5D4C\u5165\u5F0F:",
                        data.IsEmbeded === 'true' ? '是' : '否'),
                    React.createElement("span", { className: 'ml40' },
                        "\u5F15\u7528\u8282\u70B9:",
                        nodeLink)),
                React.createElement("div", { className: 'cf' },
                    React.createElement("span", { className: 'fl' },
                        React.createElement("a", { onClick: () => this.props.onUpdataClick() }, "\u4FEE\u6539")),
                    React.createElement("div", { className: 'fr' }))),
            React.createElement("section", { className: 'mt20' }, !state.loading &&
                React.createElement(TableContent, { ref: 'ModelNodeProperty', categroy: 'ModelNodeProperty', showText: 'Name', name: props.name, modelName: props.modelName }))));
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
class TableContent extends _variable_1.default {
    ajaxGetDate(categroy) {
        return __awaiter(this, void 0, void 0, function* () {
            let nodeTemplate = yield index_2.get('/model_property_template');
            this.state.template = nodeTemplate.data.ModelTemplate.Props;
            let { data } = yield index_2.get('/model_node_property', {
                modelName: this.props.modelName,
                nodeName: this.props.name
            });
            let rData = data['ModelNodeProperty'];
            rData.forEach((value, index) => {
                this.state.template.forEach((templateValue, index) => {
                    if (!value[templateValue.Name]) {
                        value[templateValue.Name] = '';
                    }
                });
                for (let key in value) {
                    if (value.hasOwnProperty(key)) {
                        let element = value[key];
                        value[key] = {
                            ParameterName: key,
                            ParameterValue: element
                        };
                    }
                }
                value.key = index_4.uuid();
            });
            return rData;
        });
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.modelName !== nextProps.modelName || this.props.name !== nextProps.name) {
            this.props = nextProps;
            this.componentWillMount();
        }
    }
    getData(categroy) {
        return __awaiter(this, void 0, void 0, function* () {
            this.state.loading = true;
            this.setState(this.state);
            let data = yield this.ajaxGetDate(this.props.categroy);
            this.state.loading = false;
            // this.state.data = [data[this.props.categroy][0]];
            this.state.data = data;
            this.state._ID = data._ID;
            this.saveColums();
            this.setState(this.state);
        });
    }
    moveUp() {
        let { state, props } = this;
        let selectedData = state.data[state.selectedIndex];
        let nextData = state.data[state.selectedIndex - 1];
        if (nextData) {
            state.data[state.selectedIndex] = nextData;
            state.data[state.selectedIndex - 1] = selectedData;
            state.selectedIndex--;
            this.setState(this.state);
        }
    }
    moveDown() {
        let { state, props } = this;
        let selectedData = state.data[state.selectedIndex];
        let nextData = state.data[state.selectedIndex + 1];
        if (nextData) {
            state.data[state.selectedIndex] = nextData;
            state.data[state.selectedIndex + 1] = selectedData;
            state.selectedIndex++;
            this.setState(this.state);
        }
    }
    ajaxUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            let updateList = [];
            this.state.data.forEach(value => {
                let obj = {};
                if (!value.isRelatedProperty) {
                    for (let key in value) {
                        let element = value[key];
                        delete element['_stateType'];
                        if (key !== 'key') {
                            obj[key] = element.ParameterValue;
                        }
                    }
                    updateList.push(obj);
                }
            });
            yield index_2.post('/upsert_model_node_property', {
                modelName: this.props.modelName,
                nodeName: this.props.name,
                props: updateList
            });
            this.componentWillMount();
            index_1.message.success('保存成功!');
        });
    }
    selectRender() {
        return React.createElement("section", null,
            React.createElement("ul", { className: 'ul-details' }, this.state.selectedRows.map((data, index) => {
                return React.createElement("li", { key: index }, data[this.props.showText].ParameterValue);
            })),
            React.createElement("section", { className: 'component-slip-footer' },
                React.createElement(index_1.Button, { privileges: this.props.privileges + ':remove', onClick: () => {
                        this.onDelete(this.state.selectedRows);
                    } }, "\u5220\u9664")));
    }
    rowSelection() {
        return {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.selectChange.bind(this),
            getCheckboxProps: record => ({
                disabled: record.isRelatedProperty
            })
        };
    }
    renderText(template) {
        return (data, value, index) => {
            if (data) {
                if (value.isRelatedProperty) {
                    return React.createElement(index_5.ParameterText, { template: template, data: data });
                }
                if (this.banArray.indexOf(data.ParameterName) === -1) {
                    return React.createElement(index_5.TextInput, { template: template, data: data, defaultShow: data._stateType === 'add' ? true : false });
                }
                else {
                    return React.createElement(index_5.ParameterText, { template: template, data: data });
                }
            }
            else {
                return React.createElement("span", null, "\u6CA1\u6709\u503C");
            }
        };
    }
}
exports.TableContent = TableContent;
;
;
class ModelContent extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            data: {
                DataSourceType: '',
                Description: '',
                MODELUPDATED: false,
                Name: ''
            },
            dataArray: []
        };
    }
    ajaxGetData() {
        return __awaiter(this, void 0, void 0, function* () {
            let { data } = yield index_2.get('/model_detail', {
                modelName: this.props.modelName
            });
            this.state.data = data['Model'];
            this.state.dataArray = index_3.objectToArray(this.state.data);
            this.setState(this.state);
        });
    }
    ajaxPublish() {
        return __awaiter(this, void 0, void 0, function* () {
            yield index_2.post('/publish_model', {
                modelName: this.props.modelName
            });
            this.setState(this.state);
            index_1.message.success('发布成功!');
        });
    }
    render() {
        let { props, state } = this;
        let { data } = state;
        return (React.createElement("section", null,
            React.createElement("section", { className: 'main-right-title' },
                React.createElement("h3", null,
                    data.Name,
                    React.createElement("span", { className: 'ml10' }, data.Description),
                    React.createElement("span", { className: 'ml40' },
                        "\u6570\u636E\u6E90\u7C7B\u578B:",
                        data.DataSourceType),
                    React.createElement("span", { className: 'ml40' },
                        "\u6570\u636E\u6E90:",
                        data.MODELUPDATED)),
                React.createElement("div", { className: 'cf' },
                    React.createElement("span", { className: 'fl' },
                        React.createElement("a", { onClick: () => this.props.onUpdataClick() }, "\u4FEE\u6539"),
                        React.createElement("a", { className: 'ml10', onClick: this.ajaxPublish.bind(this) }, "\u53D1\u5E03")),
                    React.createElement("div", { className: 'fr' })))));
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.modelName !== nextProps.modelName) {
            this.props = nextProps;
            this.ajaxGetData();
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
});
//# sourceMappingURL=index.js.map
