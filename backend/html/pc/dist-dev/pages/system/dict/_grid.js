define("pages/system/dict/_grid.js",function(require, exports, module) {
"use strict";
const React = require("react");
exports.React = React;
const index_1 = require("../../../components/ajax/index");
const index_2 = require("../../../components/antd/index");
const _dictAjaxData_1 = require("./_dictAjaxData");
const _cell_1 = require("./_cell");
const _myDetails_1 = require("./../_myDetails");
class EditableTable extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            columns: [],
            dataSource: [],
            loading: true,
            rowKey: '_ID',
            currentKey: '',
            finish: false,
            pageIndex: 1,
            pageTotal: 1,
            modalSlipVisable: false
        };
        this.pageSize = 12;
        this._modifiedMenuList = {};
        this.renderColumns = (text, record, index, colKey) => {
            return React.createElement(_cell_1.default, { value: text, onChange: this.onCellChange(record, index, colKey), finish: this.state.finish ? true : undefined, flag: record['__flag'] });
        };
        /////////////////////////////////////////////////////////////////////////////////////////////
        this.onRowClick = (record, index) => {
            // console.log(record);
        };
        this.rowSelection = {
            selectedRowKeys: [],
            onChange: (selectedRowKeys, selectedRows) => {
                this.rowSelection.selectedRowKeys = selectedRowKeys;
                this.state.modalSlipVisable = selectedRowKeys.length > 0;
                this.setState(this.state);
            }
        };
        this.each = (key) => {
            for (let i in this.state.dataSource) {
                let obj = this.state.dataSource[i];
                let objKey = obj['Key']; //obj['__key'] ? obj['__key'] : obj['Key']
                if (objKey == key)
                    return obj;
            }
        };
        this.onButtonDelete = () => {
            let dicts = this.rowSelection.selectedRowKeys.map((key, index) => {
                if (key != undefined) {
                    let wfObj = this.each(key);
                    return { Key: wfObj.Key, Type: wfObj.Type };
                }
            });
            index_1.post('/sys/delete_dict', {
                dicts
            }).then(() => {
                index_2.message.success('删除成功!');
                let p = this.updateList();
                p.then(() => {
                    this.setState({
                        dataSource: _dictAjaxData_1.default.dict_list,
                        pageTotal: _dictAjaxData_1.default.pageCount
                    });
                });
            });
        };
    }
    componentWillMount() {
        this.updateAjax();
    }
    updateAjax() {
        let p1 = this.updateTemplate();
        let p2 = this.updateList();
        Promise.all([p1, p2]).then(() => {
            this.template_data_exchange(_dictAjaxData_1.default.dict_template);
            this.setState({
                dataSource: _dictAjaxData_1.default.dict_list,
                loading: false,
                pageTotal: _dictAjaxData_1.default.pageCount
            });
        });
    }
    onCellChange(record, index, colKey) {
        return (value) => {
            console.log(value);
            let { dataSource } = this.state;
            for (let i in dataSource) {
                if (dataSource[i].Key === record.Key) {
                    if (dataSource[i]['__flag'] == undefined) {
                        dataSource[i]['__flag'] = 'modify';
                        dataSource[i]['__key'] = Object(dataSource[i]['Key']);
                        dataSource[i]['__type'] = Object(dataSource[i]['Type']);
                    }
                    dataSource[i][colKey] = value;
                }
            }
            // if (!this._modifiedMenuList[record.Key]) this._modifiedMenuList[record.Key] = {
            //     Key: record.Key,
            //     Type: record.Type,
            //     Modified: {}
            // }
            // this._modifiedMenuList[record.Key]['Modified'][colKey] = value
        };
    }
    /**模板转换列 */
    template_data_exchange(templates) {
        let columns = [];
        let width = 100 / templates.length;
        for (let template of templates) {
            let col = {
                title: template.Description,
                dataIndex: template.Name,
                key: template.Name,
                // width: width,//template.Form.Properties.Width,
                render: (text, record, index) => this.renderColumns(text, record, index, template.Name)
            };
            columns.push(col);
        }
        this.state.columns = columns;
    }
    onSave() {
        let newDatas = [];
        let modifyDatas = [];
        let { dataSource } = this.state;
        for (let i in dataSource) {
            let obj = dataSource[i];
            if (obj['__flag'] == 'new') {
                delete obj['__flag'];
                newDatas.push(obj);
            }
            else if (obj['__flag'] == 'modify') {
                let oldKey = obj['__key'];
                let oldType = obj['__type'];
                delete obj['__flag'];
                delete obj['__key'];
                delete obj['__type'];
                modifyDatas.push({
                    Type: oldType,
                    Key: oldKey,
                    Modified: obj
                });
            }
        }
        let promiselist = [];
        console.log(modifyDatas);
        if (modifyDatas.length > 0) {
            let p1 = index_1.post('/sys/modified_dict', { props: modifyDatas });
            promiselist.push(p1);
        }
        if (newDatas.length > 0) {
            let p2 = index_1.post('/sys/new_dict', { props: newDatas });
            promiselist.push(p2);
        }
        Promise.all(promiselist).then((result) => {
            this.updateList().then(() => {
                this.setState({ dataSource: this.state.dataSource, finish: true });
            });
            index_2.message.success('保存成功!');
        });
        // let requestList = Object.keys(this._modifiedMenuList).map((k) => { return this._modifiedMenuList[k] });
        // if (requestList.length === 0) return;
        // let promise = post('/sys/modified_dict', { props: requestList });
        // promise.then((result) => {
        //     if (result.code == 0) {
        //         this._modifiedMenuList = {};
        //         this.updateRoleList().then(() => {
        //             this.setState({ dataSource: this.state.dataSource, finish: true });
        //         })
        //     }
        // });
    }
    onNew() {
        let newData = {
            Key: " ",
            Value: " ",
            Type: " ",
            Description: " ",
            OrderbyIndex: " ",
            _ID: _myDetails_1.default.newGuid(),
            __flag: 'new'
        };
        this.state.dataSource.unshift(newData);
        this.setState(this.state);
    }
    //列表
    updateList() {
        return _dictAjaxData_1.default.get_list(this.state.pageIndex, this.pageSize);
    }
    //模板
    updateTemplate() {
        return _dictAjaxData_1.default.get_template();
    }
    getTableHeight() {
        let height = document.body.clientHeight - 300;
        if (height <= this.state.dataSource.length * 55) {
            return height;
        }
        else {
            return null;
        }
    }
    render() {
        return React.createElement("section", { className: 'main-right-content-box' },
            React.createElement(index_2.Table, { rowKey: this.state.rowKey, rowSelection: this.rowSelection, columns: this.state.columns, dataSource: this.state.dataSource, onRowClick: this.onRowClick, rowClassName: (record, index) => {
                    if (this.state.currentKey === record[this.state.rowKey])
                        return 'selected-td';
                    return '';
                }, pagination: false, scroll: { x: true, y: this.getTableHeight() } }),
            React.createElement(index_2.Pagination, { className: 'mt20', onChange: this.paginationOnChange.bind(this), current: this.state.pageIndex, total: this.state.pageTotal * this.pageSize, defaultPageSize: this.pageSize }),
            React.createElement(index_2.ModalSlip, { title: '字典', onCancel: () => this.setState({ modalSlipVisable: false }), visible: this.state.modalSlipVisable },
                React.createElement("section", null,
                    React.createElement("ul", { className: 'ul-details' },
                        " ",
                        this.rowSelection.selectedRowKeys.map((key, index) => {
                            if (key != undefined) {
                                let wfObj = this.each(key);
                                console.log(wfObj);
                                if (wfObj)
                                    return React.createElement("li", { key: wfObj['Key'] }, wfObj.Value);
                            }
                        })),
                    React.createElement("section", { className: 'component-slip-footer' },
                        React.createElement(index_2.Button, { onClick: this.onButtonDelete }, "\u5220\u9664")))));
    }
    paginationOnChange(pageIndex, pageSize) {
        this.state.pageIndex = pageIndex;
        let p = this.updateList();
        p.then(() => {
            this.setState({
                pageIndex,
                dataSource: _dictAjaxData_1.default.dict_list,
                pageTotal: _dictAjaxData_1.default.pageCount
            });
        });
    }
}
exports.EditableTable = EditableTable;
});
//# sourceMappingURL=_grid.js.map
