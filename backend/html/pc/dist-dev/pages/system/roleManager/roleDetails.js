define("pages/system/roleManager/roleDetails.js",function(require, exports, module) {
"use strict";
const React = require("react");
exports.React = React;
const components_1 = require("../../../components/global/components");
const index_1 = require("../../../components/antd/index");
const Option = index_1.Select.Option;
class DeviceAdd extends components_1.PageGenerics {
    constructor() {
        super(...arguments);
        this.state = {};
    }
    componentWillMount() {
    }
    tabBarExtraContentRender() {
        return React.createElement("div", null);
    }
    handleAreaChange(value) {
        console.log(`selected ${value}`);
    }
    tabBarRoleAttRender() {
        let area = [];
        if (this.props.query.Area == '' || this.props.query.Area == undefined) {
            area = [];
        }
        else if (this.props.query.Area.indexOf(';') != -1) {
            area = this.props.query.Area.split(';');
            area.length > 1 && area.pop();
        }
        else {
            area = [this.props.query.Area];
        }
        let organization = [];
        if (this.props.query.Organization == '' || this.props.query.Organization == undefined) {
            organization = [];
        }
        else if (this.props.query.Organization.indexOf(';') != -1) {
            organization = this.props.query.Organization.split(';');
            organization.length > 1 && organization.pop();
        }
        else {
            organization = [this.props.query.Organization];
        }
        let { state, props } = this;
        console.log(area);
        return React.createElement("table", { className: 'table-from' },
            React.createElement("tbody", null,
                React.createElement("tr", null,
                    React.createElement("th", null, "\u89D2\u8272\u540D\u79F0")),
                React.createElement("tr", null,
                    React.createElement("td", null,
                        React.createElement(index_1.Input, { defaultValue: props.query.Name }))),
                React.createElement("tr", null,
                    React.createElement("th", null, "\u89D2\u8272\u6807\u8BC6")),
                React.createElement("tr", null,
                    React.createElement("td", null,
                        React.createElement(index_1.Input, { defaultValue: props.query.ID }))),
                React.createElement("tr", null,
                    React.createElement("th", null, "\u89D2\u8272\u7C7B\u578B")),
                React.createElement("tr", null,
                    React.createElement("td", null,
                        React.createElement(index_1.Input, { defaultValue: props.query.Type }))),
                React.createElement("tr", null,
                    React.createElement("th", null, "\u533A\u57DF\u67B6\u6784")),
                React.createElement("tr", null,
                    React.createElement("td", null,
                        React.createElement(index_1.Select, { multiple: true, style: { width: '100%' }, placeholder: "Please select", defaultValue: area, onChange: this.handleAreaChange }))),
                React.createElement("tr", null,
                    React.createElement("th", null, "\u7EC4\u7EC7\u67B6\u6784")),
                React.createElement("tr", null,
                    React.createElement("td", null,
                        React.createElement(index_1.Select, { multiple: true, style: { width: '100%' }, placeholder: "Please select", defaultValue: organization, onChange: this.handleAreaChange })))));
    }
    roleAuthRender() {
        return React.createElement("div", null);
    }
    render() {
        let { state, props } = this;
        return React.createElement("section", { className: 'h100 page-device' },
            React.createElement("section", null,
                React.createElement("section", { className: 'main-right-tabs' },
                    React.createElement("div", { className: 'main-right-tabs-left ml20 mr20' },
                        React.createElement(index_1.Button, { onClick: () => this.props.goBack() }, " \u8FD4\u56DE")),
                    React.createElement(index_1.Tabs, { defaultActiveKey: '1', type: 'card', tabBarExtraContent: this.tabBarExtraContentRender() },
                        React.createElement(index_1.TabPane, { tab: '角色属性', key: '1' }, this.tabBarRoleAttRender()),
                        React.createElement(index_1.TabPane, { tab: '角色授权', key: '2' }, this.roleAuthRender())))));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DeviceAdd;
});
//# sourceMappingURL=roleDetails.js.map
