define("pages/system/roleManager/roleAttribute/_roleNav.js",function(require, exports, module) {
"use strict";
const React = require("react");
exports.React = React;
const components_1 = require("../../../../components/global/components");
const index_1 = require("../../../../components/antd/index");
const _roleAttribute_1 = require("./_roleAttribute");
const _roleMenuTree_1 = require("./_roleMenuTree");
const Option = index_1.Select.Option;
class RoleNav extends components_1.PageGenerics {
    constructor() {
        super(...arguments);
        this.state = {
            activeKey: '1'
        };
        this.onChange = (activeKey) => {
            this.setState({
                activeKey
            });
        };
        this.save = () => {
            if (this.state.activeKey == '1')
                this.refs['role_attribute'].save();
            else
                this.refs['role_auth'].save();
        };
    }
    componentWillMount() {
    }
    tabBarExtraContentRender() {
        return React.createElement(index_1.Button, { className: 'menu-manager-btn-add', type: "primary", onClick: this.save }, "\u4FDD\u5B58");
    }
    handleAreaChange(value) {
        console.log(`selected ${value}`);
    }
    render() {
        let { state, props } = this;
        return React.createElement("section", { className: 'h100 page-device' },
            React.createElement("section", null,
                React.createElement("section", { className: 'main-right-tabs' },
                    React.createElement("div", { className: 'main-right-tabs-left ml20 mr20' },
                        React.createElement(index_1.Button, { onClick: () => this.props.goBack() }, " \u8FD4\u56DE")),
                    React.createElement(index_1.Tabs, { defaultActiveKey: '1', type: 'card', onChange: this.onChange, activeKey: this.state.activeKey, tabBarExtraContent: this.tabBarExtraContentRender() },
                        React.createElement(index_1.TabPane, { tab: '角色属性', key: '1' },
                            React.createElement(_roleAttribute_1.default, { ref: 'role_attribute', query: this.props.query })),
                        React.createElement(index_1.TabPane, { tab: '角色授权', key: '2' }, React.createElement(_roleMenuTree_1.default, { ref: 'role_auth', query: this.props.query }))))));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RoleNav;
});
//# sourceMappingURL=_roleNav.js.map
