define("pages/device/device/index.js",function(require, exports, module) {
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
const react_router_1 = require("react-router");
const components_1 = require("../../../components/global/components");
const index_1 = require("../../../components/antd/index");
const index_2 = require("../../../components/ajax/index");
const _main_1 = require("../../_main");
// import { DeviceData } from './types';
const _nav_1 = require("../_nav");
const _details_1 = require("./_details");
require("./index.css");
const value_1 = require("../../../components/global/value");
const selectTree_1 = require("../selectTree/selectTree");
const index_3 = require("../../../components/privileges/index");
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
        /**
         * 表单 columns 属性
         *
         *
         * @memberOf Device
         */
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
                key: '5',
                render: this.columnsRender.bind(this)
            }];
        this.title = '设备';
        this.addUrl = '/device/device/add';
        this.ajaxGetUrl = '/device_list';
        this.ajaxLableGetUrl = '/tag_device_list';
        this.ajaxUpdata = '/modified_device';
        this.treeType = 'region_tree';
        this.state = {
            detailsDataSource: null,
            dataSource: [],
            modalSlipVisible: false,
            modalSlipType: 'select',
            loading: true,
            count: {
                all: 0,
                concerned: 0,
                disabled: 0
            },
            cateFilter: 'all',
            total: 0,
            pageSize: 12,
            selectedIndex: null,
            selectedRows: [],
            selectedRowKeys: [],
            modalSlipTitle: this.title + '详情',
            title: '',
            regionId: this.props.query.regionId,
            regionType: 'NSPlanets',
            treeVisible: false,
            treeSelectId: ''
        };
    }
    rowClassName(record, index) {
        if (index === this.state.selectedIndex) {
            return 'selected-td';
        }
    }
    getRegionId() {
        return __awaiter(this, void 0, void 0, function* () {
            let regionId = this.props.query.regionId;
            if (!regionId) {
                if (!this.state.regionId) {
                    yield this.setTitle();
                }
                regionId = this.state.regionId;
            }
            return regionId;
        });
    }
    /**
     * 获取统计数量
     *
     * @returns
     *
     * @memberOf MainRightContent
     */
    ajaxCount() {
        return __awaiter(this, void 0, void 0, function* () {
            let regionId = yield this.getRegionId();
            let { data } = yield index_2.get('/device_count', {
                regionId: regionId
            });
            this.state.count = data;
            this.setStateMerge();
            return data;
        });
    }
    /**
     * 更新
     *
     * @param {any} value
     * @param {string} [key]
     *
     * @memberOf Device
     */
    ajaxUpdate(value, key) {
        return __awaiter(this, void 0, void 0, function* () {
            let dataProps = [];
            if (key) {
                dataProps.push({
                    'ParameterName': key,
                    'ParameterValue': value[key]
                });
            }
            yield index_2.post(this.ajaxUpdata, {
                deviceId: value.DeviceID,
                props: {
                    NSDevices: dataProps
                }
            });
            index_1.message.success('修改成功！');
        });
    }
    /**
     * 根据选中设备删除
     *
     * @param {any[]} value
     *
     * @memberOf Device
     */
    ajaxDelete(value) {
        return __awaiter(this, void 0, void 0, function* () {
            let arr = value.map(value => value.DeviceID);
            yield index_2.post('/delete_device', {
                deviceIds: arr
            });
            this.modalSlipVisible(false);
            this.componentDidMount();
            index_1.message.success('删除成功！');
        });
    }
    ajaxGetDetail() {
        return __awaiter(this, void 0, void 0, function* () {
            let { data } = yield index_2.get('/device_detail', {
                deviceId: this.props.query.Id,
                categroy: 'NSDevices'
            });
            let Path = data.NSDevices.RegionPath[0].Path;
            this.state.regionId = Path[Path.length - 1].ID;
            return {
                pageCount: 1,
                pageIndex: 1,
                pageList: [data.NSDevices]
            };
        });
    }
    ajaxGet() {
        return __awaiter(this, void 0, void 0, function* () {
            let { props } = this;
            let regionId = yield this.getRegionId();
            let { data } = yield index_2.get(this.ajaxGetUrl, Object.assign({
                regionId: regionId,
                pageIndex: props.query.current || 1,
                pageSize: this.state.pageSize,
                cateFilter: props.query.cateFilter || 'all'
            }, {}));
            return data;
        });
    }
    ajaxGetList() {
        return __awaiter(this, void 0, void 0, function* () {
            let { props } = this;
            if (this.props.query.tagName) {
                let { data } = yield index_2.get(this.ajaxLableGetUrl, Object.assign({
                    tagName: this.props.query.tagName,
                    pageSize: this.state.pageSize,
                    pageIndex: props.query.current || 1,
                }, {}));
                return data;
            }
            else if (this.props.query.Id) {
                return yield this.ajaxGetDetail();
            }
            else {
                return yield this.ajaxGet();
            }
        });
    }
    /**
     * table数据更新
     *
     *
     * @memberOf Device
     */
    getDataSource() {
        return __awaiter(this, void 0, void 0, function* () {
            let { props } = this;
            this.state.loading = true;
            let data = yield this.ajaxGetList();
            if (data.pageCount < props.query.current) {
                props.query.current = data.pageCount;
            }
            // 清空选中！
            this.state.selectedRowKeys = [];
            this.onSelectChange('', []);
            this.state.dataSource = data.pageList;
            this.state.dataSource.forEach((value, index) => {
                value.key = index.toString();
            });
            this.state.total = data.pageCount * this.state.pageSize;
            this.state.loading = false;
            this.setStateMerge();
        });
    }
    /**
     * 弹窗显示隐藏
     *
     * @param {any} bl
     *
     * @memberOf Device
     */
    modalSlipVisible(bl) {
        this.state.modalSlipVisible = bl;
        this.setStateMerge();
    }
    /**
     * 选择框删除事件
     *
     * @param {any[]} value
     *
     * @memberOf Device
     */
    onDelete(value) {
        index_1.Modal.confirm({
            title: '删除',
            content: '确定删除吗？',
            onOk: () => this.ajaxDelete(value)
        });
    }
    ajaxMoveDevice(idArray) {
        return __awaiter(this, void 0, void 0, function* () {
            yield index_2.post('/move_device', {
                deviceIds: idArray,
                newCompanyId: this.state.treeSelectId
            });
            this.state.treeVisible = false;
            this.componentDidMount();
            index_1.message.success('移动成功！');
        });
    }
    onGetNode(obj) {
        this.state.treeSelectId = obj[0].id;
    }
    onOkTree() {
        this.ajaxMoveDevice(this.state.selectedRows.map(value => value.DeviceID));
    }
    renderTree() {
        return React.createElement(index_1.Modal, { onOk: this.onOkTree.bind(this), visible: this.state.treeVisible, title: '移动', onCancel: () => {
                this.state.treeVisible = false;
                this.setState(this.state);
            } },
            React.createElement(selectTree_1.MyTreeSelect, { jurisdiction: 'only', onGetNode: this.onGetNode.bind(this), treeType: this.treeType }));
    }
    onTagDelete() {
        return __awaiter(this, void 0, void 0, function* () {
            let row = this.state.selectedRows;
            yield index_2.post('/untag_device', {
                deviceIds: row.map(value => value.DeviceID),
                tagNames: [this.props.query.tagName]
            });
            index_1.message.success('删除成功！');
            this.componentDidMount();
        });
    }
    /**
     * 选择框渲染
     *
     * @returns
     *
     * @memberOf Device
     */
    selectRender() {
        return React.createElement("section", null,
            React.createElement("ul", { className: 'ul-details' }, this.state.selectedRows.map((value, index) => {
                return React.createElement("li", { key: index + 1 }, value['DeviceID'] + ' ' + value['DeviceName']);
            })),
            React.createElement("section", { className: 'component-slip-footer' },
                React.createElement(index_1.Button, { privileges: '/device/devices:move', onClick: () => {
                        this.state.treeVisible = true;
                        this.setState(this.state);
                    } }, "\u79FB\u52A8"),
                this.props.query.tagName && React.createElement(index_1.Button, { onClick: this.onTagDelete.bind(this) }, "\u5220\u9664\u6807\u7B7E"),
                React.createElement(index_1.Button, { privileges: '/device/devices:delete', onClick: () => this.onDelete(this.state.selectedRows) }, "\u5220\u9664")));
    }
    /**
     * 详情渲染
     *
     * @returns {JSX.Element}
     *
     * @memberOf Device
     */
    detailsRender() {
        let { state } = this;
        return React.createElement(_details_1.default, { regionId: this.state.regionId, id: this.state.detailsDataSource.DeviceID, query: this.props.query, onChange: () => this.getDataSource() });
    }
    /**
     * 筛选点击事件
     *
     *
     * @memberOf Device
     */
    onMenuClick(obj) {
        let key = obj.key;
        this.props.query.cateFilter = key;
        value_1.default.jump(value_1.default.url, this.props.query);
    }
    /**
     * 筛选渲染
     *
     * @returns
     *
     * @memberOf Device
     */
    menuRender() {
        let { state } = this;
        return React.createElement(index_1.Menu, { onClick: this.onMenuClick.bind(this) },
            React.createElement(index_1.Menu.Item, { key: 'all' },
                "\u5168\u90E8\u8BBE\u5907\uFF08",
                state.count.all,
                "\uFF09"),
            React.createElement(index_1.Menu.Item, { key: 'concerned' },
                "\u5DF2\u5173\u6CE8\uFF08",
                state.count.concerned,
                "\uFF09"),
            React.createElement(index_1.Menu.Item, { key: 'disabled' },
                "\u7981\u7528\uFF08",
                state.count.disabled,
                "\uFF09"));
    }
    /**
     * 改变标题
     *
     *
     * @memberOf Device
     */
    setTitle() {
        return __awaiter(this, void 0, void 0, function* () {
            let tree = this.refs['tree'];
            let obj = yield tree.getRegionName();
            this.state.title = obj.name;
            this.state.regionId = obj.id;
            this.state.regionType = obj.type;
            this.setStateMerge();
        });
    }
    /**
     * 头部标题渲染
     *
     * @returns
     *
     * @memberOf MainRightContent
     */
    titleRender() {
        let { state } = this;
        let titleText = `全部${this.title}(${state.count.all})`;
        if (this.props.query.cateFilter === 'concerned') {
            titleText = `已关注(${state.count.concerned})`;
        }
        if (this.props.query.cateFilter === 'disabled') {
            titleText = `禁用(${state.count.disabled})`;
        }
        return React.createElement(_main_1.MainRightTitle, { title: this.state.title, text: titleText, menu: this.menuRender() }, this.titleAddRender());
    }
    titleAddRender() {
        let { state } = this;
        this.props.query.regionId = this.state.regionId;
        return React.createElement(index_3.default, { value: '/device/devices:new' }, state.regionType === 'NSCompanys' && React.createElement(react_router_1.Link, { to: {
                pathname: this.addUrl,
                query: this.props.query
            } },
            "\u65B0\u589E",
            this.title));
    }
    /**
     * 禁用按钮改变事件
     *
     * @param {any} checked
     * @param {any} value
     *
     * @memberOf Device
     */
    onSwitchChange(checked, value) {
        return __awaiter(this, void 0, void 0, function* () {
            value.Enable = checked.toString();
            yield this.ajaxUpdate(value, 'Enable');
            this.setStateMerge();
        });
    }
    /**
     * 启用禁用的渲染
     *
     * @param {any} text
     * @param {any} value
     * @returns
     *
     * @memberOf Device
     */
    columnsRender(text, value) {
        return React.createElement("span", { onClick: (e) => e.stopPropagation() },
            React.createElement(index_1.Switch, { onChange: (checked) => this.onSwitchChange(checked, value), checked: text === 'true' ? true : false }));
    }
    /**
     * 分页改变事件
     *
     * @param {any} index
     *
     * @memberOf Device
     */
    onPaginationChange(index) {
        let query = Object.assign({}, value_1.default.query);
        query['current'] = index;
        value_1.default.jump(value_1.default.url, query);
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
        this.state.selectedIndex = index;
        this.state.detailsDataSource = record;
        this.state.modalSlipTitle = this.title + '详情';
        this.state.modalSlipType = 'details';
        this.modalSlipVisible(true);
        this.setStateMerge();
    }
    /**
     * 选中改变事件
     *
     * @param {any} selectedRowKeys
     * @param {any} selectedRows
     *
     * @memberOf Device
     */
    onSelectChange(selectedRowKeys, selectedRows) {
        this.state.selectedRows = selectedRows;
        this.state.modalSlipTitle = '批量选择';
        this.state.modalSlipType = 'select';
        this.state.selectedRowKeys = [];
        selectedRows.forEach(value => {
            this.state.selectedRowKeys.push(value.key);
        });
        this.modalSlipVisible(selectedRows.length !== 0);
        this.setStateMerge();
    }
    getTableHeight() {
        let height = document.body.clientHeight - 355;
        if (height <= this.state.dataSource.length * 55) {
            return height;
        }
        else {
            return null;
        }
    }
    /**
     * 导航渲染
     *
     *
     * @memberOf Device
     */
    navRender() {
        return React.createElement(_nav_1.default, null);
    }
    /**
     * 额外渲染
     *
     *
     * @memberOf Device
     */
    extraRender() {
    }
    renderMainLeft() {
        return React.createElement(_main_1.MainLeft, { type: 'device', treeType: this.treeType, regionId: this.state.regionId, ref: 'tree' });
    }
    render() {
        let { state, props } = this;
        return React.createElement("section", { className: 'h100 page-device' },
            this.renderMainLeft(),
            React.createElement("section", { className: 'main-right' },
                this.navRender(),
                React.createElement("section", { className: 'main-right-content' },
                    React.createElement("section", { className: 'main-right-content-box' },
                        this.props.query.tagName ? false : this.titleRender(),
                        React.createElement(index_1.Table, { className: 'mt20', scroll: { y: this.getTableHeight() }, rowSelection: {
                                selectedRowKeys: state.selectedRowKeys,
                                onChange: this.onSelectChange.bind(this)
                            }, onRowClick: this.onRowClick.bind(this), loading: state.loading, rowClassName: this.rowClassName.bind(this), pagination: false, dataSource: state.dataSource, columns: this.columns }),
                        React.createElement(index_1.Pagination, { className: 'mt20', current: parseInt(props.query.current || '1', null), total: state.total, pageSize: state.pageSize, onChange: this.onPaginationChange.bind(this) }),
                        React.createElement(index_1.ModalSlip, { title: state.modalSlipType === 'select' ? '批量选择' : this.title + '详情', onCancel: () => this.modalSlipVisible(false), visible: state.modalSlipVisible }, state.modalSlipType === 'select' ? this.selectRender() : this.detailsRender()),
                        props.children,
                        this.extraRender(),
                        this.renderTree()))));
    }
    /**
     * 组件渲染完毕获取ajax数据
     *
     *
     * @memberOf Device
     */
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setTitle();
            this.ajaxCount();
            this.getDataSource();
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Device;
});
//# sourceMappingURL=index.js.map
