define("pages/device/device/add/_variable.js",function(require, exports, module) {
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
const index_1 = require("../../../../components/antd/index");
const index_2 = require("../../../../components/ajax/index");
const index_3 = require("../../../../components/antd/index");
const index_4 = require("../../../../components/util/index");
const index_5 = require("../../../../components/template-input/index");
;
;
class Com extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            data: [],
            template: [],
            _ID: '',
            modalSlipVisible: false,
            modalSlipTitle: '批量选择',
            loading: true,
            selectedRows: [],
            selectedRowKeys: [],
            selectedIndex: null,
            deleteList: [],
            tableWidth: 50
        };
        this.columns = [];
        this.data = [];
        this.banArray = [];
    }
    /**
     * 生成colums
     *
     *
     * @memberOf TableText
     */
    saveColums() {
        this.columns = [];
        this.state.tableWidth = 50;
        this.state.template.forEach((value, index) => {
            if (!value.Visible) {
                let width = (value.Form.Properties && value.Form.Properties.Width) || 120;
                this.columns.push({
                    title: value.Description,
                    dataIndex: value.Name,
                    width: width,
                    render: this.renderText(value)
                });
                this.state.tableWidth += width || 100;
            }
        });
        // console.log(this.columns);
    }
    ajaxGetDate(categroy) {
        return __awaiter(this, void 0, void 0, function* () {
            let { data } = yield index_2.get('/device_attribute', {
                deviceId: this.props.deviceId,
                categroy: categroy
            });
            data[this.props.categroy].forEach((value, index) => {
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
                value.key = value._ID.ParameterValue;
            });
            return data;
        });
    }
    perfectValue() {
    }
    /**
     * 获取数据
     *
     *
     * @memberOf TableText
     */
    getData(categroy) {
        return __awaiter(this, void 0, void 0, function* () {
            this.state.loading = true;
            this.setState(this.state);
            let data = yield this.ajaxGetDate(this.props.categroy);
            this.state.loading = false;
            // this.state.data = [data[this.props.categroy][0]];
            this.state.data = data[this.props.categroy];
            this.state.template = data[this.props.categroy + 'Template'].Props;
            this.state._ID = data._ID;
            this.saveColums();
            this.setState(this.state);
        });
    }
    componentWillMount() {
        this.getData();
    }
    renderText(template) {
        return (data, value, index) => {
            if (data) {
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
    ajaxUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            let list = this.getUpdate();
            if (list.length) {
                yield index_2.post('/modified_device_attribute', {
                    _ID: this.state._ID,
                    categroy: this.props.categroy,
                    deviceId: this.props.deviceId,
                    props: list
                });
            }
            let addlist = this.getUpdate('add');
            if (addlist.length) {
                yield index_2.post('/new_device_attribute', {
                    _ID: this.state._ID,
                    categroy: this.props.categroy,
                    deviceId: this.props.deviceId,
                    props: addlist
                });
            }
            let deletelist = this.state.deleteList;
            if (deletelist.length) {
                yield index_2.post('/delete_device_attribute', {
                    _ID: this.state._ID,
                    categroy: this.props.categroy,
                    deviceId: this.props.deviceId,
                    itemIds: deletelist.map(value => value['_ID'].ParameterValue)
                });
                this.modalSlipVisible(false);
                this.state.selectedRows = [];
                this.componentWillMount();
            }
            this.componentWillMount();
            index_3.message.success('保存成功!');
        });
    }
    /**
     * 是否有改动
     *
     * @returns
     *
     * @memberOf Com
     */
    isChange() {
        let list = this.getUpdate();
        let addlist = this.getUpdate('add');
        let deletelist = this.state.deleteList;
        if (list.length || addlist.length || deletelist.length) {
            return true;
        }
        else {
            return false;
        }
    }
    add() {
        let newObj = {
            key: index_4.uuid()
        };
        this.state.template.forEach(value => {
            newObj[value.Name] = {
                ParameterName: value.Name,
                ParameterValue: value.DefaultValue || '',
                _stateType: 'add'
            };
        });
        this.state.data.push(newObj);
        this.setState(this.state);
    }
    // clearUpdata() {
    //     this.state.data.forEach(value => {
    //         for (let key in value) {
    //             let element = value[key];
    //             element._stateType = null;
    //         }
    //     });
    // }
    getUpdate(type = 'update') {
        let updateList = [];
        this.state.data.forEach(value => {
            let obj = {};
            if (type === 'update') {
                obj['_ID'] = value['_ID'] && value['_ID'].ParameterValue;
            }
            let update = false;
            for (let key in value) {
                let element = value[key];
                if (element._stateType === type) {
                    update = true;
                    obj[element.ParameterName] = element.ParameterValue;
                }
            }
            if (update) {
                updateList.push(obj);
            }
        });
        return updateList;
    }
    selectChange(selectedRowKeys) {
        this.state.selectedRowKeys = selectedRowKeys;
        this.state.selectedRows = [];
        this.state.selectedRowKeys.forEach((value, index) => {
            let data = this.state.data.find(data => data['key'] === value);
            this.state.selectedRows.push(data);
        });
        this.modalSlipVisible(selectedRowKeys.length !== 0);
        this.setState(this.state);
    }
    modalSlipVisible(bl) {
        this.state.modalSlipVisible = bl;
        this.setState(this.state);
    }
    onDelete(value) {
        return __awaiter(this, void 0, void 0, function* () {
            this.state.data = this.state.data.filter(value => {
                let index = this.state.selectedRows.indexOf(value);
                if (index === -1) {
                    return true;
                }
                else {
                    if (value['_ID']) {
                        this.state.deleteList.push(value);
                    }
                    return false;
                }
            });
            this.state.modalSlipVisible = false;
            this.state.selectedRows = [];
            // console.log(this.state.deleteList);
            // 临时解决选中和文本失去焦点时候的setState冲突
            setTimeout(() => {
                this.setState(this.state);
            }, 0);
        });
    }
    selectRender() {
        return React.createElement("section", null,
            React.createElement("ul", { className: 'ul-details' }, this.state.selectedRows.map((data, index) => {
                return React.createElement("li", { key: index }, data[this.props.showText].ParameterValue);
            })),
            React.createElement("section", { className: 'component-slip-footer' },
                React.createElement(index_3.Button, { privileges: this.props.privileges + ':remove', onClick: () => {
                        this.onDelete(this.state.selectedRows);
                    } }, "\u5220\u9664")));
    }
    modalShow() {
        this.refs['SelectVar'].modalShow(true);
    }
    onOk(data) {
        data.forEach(value => {
            let obj = {};
            this.state.template.forEach(template => {
                obj[template.Name] = {
                    ParameterName: template.Name,
                    ParameterValue: value[template.Name] || template.DefaultValue || '',
                    _stateType: 'add'
                };
            });
            obj['key'] = value['_ID'] || value['UserID'];
            this.state.data.push(obj);
        });
        this.setState(this.state);
    }
    moveUp() {
        let { state, props } = this;
        let selectedData = state.data[state.selectedIndex];
        let nextData = state.data[state.selectedIndex - 1];
        if (nextData) {
            let orderbyIndex = selectedData['OrderbyIndex'].ParameterValue;
            selectedData['OrderbyIndex'].ParameterValue = nextData['OrderbyIndex'].ParameterValue;
            nextData['OrderbyIndex'].ParameterValue = orderbyIndex;
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
            let orderbyIndex = selectedData['OrderbyIndex'].ParameterValue;
            selectedData['OrderbyIndex'].ParameterValue = nextData['OrderbyIndex'].ParameterValue;
            selectedData['OrderbyIndex']._stateType = 'update';
            nextData['OrderbyIndex'].ParameterValue = orderbyIndex;
            nextData['OrderbyIndex']._stateType = 'update';
            state.data[state.selectedIndex] = nextData;
            state.data[state.selectedIndex + 1] = selectedData;
            state.selectedIndex++;
            this.setState(this.state);
        }
    }
    onRowClick(record, index, e) {
        this.state.selectedIndex = index;
        this.setState(this.state);
    }
    rowClassName(record, index) {
        if (index === this.state.selectedIndex) {
            return 'selected-td';
        }
        if (record.isRelatedProperty) {
            return 'visible-td';
        }
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
    additional() {
    }
    rowSelection() {
        return {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.selectChange.bind(this)
        };
    }
    render() {
        let { state, props } = this;
        return (React.createElement("section", null,
            React.createElement(index_1.Table, { className: 'edit-table', loading: state.loading, dataSource: this.state.data, columns: this.columns, pagination: false, rowSelection: this.rowSelection(), scroll: {
                    x: state.tableWidth,
                    y: this.getTableHeight()
                }, rowClassName: this.rowClassName.bind(this), onRowClick: this.onRowClick.bind(this) }),
            React.createElement(index_3.ModalSlip, { title: '批量选择', onCancel: () => this.modalSlipVisible(false), visible: state.modalSlipVisible }, state.modalSlipVisible && this.selectRender()),
            props.categroy === 'NSDutyCard' ?
                React.createElement(SelectMember, { ref: 'SelectVar', onOk: this.onOk.bind(this) }) :
                React.createElement(SelectVar, { deviceId: this.props.deviceId, ref: 'SelectVar', onOk: this.onOk.bind(this) }),
            this.additional()));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Com;
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
            data: [],
            pageSize: 10,
            total: 0,
            current: 0,
            seachText: ''
        };
        this.columns = [
            {
                title: '人员编号',
                dataIndex: 'UserID',
                key: 'UserID'
            },
            {
                title: '名字',
                dataIndex: 'Name',
                key: 'Name'
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
            let { data } = yield index_2.get('/user_list', {
                departmentId: this.props.departmentId || '-1',
                cateFilter: 'all',
                keyword: this.state.seachText,
                pageIndex: 1,
                pageSize: this.state.pageSize
            });
            this.state.total = this.state.pageSize * data.pageCount;
            this.state.current = data.pageIndex;
            this.state.data = data.pageList;
            this.state.data.forEach((value, index) => {
                value.key = value.UserID;
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
    /**
     * 分页改变事件
     *
     * @param {any} index
     *
     * @memberOf SelectMember
     */
    onPaginationChange(index) {
        this.state.current = index;
        this.getNSDevicesVarInfoList();
        this.setState(this.state);
    }
    onChange(e) {
        let target = e.target;
        this.state.seachText = target.value;
    }
    onSearch(e) {
        this.getNSDevicesVarInfoList();
    }
    rowSelection() {
        return {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.selectChange.bind(this)
        };
    }
    render() {
        let { state, props } = this;
        return React.createElement(index_3.Modal, { title: '选择人员', visible: this.state.visible, onOk: this.handleOk.bind(this), onCancel: () => this.modalShow(false) },
            React.createElement("div", { className: 'modal-Content' },
                React.createElement("div", null,
                    React.createElement(index_3.InputSearch, { style: { width: '100%' }, placeholder: '请输入关键字', onChange: this.onChange.bind(this), onSearch: this.onSearch.bind(this) })),
                React.createElement(index_1.Table, { className: 'edit-table mt20', loading: state.loading, dataSource: this.state.data, columns: this.columns, pagination: false, scroll: { y: 400 }, rowSelection: this.rowSelection() }),
                React.createElement(index_3.Pagination, { className: 'mt20', current: state.current, total: state.total, pageSize: state.pageSize, onChange: this.onPaginationChange.bind(this) })));
    }
}
exports.SelectMember = SelectMember;
;
;
class SelectVar extends React.Component {
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
                title: '姓名',
                dataIndex: 'VarName',
                key: 'VarName'
            },
            {
                title: '描述',
                dataIndex: 'Description',
                key: 'Description'
            }
        ];
    }
    renderText() {
        return (text, value, index) => {
            console.log(value);
            return React.createElement("span", null);
        };
    }
    ajaxGetDate(categroy) {
        return __awaiter(this, void 0, void 0, function* () {
            let { data } = yield index_2.get('/device_attribute', {
                deviceId: this.props.deviceId,
                categroy: categroy
            });
            data[categroy].forEach((value, index) => {
                value.key = value._ID;
            });
            return data;
        });
    }
    getNSDevicesVarInfoList() {
        return __awaiter(this, void 0, void 0, function* () {
            this.state.loading = true;
            let data = yield this.ajaxGetDate('NSDevicesVarInfo');
            this.state.data = data['NSDevicesVarInfo'];
            this.state.loading = false;
            this.setState(this.state);
        });
    }
    // componentWillMount() {
    //     this.getNSDevicesVarInfoList();
    // }
    modalShow(bl) {
        if (bl && this.state.data.length === 0) {
            this.getNSDevicesVarInfoList();
        }
        this.setState({
            visible: bl
        });
    }
    handleOk() {
        // let selectRows = this.state.selectedRows.map((value, index) => {
        //     let obj = Object.assign(value);
        //     for (let key in obj) {
        //         if (obj.hasOwnProperty(key)) {
        //             let element = obj[key];
        //             obj[key] = {
        //                 ParameterName: key,
        //                 ParameterValue: element
        //             }
        //         }
        //     }
        //     return obj;
        // })
        // console.log(selectRows);
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
        return React.createElement(index_3.Modal, { title: '选择变量', visible: this.state.visible, onOk: this.handleOk.bind(this), onCancel: () => this.modalShow(false) },
            React.createElement("div", { className: 'modal-Content' },
                React.createElement(index_1.Table, { className: 'edit-table', loading: state.loading, dataSource: this.state.data, columns: this.columns, pagination: false, scroll: { y: 400 }, rowSelection: {
                        selectedRowKeys: state.selectedRowKeys,
                        onChange: this.selectChange.bind(this)
                    } })));
    }
}
});
//# sourceMappingURL=_variable.js.map
