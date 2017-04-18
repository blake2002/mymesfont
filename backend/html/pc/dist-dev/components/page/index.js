define("components/page/index.js",function(require, exports, module) {
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
const components_1 = require("../global/components");
const index_1 = require("../antd/index");
const index_2 = require("../ajax/index");
;
;
/**
 * 右边头部标签页
 *
 * @export
 * @class MainRightTabs
 * @extends {PureComponentGenerics<IMainRightTabsProps, IMainRightTabsState>}
 */
class MainRightTabs extends components_1.PureComponentGenerics {
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
class MainLeft extends components_1.PureComponentGenerics {
    render() {
        let { props } = this;
        return (React.createElement("section", { className: 'main-left' },
            React.createElement("section", { className: 'box-seach' },
                React.createElement(index_1.InputSearch, { style: { width: '100%' }, placeholder: 'input search text', onSearch: value => console.log(value) })),
            React.createElement(index_1.Tabs, { type: 'card' },
                React.createElement(index_1.TabPane, { tab: '区域架构', key: '1' },
                    React.createElement("section", { className: 'tabpane-content' }, props.children)),
                React.createElement(index_1.TabPane, { tab: '标签', key: '2' },
                    React.createElement("section", { className: 'tabpane-content' }, "\u7A7A")))));
    }
}
exports.MainLeft = MainLeft;
;
;
class MainRightTitle extends components_1.PureComponentGenerics {
    render() {
        let { props } = this;
        return (React.createElement("section", { className: 'main-right-title' },
            React.createElement("h3", null, props.title),
            React.createElement("div", { className: 'cf' },
                React.createElement("span", { className: 'fl' }, this.props.children),
                React.createElement("div", { className: 'fr' },
                    props.text,
                    React.createElement(index_1.Dropdown, { overlay: props.menu, trigger: ['click'] },
                        React.createElement(index_1.Icon, { className: 'ml5 cp', type: 'bars' }))))));
    }
}
;
;
class MainRightContent extends components_1.PureComponentGenerics {
    constructor() {
        super(...arguments);
        this.states = {
            dataSource: [],
            dataSourceIndex: 0,
            detailsVisible: false,
            current: (() => {
                let current = this.props.current;
                if (current) {
                    return parseInt(current, null);
                }
                else {
                    return 1;
                }
            })(),
            total: 0,
            loading: true
        };
    }
    titleMenu() {
        return (React.createElement(index_1.Menu, null,
            React.createElement(index_1.Menu.Item, null, "\u5168\u90E8\u8BBE\u5907\uFF085\uFF09"),
            React.createElement(index_1.Menu.Item, null, "\u5DF2\u5173\u6CE8\uFF083\uFF09"),
            React.createElement(index_1.Menu.Item, null, "\u672A\u5173\u6CE8\u5173\u6CE8\uFF083\uFF09"),
            React.createElement(index_1.Menu.Item, null, "\u7981\u7528\uFF080\uFF09")));
    }
    titleRender() {
        return React.createElement(MainRightTitle, { title: this.props.title, text: this.props.titleText, menu: this.titleMenu() }, this.props.titleRender);
    }
    onDetailsHide() {
        this.states.detailsVisible = false;
        this.setState(this.states);
    }
    onRowClick(record, index) {
        this.states.detailsVisible = true;
        this.props.onRowClick(record, index);
        this.setState(this.states);
    }
    onPaginationChange(index) {
        let query = Object.assign({}, this.props.query);
        query['current'] = index;
        this.states.current = index;
        this.props.jump(this.props.url, query);
    }
    getDataSource() {
        return __awaiter(this, void 0, void 0, function* () {
            let dataArray = [];
            let { states, props } = this;
            let nu = this.props.current * 10 - 10;
            for (let index = 0 + nu; index < 10 + nu; index++) {
                dataArray.push(Object.assign({}, {
                    '1': '设备编号' + index,
                    '2': '实时数据库',
                    '3': '设备名称',
                    '4': '设备型号',
                    '5': '启用/禁用'
                }));
            }
            let { data } = yield index_2.post(props.ajaxUrl, {
                status: 0,
                data: {
                    data: dataArray,
                    total: 100,
                    current: states.current
                },
                comment: ''
            });
            states.loading = false;
            states.dataSource = data.data;
            states.total = data.total;
            states.current = data.current;
            this.setState(states);
        });
    }
    componentDidMount() {
        this.getDataSource();
    }
    componentDidUpdate() {
        this.getDataSource();
    }
    render() {
        let { props, states } = this;
        return (React.createElement("section", { className: 'main-right-content' },
            this.titleRender(),
            React.createElement(index_1.Table, { className: 'mt20', onRowClick: this.onRowClick.bind(this), loading: states.loading, pagination: false, dataSource: states.dataSource, columns: props.columns }),
            React.createElement(index_1.Pagination, { className: 'mt20', current: states.current, total: states.total, pageSize: 10, onChange: this.onPaginationChange.bind(this) }),
            React.createElement(index_1.ModalSlip, { title: props.detailsTitle, onCancel: this.onDetailsHide.bind(this), visible: states.detailsVisible }, props.details),
            props.children));
    }
}
exports.MainRightContent = MainRightContent;
});
//# sourceMappingURL=index.js.map
