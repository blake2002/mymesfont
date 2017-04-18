define("pages/device/members/member-manager.js",function(require, exports, module) {
"use strict";
const React = require("react");
const index_1 = require("../../../components/antd/index");
const member_select_1 = require("./member-select");
const member_overview_1 = require("./member-overview");
const member_details_1 = require("./member-details");
const member_vars_1 = require("./member-vars");
require("./member-manager.css");
class MemberManager extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            selectVisible: false,
            overviewVisible: false,
            detailsVisible: false
        };
    }
    onSelectVisible() {
        this.setState({
            selectVisible: !this.state.selectVisible
        });
    }
    onOverviewVisible() {
        this.setState({
            overviewVisible: !this.state.overviewVisible
        });
    }
    onDetailsVisible() {
        this.setState({
            detailsVisible: !this.state.detailsVisible
        });
    }
    /**
     * 成员数据模型
     */
    getColumns(modelProperties) {
        let result = [];
        modelProperties = modelProperties || [];
        for (let i = 0; i < 5; i++) {
            let key = modelProperties[i]['Name'];
            let column = {
                title: modelProperties[i]['Description'],
                key: modelProperties[i]['Name'],
                dataIndex: modelProperties[i]['Name'],
                // render: '',//	生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引，@return里面可以设置表格行/列合并	Function(text, record, index) {}	-
                // filters: '',//	表头的筛选菜单项	Array	-
                // onFilter: '',//	本地模式下，确定筛选的运行函数	Function	-
                // filterMultiple: '',//	是否多选	Boolean	true
                // filterDropdown: '',//	可以自定义筛选菜单，此函数只负责渲染图层，需要自行编写各种交互	React.Element	-
                // filterDropdownVisible: '',//	用于控制自定义筛选菜单是否可见	Boolean	-
                // onFilterDropdownVisibleChange: '',//	自定义筛选菜单可见变化时调用	function(visible) {}	-
                // filteredValue: '',//	筛选的受控属性，外界可用此控制列的筛选状态，值为已筛选的 value 数组	Array	-
                // sorter: '',//	排序函数，本地排序使用一个函数，需要服务端排序可设为 true	Function or Boolean	-
                // colSpan: '',//	表头列合并,设置为 0 时，不渲染	Number	
                width: 130,
                className: 'member-manager-table-column-' + modelProperties[i]['Name'],
            };
            result.push(column);
        }
        return result;
    }
    /**
     * 成员数据源
     */
    getDataSource(source) {
        let dataSource = [];
        for (let i in source) {
            source[i]['key'] = i.toString();
            dataSource.push(source[i]);
        }
        return dataSource;
    }
    getDeviceInfo() {
        return member_vars_1.g_deviceInfo;
    }
    render() {
        const cols = this.getColumns(member_vars_1.members_model);
        const data = this.getDataSource(member_vars_1.members_data);
        // rowSelection object indicates the need for row selection
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            onSelect: (record, selected, selectedRows) => {
                console.log(record, selected, selectedRows);
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                console.log(selected, selectedRows, changeRows);
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User' // Column configuration not to be checked
            }),
        };
        return (React.createElement("div", null,
            React.createElement("div", { className: 'member-title' },
                React.createElement("h3", null, "\u4E0A\u6D77\u8FEA\u58EB\u5C3C"),
                React.createElement("div", null,
                    React.createElement("a", { onClick: this.onSelectVisible.bind(this) }, "\u9009\u62E9\u6210\u5458"),
                    React.createElement("a", { onClick: this.onDetailsVisible.bind(this), className: 'append-member' }, "\u65B0\u589E\u6210\u5458"))),
            React.createElement(index_1.Table, { className: 'member-table', onRowClick: this.onRowClick.bind(this), rowSelection: rowSelection, dataSource: data, columns: cols }),
            React.createElement(member_select_1.MemberSelect, { visible: this.state.selectVisible, onVisible: this.onSelectVisible.bind(this) }),
            React.createElement(member_overview_1.MemberOverview, { visible: this.state.overviewVisible, onVisible: this.onOverviewVisible.bind(this), deviceInfo: this.getDeviceInfo(), memberInfo: this.rowSelectRecord || {} }),
            React.createElement(member_details_1.MemberDetails, { visible: this.state.detailsVisible, onVisible: this.onDetailsVisible.bind(this) })));
    }
    onRowClick(record, index) {
        this.rowSelectRecord = record;
        this.setState({
            overviewVisible: true
        });
    }
    memberSelectOk(isOk) {
        console.log(isOk);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MemberManager;
});
//# sourceMappingURL=member-manager.js.map
