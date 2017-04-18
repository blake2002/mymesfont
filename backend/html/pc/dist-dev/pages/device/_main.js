define("pages/device/_main.js",function(require, exports, module) {
"use strict";
const React = require("react");
const components_1 = require("../../components/global/components");
const index_1 = require("../../components/tabs/index");
const tree_list_1 = require("../device/tree/tree-list");
;
;
class DeviceMainLeft extends components_1.PageGenerics {
    /**
     * 获取当前页面的key
     *
     * @returns
     *
     * @memberOf DeviceMainLeft
     */
    getActuveKey() {
        switch (this.props.url) {
            case '/device/device/index':
                return '1';
            case '/device/members/index':
                return '2';
            case '/device/members/index':
                return '3';
        }
    }
    tabsOnChange(key) {
        let url = '';
        switch (key) {
            case '1':
                url = '/device/device/index';
                break;
            case '2':
                url = '/device/members/index';
                break;
        }
        this.props.jump(url);
    }
    render() {
        return React.createElement(MainLeft, { id: this.props.id },
            React.createElement(index_1.default, { type: 'card', onChange: this.tabsOnChange.bind(this), activeKey: this.getActuveKey() },
                React.createElement(index_1.TabPane, { tab: '设备管理', key: '1' }),
                React.createElement(index_1.TabPane, { tab: '人员管理', key: '2' }),
                React.createElement(index_1.TabPane, { tab: '人员管理', key: '3' })),
            React.createElement("section", { className: 'main-right-content' }, this.props.children));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DeviceMainLeft;
;
;
/**
 * 左边树列表
 *
 * @class MainLeft
 * @extends {PureComponentGenerics<IMainLeftProps, IMainLeftState>}
 */
class MainLeft extends components_1.PureComponentGenerics {
    render() {
        return React.createElement("section", { className: 'h100 page-device' },
            React.createElement("section", { className: 'main-left' },
                React.createElement("section", { className: 'box-seach' },
                    React.createElement(Search, { style: { width: '100%' }, placeholder: 'input search text', onSearch: value => console.log(value) })),
                React.createElement(index_1.default, { type: 'card' },
                    React.createElement(index_1.TabPane, { tab: '区域架构', key: '1' },
                        React.createElement(tree_list_1.TreeList, null)),
                    React.createElement(index_1.TabPane, { tab: '标签', key: '2' },
                        React.createElement("section", { className: 'tabpane-content' }, "\u7A7A")))),
            React.createElement("section", { className: 'main-right' }, this.props.children));
    }
}
exports.MainLeft = MainLeft;
});
//# sourceMappingURL=_main.js.map
