define("pages/report/system/index.js",function(require, exports, module) {
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
const index_3 = require("../../../components/antd/index");
let errorMsg = index_3.notification.error;
const config_1 = require("../../../components/global/config");
require("../../model/system/index.css");
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
            treeType: 'system',
            treeData: {},
            contentType: 'index',
            Id: null
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
        this.state.contentType = key;
        this.setState(this.state);
    }
    navRender() {
        return React.createElement(index_1.Tabs, { type: 'card', activeKey: this.state.contentType, onChange: this.onChangeTabs.bind(this), tabBarExtraContent: this.menuRender() },
            React.createElement(index_1.TabPane, { tab: '设计时', key: 'index' }),
            React.createElement(index_1.TabPane, { tab: '运行时', key: 'runtime' }));
    }
    getUpload() {
        return {
            path: _tree_1.getParentString(this.state.treeData),
            dirId: this.state.treeData.Id,
            token: localStorage.getItem('token'),
            userId: localStorage.getItem('userId')
        };
    }
    uploadOnChange(e) {
        // console.log(e);
        let file = e.file;
        if (file.status === 'done') {
            if (file.response.code !== 0) {
                errorMsg({
                    message: `请求错误!`,
                    description: React.createElement("div", null,
                        React.createElement("p", null,
                            "\u9519\u8BEF\u7801:",
                            file.response.code),
                        React.createElement("p", null,
                            "\u9519\u8BEF\u4FE1\u606F:",
                            file.response.data.msg))
                });
            }
            else {
                this.refs['NodeContent'].componentDidMount();
            }
        }
    }
    menuRender() {
        if (this.state.contentType === 'index') {
            return React.createElement("section", null,
                React.createElement("span", { className: 'fl' },
                    React.createElement(index_1.Upload, { action: config_1.ajax.requestUrl + '/report_upload', data: this.getUpload.bind(this), onChange: this.uploadOnChange.bind(this), showUploadList: false },
                        React.createElement(index_1.Button, { className: 'ml20' }, "\u65B0\u589E\u62A5\u8868"))));
        }
    }
    treeOnClick(data) {
        this.state.treeData = data;
        this.setStateMerge();
    }
    renderMainLeft() {
        return (React.createElement("section", { className: 'main-left' },
            React.createElement("section", { className: 'main-left-content' },
                React.createElement(index_1.Tabs, { type: 'card', defaultActiveKey: 'system' },
                    React.createElement(index_1.TabPane, { tab: '服务端列表', key: 'system' },
                        React.createElement("section", { className: 'tabpane-content' },
                            React.createElement(_tree_1.default, { onClick: this.treeOnClick.bind(this) })))))));
    }
    changeContent(value) {
        this.state.contentType = value;
        this.setStateMerge();
    }
    renderContent() {
        if (this.state.contentType === 'index') {
            return React.createElement(NodeContent, { Id: this.state.treeData.Id });
        }
        else {
            return React.createElement(Content, { Id: this.state.treeData.Id });
        }
    }
    renderList() {
        return React.createElement("section", { className: 'main-right' },
            this.navRender(),
            React.createElement("section", { className: 'main-right-content' },
                React.createElement("section", { className: 'main-right-content-box' }, this.state.treeData.Id && this.renderContent())));
    }
    render() {
        let { state, props } = this;
        return React.createElement("section", { className: 'h100 page-model' },
            this.renderMainLeft(),
            this.renderList());
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
            data: [],
            loading: true
        };
        this.columns = [{
                title: '报表名',
                dataIndex: 'RptName',
                key: 'RptName'
            }, {
                title: '上传人',
                dataIndex: 'UploadPerson',
                key: 'UploadPerson'
            }, {
                title: '上传时间',
                dataIndex: 'UploadTime',
                key: 'UploadTime'
            }];
    }
    ajaxGetData() {
        return __awaiter(this, void 0, void 0, function* () {
            this.state.loading = true;
            let { data } = yield index_2.post('/report_designtime_list', {
                id: this.props.Id
            });
            this.state.data = data['list'];
            this.state.loading = false;
            this.setState(this.state);
        });
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.Id !== nextProps.Id) {
            this.props = nextProps;
            this.ajaxGetData();
        }
    }
    render() {
        let { props, state } = this;
        let { data } = state;
        return (React.createElement("section", null,
            React.createElement("section", { className: 'mt20' },
                React.createElement(index_1.Table, { columns: this.columns, pagination: false, dataSource: this.state.data }))));
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
class Content extends NodeContent {
    constructor() {
        super(...arguments);
        this.columns = [{
                title: '报表名',
                dataIndex: 'RptName',
                key: 'RptName'
            }, {
                title: '查询次数',
                dataIndex: 'QueryCount',
                key: 'QueryCount'
            }, {
                title: '导出次数',
                dataIndex: 'ExportCount',
                key: 'ExportCount'
            }, {
                title: '最近一次查询人',
                dataIndex: 'LastQeuryPerson',
                key: 'LastQeuryPerson'
            }, {
                title: '最近一次查询时间',
                dataIndex: 'LastQueryTime',
                key: 'LastQueryTime'
            }];
    }
    ajaxGetData() {
        return __awaiter(this, void 0, void 0, function* () {
            let { data } = yield index_2.post('/report_runtime_list', {
                id: this.props.Id
            });
            this.state.data = data['list'];
            this.state.loading = false;
            this.setState(this.state);
        });
    }
}
});
//# sourceMappingURL=index.js.map
