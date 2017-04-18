define("pages/system/systemMenuManager/_grid.js",function(require, exports, module) {
"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
const React = require("react");
exports.React = React;
const index_1 = require("../../../components/ajax/index");
const index_2 = require("../../../components/antd/index");
const _cell_1 = require("./_cell");
const _myDetails_1 = require("../_myDetails");
class EditableTable extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            dataSource: [],
            loadingKey: '',
            selectedRowKeys: [],
            selectedRowKey: '',
            modalSlipVisible: false,
            finish: false,
        };
        this.columns = [];
        this._modifiedMenuList = {};
        /**
         * 添加子菜单
         */
        this.handleAddChildren = () => {
            let _ID = this.state.selectedRowKey;
            console.log(_ID);
            if (_ID == '')
                return; //未选中 
            let menuObj = this.findMenuObjBy_ID(_ID);
            if (menuObj['children'] && menuObj['children'].length == 0) {
                return;
            }
            const newData = {
                Name: '',
                ID: '',
                _ID: _myDetails_1.default.newGuid(),
                Link: '',
                Enable: 1,
                OrderbyIndex: 100,
                __flag: 'new',
                parentMenuID: menuObj.ID,
            };
            if (menuObj['children'] && menuObj['children'].length > 0) {
                menuObj['children'].unshift(newData);
            }
            else {
                menuObj['children'] = [newData];
            }
            this.setState({
                dataSource: this.state.dataSource
            });
        };
    }
    initColumns() {
        let onCellChange = (record, index, colKey) => {
            return (value) => {
                if (colKey == 'Enable')
                    value = value ? '1' : '0';
                this.findDataSource((menus, menu, index) => {
                    if (menu._ID === record._ID) {
                        if (menu['__flag'] == undefined) {
                            menu['__flag'] = 'modify';
                        }
                        menu[colKey] = value;
                    }
                });
            };
        };
        let renderColumns = (text, record, index, colKey) => {
            if (colKey === 'Enable') {
                return React.createElement(index_2.Switch, { defaultChecked: record.Enable == '1', onChange: onCellChange(record, index, 'Enable') });
            }
            // console.log(record);
            return React.createElement(_cell_1.default, { value: text, onChange: onCellChange(record, index, colKey), finish: this.state.finish ? true : undefined, flag: record['__flag'] });
        };
        this.columns = [{
                title: '名称',
                dataIndex: 'Name',
                key: 'Name',
                width: '20%',
                render: (text, record, index) => renderColumns(text, record, index, 'Name')
            }, {
                title: '标识',
                dataIndex: 'ID',
                key: 'ID',
                width: '20%',
                render: (text, record, index) => renderColumns(text, record, index, 'ID')
            }, {
                title: '链接',
                dataIndex: 'Link',
                key: 'Link',
                width: '20%',
                render: (text, record, index) => renderColumns(text, record, index, 'Link')
            }, {
                title: '排序',
                dataIndex: 'OrderbyIndex',
                key: 'OrderbyIndex',
                width: '20%',
                render: (text, record, index) => renderColumns(text, record, index, 'OrderbyIndex')
            }, {
                title: '启用/禁用',
                dataIndex: 'Enable',
                key: 'Enable',
                width: '20%',
                render: (text, record, index) => renderColumns(text, record, index, 'Enable')
            }];
    }
    //加载真实DOM之前
    componentWillMount() {
        this.initColumns();
        this.updateDataSource();
    }
    componentDidUpdate(prevProps, prevState) {
        this.state.finish = false;
    }
    /**
     * _ID：唯一ID
     * callback（parent父节点，子节点）
     */
    findDataSource(callback) {
        let each = (rootAry, callback) => {
            for (let i in rootAry) {
                let menuObj = rootAry[i];
                if (callback) {
                    let ret = callback(rootAry, menuObj, i); //callback (parent,obj)
                    if (ret)
                        return ret;
                }
                if (menuObj.children && menuObj.children.length != 0) {
                    let ret = each(menuObj.children, callback); //递归
                    if (ret)
                        return ret;
                }
            }
            return null;
        };
        return each(this.state.dataSource, callback);
    }
    findMenuObjBy_ID(_ID) {
        return this.findDataSource((menus, menu, index) => {
            if (_ID == menu._ID)
                return menu;
            //不反回知道默认返回什么值 undefined?
        });
    }
    remoteMenuObjBy_ID(_ID) {
        return this.findDataSource((menus, menu, index) => {
            if (menu._ID == _ID) {
                menus.splice(index, 1);
                return true;
            }
        });
    }
    modifyMenuObjBy_ID(_ID, colKey, value) {
        return this.findDataSource((menus, menu, index) => {
            if (menu._ID == _ID) {
                menu[colKey] = value;
                return true;
            }
        });
    }
    /**
     * 设置子集数据
     * @param parentId 上级key
     * @param menu_list 被添加的菜单数组
     */
    appendChildren(_ID, menu_list) {
        return this.findDataSource((menus, menu, index) => {
            if (menu._ID == _ID) {
                menu.children = menu_list;
                return true;
            }
        });
    }
    /**
     * 添加菜单
     */
    handleAdd() {
        const { dataSource } = this.state;
        const newData = {
            Name: '',
            ID: '',
            _ID: _myDetails_1.default.newGuid(),
            Link: '',
            Enable: 1,
            OrderbyIndex: '',
            __flag: 'new'
        };
        this.state.dataSource.unshift(newData);
        this.setState({
            dataSource: this.state.dataSource
        });
    }
    verify() {
        let isok = '';
        let verifyKeys = {};
        this.findDataSource((menus, menu, index) => {
            if (menu.Name == '' || menu.ID == '') {
                isok = '标识与名称不能为空';
                return;
            }
            if (verifyKeys[menu.ID] == '1') {
                isok = '标识不能重名';
                return;
            }
            verifyKeys[menu.ID] = '1';
        });
        return isok;
    }
    //保存所有
    handleSave() {
        let newDatas = [];
        let modifyDatas = [];
        let { dataSource } = this.state;
        let verify = this.verify();
        if (verify != '') {
            index_2.message.error(verify);
            return;
        }
        this.findDataSource((menus, menu, index) => {
            if (menu['__flag'] == 'new') {
                newDatas.push(menu);
            }
            else if (menu['__flag'] == 'modify') {
                modifyDatas.push(__assign({}, menu, { menuID: menu.ID }));
            }
        });
        console.log('new', newDatas);
        console.log('modify', modifyDatas);
        let p1 = index_1.post('/new_menu', { props: newDatas });
        let p2 = index_1.post('/modified_menu', { props: modifyDatas });
        Promise.all([p1, p2]).then((result) => {
            index_2.message.success('保存成功!');
            this.updateDataSource().then(() => {
                this.setState({ dataSource: this.state.dataSource, finish: true });
            });
        });
    }
    adjustCheckSet(_ID, selected) {
        let menuObj = this.findMenuObjBy_ID(_ID);
        if (menuObj) {
            let menuSelectAll = (menu) => {
                let menuSelect = (menu) => {
                    if (selected) {
                        this.state.selectedRowKeys.push(menu._ID); //需要做不重复处理
                    }
                    else {
                        for (let i in this.state.selectedRowKeys) {
                            let rowKey = this.state.selectedRowKeys[i];
                            if (rowKey == menu._ID) {
                                this.state.selectedRowKeys.splice(i, 1);
                                break;
                            }
                        }
                    }
                };
                menuSelect(menu);
                let menuList = menu.children;
                for (let i in menuList) {
                    let menuObj = menuList[i];
                    menuSelectAll(menuObj); //递归   
                }
            };
            menuSelectAll(menuObj);
        }
    }
    unique(ary, isStrict) {
        if (ary.length < 2)
            return [ary[0]] || [];
        var tempObj = {}, newArr = [];
        for (var i = 0; i < ary.length; i++) {
            var v = ary[i];
            var condition = isStrict ? (typeof tempObj[v] != typeof v) : false;
            if ((typeof tempObj[v] == "undefined") || condition) {
                tempObj[v] = v;
                newArr.push(v);
            }
        }
        return newArr;
    }
    render() {
        const { dataSource } = this.state;
        const columns = this.columns;
        const rowSelection = {
            type: 'checkbox',
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                if (selectedRowKeys.length > 0 && selectedRowKeys[0] == undefined) {
                    selectedRowKeys.splice(0, 1);
                }
                this.setState({ selectedRowKeys: selectedRowKeys });
            },
            // getCheckboxProps(record) {//选择框的默认属性配置
            // },
            onSelect: (record, selected, selectedRows) => {
                this.adjustCheckSet(record._ID, selected);
                this.state.selectedRowKeys = this.unique(this.state.selectedRowKeys, false);
                if (this.state.selectedRowKeys.length > 0 && this.state.selectedRowKeys[0] == undefined) {
                    this.state.selectedRowKeys.splice(0, 1);
                }
                let modalSlipVisible = this.state.selectedRowKeys.length > 0;
                this.setState({
                    selectedRowKeys: this.state.selectedRowKeys,
                    modalSlipVisible: modalSlipVisible
                });
                // this.modalSlipShow();
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                if (this.state.selectedRowKeys.length > 0 && this.state.selectedRowKeys[0] == undefined) {
                    this.state.selectedRowKeys.splice(0, 1);
                }
                if (!selected) {
                    this.modalSlipHide();
                }
                else {
                    this.modalSlipShow();
                }
            }
        };
        return React.createElement("section", { className: 'main-right-content-box' },
            React.createElement(index_2.Table, { rowKey: '_ID', rowClassName: this.rowClassName.bind(this), pagination: false, dataSource: dataSource, columns: columns, onExpandedRowsChange: this.onExpandedRowsChange.bind(this), onExpand: this.onExpand.bind(this), rowSelection: rowSelection, onRowClick: this.onRowClick.bind(this), scroll: { x: true, y: this.getTableHeight() } }),
            React.createElement(index_2.ModalSlip, { title: '菜单管理', onCancel: this.modalSlipHide.bind(this), visible: this.state.modalSlipVisible }, this.getModalSlipContent()));
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
    getModalSlipContent() {
        let each = (rootAry, _ID) => {
            for (let i in rootAry) {
                let menuObj = rootAry[i];
                if (menuObj._ID == _ID) {
                    return menuObj;
                }
                else if (menuObj.children && menuObj.children.length != 0) {
                    let ret = each(menuObj.children, _ID); //递归
                    if (ret)
                        return ret;
                }
            }
            return null;
        };
        return React.createElement("section", null,
            React.createElement("ul", { className: 'ul-details' }, this.state.selectedRowKeys.map((value, index) => {
                if (value != undefined) {
                    let menuObj = each(this.state.dataSource, value);
                    return React.createElement("li", { key: menuObj._ID }, menuObj.Name);
                }
            })),
            React.createElement("section", { className: 'component-slip-footer' },
                React.createElement(index_2.Button, { onClick: this.onButtonDelete.bind(this) }, "\u5220\u9664")));
    }
    onButtonDelete() {
        let ids = [];
        for (let i in this.state.selectedRowKeys) {
            let menuObj = this.findMenuObjBy_ID(this.state.selectedRowKeys[i]);
            ids.push(menuObj.ID);
        }
        let promise = index_1.post('/delete_menu', {
            menuIDs: ids,
        });
        promise.then((result) => {
            if (result.code == 0) {
                for (let _ID of this.state.selectedRowKeys) {
                    let ret = this.remoteMenuObjBy_ID(_ID);
                    if (!ret)
                        index_2.message.warning('未删除成功' + _ID);
                }
                index_2.message.success('删除成功');
                this.setState({
                    selectedRowKeys: [],
                    modalSlipVisible: false,
                    dataSource: this.state.dataSource
                });
            }
        });
    }
    modalSlipHide() {
        this.setState({
            modalSlipVisible: false
        });
    }
    modalSlipShow() {
        this.setState({
            modalSlipVisible: true
        });
    }
    onRowClick(record, index, cellDom) {
        this.setState({ selectedRowKey: record._ID });
    }
    rowClassName(record, index) {
        if (this.state.selectedRowKey === record._ID) {
            return 'selected-td';
        }
        return '';
    }
    /**
     * 展开的行变化时触发
     * expandedRows 行 1,2
     */
    onExpandedRowsChange(expandedRows) {
    }
    /**
     * 点击展开图标时触发
     * expanded 是否展开
     */
    onExpand(expanded, record) {
        if (expanded && record['children'].length == 0) {
            this.setState({
                loadingKey: record._ID
            });
            let promise = index_1.get('/menu_list', {
                parentId: record.ID,
            });
            promise.then((result) => {
                let menuList = result['data']['MenuList'];
                this.appendChildren(record._ID, menuList);
                //check
                let index = this.state.selectedRowKeys.indexOf(record._ID);
                this.adjustCheckSet(record._ID, index != -1);
                this.state.selectedRowKeys = this.unique(this.state.selectedRowKeys, false);
                this.setState({
                    loadingKey: '-1',
                    dataSource: this.state.dataSource
                });
            });
        }
        else {
            this.setState({
                loadingKey: '-1'
            });
        }
    }
    updateDataSource() {
        let promise = index_1.get('/menu_list', {
            // userId: 'xxx',
            // token: 'xxx',
            parentId: '-1',
        });
        promise.then((result) => {
            let menuList = result['data']['MenuList'];
            let verifyKeys = {};
            this.state.dataSource = menuList;
            this.findDataSource((menus, menu, index) => {
                if (menu.Name == '' || menu.ID == '') {
                    delete menus[index];
                }
                if (verifyKeys[menu.ID] == '1') {
                    delete menus[index];
                }
                verifyKeys[menu.ID] = '1';
            });
            this.setState({
                dataSource: menuList
            });
        });
        return promise;
    }
}
exports.EditableTable = EditableTable;
});
//# sourceMappingURL=_grid.js.map
