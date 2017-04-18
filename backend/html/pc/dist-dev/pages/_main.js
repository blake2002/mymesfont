define("pages/_main.js",function(require, exports, module) {
"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const React = require("react");
const index_1 = require("../components/antd/index");
const index_2 = require("../components/ajax/index");
const react_router_1 = require("react-router");
const tree_list_1 = require("./device/tree/tree-list");
const value_1 = require("../components/global/value");
const index_3 = require("../components/util/index");
const label_1 = require("./device/label/label");
const index_4 = require("../components/privileges/index");
;
;
class Nav extends React.Component {
    /**
     * 获取当前页面的key
     *
     * @returns
     *
     * @memberOf DeviceMainLeft
     */
    getActuveKey() {
        let url = value_1.default.url;
        let obj = this.props.data.find(value => value.url === url);
        return this.props.data.indexOf(obj).toString();
    }
    tabsOnChange(key) {
        let url = this.props.data[key].url;
        react_router_1.hashHistory.push(url);
    }
    getOperations() {
        let url = value_1.default.url;
        let obj = this.props.data.find((value) => {
            return value.url === url;
        });
        // if(obj.operations != ''){ 
        return obj.operations;
        // }
        // else{ 
        //     return <span/>;
        // }
    }
    render() {
        return React.createElement(index_1.Tabs, { type: 'card', tabBarExtraContent: this.getOperations(), onChange: this.tabsOnChange.bind(this), activeKey: this.getActuveKey() }, this.props.data.map((value, index) => {
            return index_4.havePrivileges(value.privileges) && React.createElement(index_1.TabPane, { tab: value.name, key: index.toString() });
        }));
    }
}
exports.Nav = Nav;
;
;
/**
 * 右边头部标签页
 *
 * @export
 * @class MainRightTabs
 * @extends {PureComponentGenerics<IMainRightTabsProps, IMainRightTabsState>}
            */
class MainRightTabs extends React.Component {
    render() {
        let { props } = this;
        return React.createElement("section", { className: 'main-right-tabs' },
            React.createElement("div", { className: 'main-right-tabs-left ml20 mr20' }, props.leftContent),
            props.children);
    }
}
exports.MainRightTabs = MainRightTabs;
;
;
/**
 * 左边区域
 *
 * @class MainLeft
 * @extends {PureComponentGenerics<IMainLeftTreeProps, IMainLeftTreeState>}
            */
class MainLeft extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            seachText: value_1.default.query['seach'] || '',
            regionList: null,
            deviceList: null,
            memberList: null
        };
    }
    getRegionName() {
        this.getRegionNameResolve = null;
        return new Promise((resolve) => {
            // return resolve({
            //     id: '125',
            //     name: '2222'
            // });
            if (this.name) {
                resolve({
                    id: this.id,
                    name: this.name,
                    type: this.type
                });
            }
            else {
                this.getRegionNameResolve = resolve;
            }
        });
    }
    ajaxSeach() {
        return __awaiter(this, void 0, void 0, function* () {
            let { data } = yield index_2.get({
                url: this.props.type !== 'member' ? '/search_region_tree' : '/search_department_tree',
                data: {
                    searchTarget: this.props.type === 'relationMember' ? 'member' : 'device',
                    keyword: index_3.trim(this.state.seachText),
                    top: 10,
                    pageIndex: -1,
                    pageSize: -1
                },
                type: 2
            });
            this.state.regionList = data.RegionList || data.DepartmentList;
            this.state.deviceList = data.DeviceList;
            this.state.memberList = data.MemberList || data.UserList;
            this.setState(this.state);
            return data;
        });
    }
    onChange(e) {
        let target = e.target;
        this.state.seachText = target.value;
        this.setState(this.state);
        if (index_3.trim(this.state.seachText)) {
            this.ajaxSeach();
        }
    }
    renderBlue(text) {
        let str = text.replace(new RegExp(this.state.seachText, 'g'), `<span className="blue">${this.state.seachText}</span>`);
        return React.createElement("span", { dangerouslySetInnerHTML: { __html: str } });
    }
    getPathString(arr) {
        let str = '';
        arr.forEach(value => str += (value.Name + '-'));
        str.replace(/\-&/g, '');
        return str;
    }
    onDeviceClick(obj) {
        value_1.default.jump(value_1.default.url, {
            Id: obj.DeviceID || obj.UserID
        });
    }
    onRegionClick(obj) {
        value_1.default.jump(value_1.default.url, {
            regionId: obj.ID
        });
    }
    /**
     * 渲染搜索
     *
     * @returns
     *
     * @memberOf MainLeft
     */
    renderSeach() {
        let { state, props } = this;
        return React.createElement("section", { className: 'h100 oa' },
            state.regionList && React.createElement("dl", null,
                React.createElement("dt", null, "\u533A\u57DF\u8282\u70B9"),
                state.regionList.map((value, index) => {
                    return React.createElement("dd", { key: index, onClick: () => this.onRegionClick(value) },
                        this.getPathString(value.Path),
                        this.renderBlue(value.Name));
                })),
            state.deviceList && React.createElement("dl", null,
                React.createElement("dt", null, "\u8BBE\u5907"),
                state.deviceList.map((value, index) => {
                    return React.createElement("dd", { key: index, onClick: () => this.onDeviceClick(value) },
                        React.createElement("p", null, this.renderBlue(value.DeviceID)),
                        React.createElement("p", null, value.DeviceName));
                })),
            state.memberList && React.createElement("dl", null,
                React.createElement("dt", null, "\u4EBA\u5458"),
                state.memberList.map((value, index) => {
                    return React.createElement("dd", { key: index, onClick: () => this.onDeviceClick(value) },
                        React.createElement("p", null, this.renderBlue(value.Name)),
                        React.createElement("p", null, value.UserID));
                })));
    }
    renderTreeAndTag() {
        return React.createElement(index_1.Tabs, { type: 'card', defaultActiveKey: value_1.default.query['tagName'] ? '2' : '1' },
            React.createElement(index_1.TabPane, { tab: this.props.treeType === 'department_tree'
                    ? '组织架构' : '区域架构', key: '1' },
                React.createElement("section", { className: 'tabpane-content' },
                    React.createElement(tree_list_1.TreeList, { disabled: this.props.disabled, treeType: this.props.treeType, regionId: this.props.regionId, onClick: (id, name) => {
                            value_1.default.jump(value_1.default.url, {
                                regionId: id
                            });
                        }, onCompleted: (id, name, type) => {
                            this.id = id;
                            this.name = name;
                            this.type = type;
                            if (this.getRegionNameResolve) {
                                this.getRegionNameResolve({
                                    id: this.id,
                                    name: this.name,
                                    type: this.type
                                });
                            }
                        } }))),
            this.props.treeType === 'department_tree' || React.createElement(index_1.TabPane, { tab: '标签', key: '2' },
                React.createElement(label_1.Label, { type: this.props.LabelType || 'device', selectedName: value_1.default.query['tagName'], onLabelClick: obj => value_1.default.jump(value_1.default.url, {
                        tagName: obj.name
                    }) })));
    }
    renderInit() {
        let { state, props } = this;
        return index_3.trim(state.seachText) === '' ?
            this.renderTreeAndTag()
            : this.renderSeach();
    }
    onSearch() {
        let str = value_1.default.url;
        str = str.replace(/\/[^\/]+$/g, '/seach');
        delete value_1.default.query['seachCurrent'];
        value_1.default.jump(str, __assign({}, value_1.default.query, { seach: this.state.seachText }));
    }
    render() {
        let { state, props } = this;
        return (React.createElement("section", { className: 'main-left ' +
                (index_3.trim(state.seachText) === '' || this.props.children ? '' : 'skin-gray') },
            React.createElement("section", { className: 'box-seach' },
                React.createElement(index_1.InputSearch, { style: { width: '100%' }, value: this.state.seachText, onSearch: this.onSearch.bind(this), onChange: this.onChange.bind(this), placeholder: '请输入关键字' })),
            React.createElement("section", { className: 'main-left-content' }, (this.props.children && !this.state.regionList) ||
                (this.props.children && !this.state.seachText)
                ? this.props.children : this.renderInit())));
    }
}
exports.MainLeft = MainLeft;
;
;
class MainRightTitle extends React.Component {
    render() {
        let { props } = this;
        return (React.createElement("section", { className: 'main-right-title' },
            React.createElement("h3", null, props.title),
            React.createElement("div", { className: 'cf' },
                React.createElement("span", { className: 'fl' }, this.props.children),
                React.createElement("div", { className: 'fr' },
                    props.text,
                    props.text && React.createElement(index_1.Dropdown, { overlay: props.menu, trigger: ['click'] },
                        React.createElement(index_1.Icon, { className: 'ml5 cp', type: 'bars' }))))));
    }
}
exports.MainRightTitle = MainRightTitle;
;
;
class MainRightContent extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            dataSource: [],
            dataSourceIndex: 0,
            modalSlipContent: 'select',
            modalSlipTitle: '',
            total: 0,
            pageSize: 12,
            selectedRows: [],
            selectedRowKeys: [],
            count: null
        };
    }
    componentWillMount() {
        this.ajaxCount();
    }
    shouldComponentUpdate(props) {
        let query = this.props.query;
        let queryN = props.query;
        if (query.current !== queryN.current) {
            this.props.query.current = queryN.current;
            this.ajaxCount();
        }
        return true;
    }
    /**
     * 头部标题渲染
     *
     * @returns
     *
     * @memberOf MainRightContent
     */
    titleRender() {
        let { state, props } = this;
        let titleText = ``;
        if (state.count !== null) {
            titleText = `${props.titleText}(${state.count})`;
        }
        return React.createElement(MainRightTitle, { title: props.title, text: titleText, menu: this.props.titleMenu }, this.props.titleRender);
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
            let { data } = yield index_2.get(this.props.ajaxCount, {
                regionId: this.props.query.id || 125
            });
            this.state.count = data.count;
            this.setState(this.state);
            return data;
        });
    }
    onRowClick(record, index) {
        return __awaiter(this, void 0, void 0, function* () {
            this.state.modalSlipContent = 'details';
            this.state.modalSlipTitle = this.props.detailsTitle;
            yield this.props.onRowClick(record, index);
            this.setState(this.state);
        });
    }
    onPaginationChange(index) {
        let query = Object.assign({}, value_1.default.query);
        query['current'] = index;
        value_1.default.jump(value_1.default.url, query);
    }
    /**
     * 选中改变事件
     *
     * @param {any} selectedRowKeys
     * @param {any} selectedRows
     *
     * @memberOf MainRightContent
     */
    selectChange(selectedRowKeys, selectedRows) {
        this.state.selectedRows = selectedRows;
        this.state.modalSlipTitle = this.props.selectTitle || '批量选择';
        this.state.modalSlipContent = 'select';
        this.state.selectedRowKeys = [];
        selectedRows.forEach(value => {
            this.state.selectedRowKeys.push(value.key);
        });
        this.props.selectChange(selectedRowKeys, selectedRows);
    }
    getModalSlipContent() {
        switch (this.state.modalSlipContent) {
            case 'select':
                return this.props.selectRender;
            default:
                return this.props.detailsRender;
        }
    }
    render() {
        let { props, state } = this;
        return (React.createElement("section", { className: 'main-right-content' },
            this.titleRender(),
            React.createElement(index_1.Table, { className: 'mt20', rowSelection: {
                    selectedRowKeys: state.selectedRowKeys,
                    onChange: this.selectChange.bind(this)
                }, onRowClick: this.onRowClick.bind(this), loading: props.loading, pagination: false, dataSource: state.dataSource, columns: props.columns }),
            React.createElement(index_1.Pagination, { className: 'mt20', current: parseInt(props.query.current || '1', null), total: state.total, pageSize: state.pageSize, onChange: this.onPaginationChange.bind(this) }),
            React.createElement(index_1.ModalSlip, { title: state.modalSlipTitle, onCancel: () => this.props.onModalSlipCancel(), visible: props.modalSlipVisible }, this.getModalSlipContent()),
            props.children));
    }
}
exports.MainRightContent = MainRightContent;
});
//# sourceMappingURL=_main.js.map
