define("pages/device/members/member-select.js",function(require, exports, module) {
"use strict";
const React = require("react");
const index_1 = require("../../../components/modal/index");
const index_2 = require("../../../components/antd/index");
const member_vars_1 = require("./member-vars");
require("./member-manager.css");
class MemberSelect extends React.Component {
    /**
     * 成员数据模型
     */
    getColumns(modelProperties) {
        let result = [];
        modelProperties = modelProperties || [];
        for (let i = 0; i < 2; i++) {
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
        let rowSelection = {};
        return (React.createElement(index_1.default, { title: "选择成员", visible: this.props.visible, onOk: this.handleOk.bind(this), onCancel: this.handleCancel.bind(this) },
            React.createElement("div", null,
                React.createElement(index_2.Input, { className: 'member-select-serach', placeholder: "serach" })),
            React.createElement(index_2.Table, { className: 'member-table', rowSelection: rowSelection, dataSource: data, columns: cols })));
    }
    handleOk() {
        this.props.onVisible();
    }
    handleCancel() {
        this.props.onVisible();
    }
}
exports.MemberSelect = MemberSelect;
});
//# sourceMappingURL=member-select.js.map
