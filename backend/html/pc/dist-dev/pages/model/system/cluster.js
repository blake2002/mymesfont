define("pages/model/system/cluster.js",function(require, exports, module) {
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
const components_1 = require("../../../components/global/components");
const index_1 = require("../../../components/ajax/index");
const index_2 = require("../../../components/antd/index");
require("./index.css");
const index_3 = require("../../../components/template-input/index");
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
            data: [],
            template: [],
            loading: true,
            selectedRowKeys: [],
            tableWidth: 50
        };
        this.columns = [];
    }
    ajaxGetData() {
        return __awaiter(this, void 0, void 0, function* () {
            this.state.loading = true;
            let templateData = yield index_1.get('/model_cluster_state_template');
            this.state.template = templateData.data.ModelTemplate.Props;
            let { data } = yield index_1.get('/model_cluster_state_list');
            this.state.data = data.stateList;
            this.state.data.forEach((value, index) => {
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
            });
            this.saveColums();
            this.state.loading = false;
            this.setState(this.state);
        });
    }
    renderText(template) {
        return (data, value, index) => {
            if (data) {
                return React.createElement(index_3.ParameterText, { template: template, data: data });
            }
            else {
                return React.createElement("span", null, "\u6CA1\u6709\u503C");
            }
        };
    }
    saveColums() {
        this.columns = [];
        this.state.template.forEach((value, index) => {
            if (!value.Visible) {
                let width = value.Form.Properties && value.Form.Properties.Width;
                this.columns.push({
                    title: value.Description,
                    dataIndex: value.Name,
                    width: width,
                    render: this.renderText(value)
                });
                this.state.tableWidth += width || 100;
            }
        });
    }
    onChangeTabs() {
        this.props.jump('/model/system/index');
    }
    getTableHeight() {
        let height = document.body.clientHeight - 210;
        if (height <= this.state.data.length * 55) {
            return height;
        }
        else {
            return null;
        }
    }
    /**
     * 行点击事件
     *
     * @param {any} record
     * @param {any} index
     *
     * @memberOf Device
     */
    onRowClick(record, index) {
        this.props.jump('/model/system/cluster-details', {
            clusterNodeId: record['ID'].ParameterValue
        });
    }
    render() {
        let { state, props } = this;
        return React.createElement(index_2.Tabs, { type: 'card', activeKey: '2', onChange: this.onChangeTabs.bind(this) },
            React.createElement(index_2.TabPane, { tab: '设计时', key: '1' }),
            React.createElement(index_2.TabPane, { tab: '运行时', key: '2' },
                React.createElement(index_2.Table, { className: 'edit-table', loading: state.loading, dataSource: this.state.data, columns: this.columns, pagination: false, onRowClick: this.onRowClick.bind(this), scroll: {
                        x: 50,
                        y: this.getTableHeight()
                    } })));
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
});
//# sourceMappingURL=cluster.js.map
