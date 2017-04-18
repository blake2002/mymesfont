define("pages/system/roleManager/_grid.js",function(require, exports, module) {
"use strict";
const React = require("react");
exports.React = React;
const index_1 = require("../../../components/antd/index");
const _details_1 = require("./_details");
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
            role_detail: {},
            pageTotal: 1,
            pageIndex: 1
        };
        this.pageSize = 12;
        /////////////////////////////////////////////////////////////////////////////////////////////
        this.onRowClick = (record, index) => {
            if (this.rowSelection.selectedRowKeys.length == 0) {
                let currentKey = record[this.state.rowKey];
                this.setState({
                    currentKey: record[this.state.rowKey]
                });
                let ret = _roleAjaxData_1.default.get_role_detail(currentKey);
                ret.then(() => {
                    this.setState({
                        role_detail: _roleAjaxData_1.default.role_detail[currentKey]
                    });
                });
            }
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
        let p1 = this.updateListTemplate();
        let p2 = this.updateRoleList();
        Promise.all([p1, p2]).then(() => {
            this.setState({
                columns: _roleAjaxData_1.default.role_columns, dataSource: _roleAjaxData_1.default.role_list,
                loading: false, rowKey: _roleAjaxData_1.default.role_key,
                pageTotal: _roleAjaxData_1.default.pageCount
            });
        });
    }
    //角色列表
    updateRoleList() {
        return _roleAjaxData_1.default.get_role_list(this.state.pageIndex, this.pageSize);
    }
    //模板
    updateTemplate() {
        return _roleAjaxData_1.default.get_role_template();
    }
    //列表模板
    updateListTemplate() {
        return _roleAjaxData_1.default.get_role_list_template();
    }
    rowClassName(record, index) {
        if (this.state.currentKey === record[this.state.rowKey]) {
            return 'selected-td';
        }
        return '';
    }
    getTableHeight() {
        let height = document.body.clientHeight - 255;
        return height;
        // if (height <= this.state.dataSource.length * 55) {
        //     return height;
        // } else {
        //     return null;
        // }
    }
    render() {
        return React.createElement("section", { className: 'main-right-content-box' },
            React.createElement(index_1.Table, { rowKey: this.state.rowKey, rowSelection: this.rowSelection, columns: this.state.columns, dataSource: this.state.dataSource, onRowClick: this.onRowClick, rowClassName: this.rowClassName.bind(this), pagination: false, scroll: { x: true, y: this.getTableHeight() } }),
            React.createElement(_details_1.default, { dataSource: this.state.dataSource, selectedRowKeys: this.rowSelection.selectedRowKeys, rowKey: this.state.rowKey, currentKey: this.state.currentKey, role_detail: this.state.role_detail, onEnableChange: this.onEnableChange.bind(this), updateData: this.updateAjax.bind(this) }),
            React.createElement(index_1.Pagination, { className: 'mt20', onChange: this.paginationOnChange.bind(this), current: this.state.pageIndex, total: this.state.pageTotal * this.pageSize, defaultPageSize: this.pageSize }));
    }
    onEnableChange(v) {
        let { currentKey, dataSource } = this.state;
        for (let i in dataSource) {
            let obj = dataSource[i];
            if (obj[this.state.rowKey] == currentKey) {
                this.state.dataSource[i].Enable = v;
                break;
            }
        }
        this.setState(this.state);
    }
    paginationOnChange(pageIndex, pageSize) {
        this.state.pageIndex = pageIndex;
        let p = this.updateRoleList();
        p.then(() => {
            this.setState({
                pageIndex,
                dataSource: _roleAjaxData_1.default.role_list,
                pageTotal: _roleAjaxData_1.default.pageCount
            });
        });
    }
}
exports.EditableTable = EditableTable;
});
//# sourceMappingURL=_grid.js.map
