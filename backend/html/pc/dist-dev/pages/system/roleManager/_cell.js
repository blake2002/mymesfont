define("pages/system/roleManager/_cell.js",function(require, exports, module) {
"use strict";
const React = require("react");
exports.React = React;
const index_1 = require("../../../components/antd/index");
const _details_1 = require("./_details");
const _pagination_1 = require("./_pagination");
const _roleAjaxData_1 = require("./_roleAjaxData");
class EditableTable extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            columns: [],
            dataSource: [],
            loading: true,
            rowKey: 'key',
            currentKey: '',
        };
        this.onRowClick = (record, index) => {
            this.rowSelectedClickBind(record, index);
        };
        this.rowSelection = {
            selectedRowKeys: [],
            onChange: (selectedRowKeys, selectedRows) => {
                this.rowSelection.selectedRowKeys = selectedRowKeys;
                this.setState(this.state);
            }
        };
    }
    componentWillMount() {
        this.updateAjax();
    }
    updateAjax() {
        let p1 = this.updateTemplate();
        let p2 = this.updateRoleList();
        Promise.all([p1, p2]).then(() => {
            this.setState({
                columns: _roleAjaxData_1.default.role_columns, dataSource: _roleAjaxData_1.default.role_list,
                loading: false, rowKey: _roleAjaxData_1.default.role_key
            });
        });
    }
    //角色列表
    updateRoleList() {
        return _roleAjaxData_1.default.get_role_list(1, 20);
    }
    //模板
    updateTemplate() {
        return _roleAjaxData_1.default.get_role_template();
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    //行选择多选绑定
    rowSelectedClickBind(record, index) {
        let currentKey = record[this.state.rowKey];
        let keyIndex = this.rowSelection.selectedRowKeys.indexOf(currentKey);
        if (keyIndex != -1) {
            this.rowSelection.selectedRowKeys.splice(keyIndex, 1);
        }
        else {
            this.rowSelection.selectedRowKeys.push(currentKey);
        }
        this.setState({ currentKey });
    }
    render() {
        return React.createElement("section", null,
            React.createElement(index_1.Table, { rowKey: this.state.rowKey, rowSelection: this.rowSelection, columns: this.state.columns, bordered: true, dataSource: this.state.dataSource, onRowClick: this.onRowClick, rowClassName: (record, index) => {
                    if (this.state.currentKey === record[this.state.rowKey])
                        return 'selected-td';
                    return '';
                } }),
            React.createElement(_details_1.default, { dataSource: this.state.dataSource, selectedRowKeys: this.rowSelection.selectedRowKeys, rowKey: this.state.rowKey, currentKey: this.state.currentKey }),
            React.createElement(_pagination_1.default, null));
    }
    //新建角色
    new_role() {
        console.log('new_role');
    }
}
exports.EditableTable = EditableTable;
});
//# sourceMappingURL=_cell.js.map
