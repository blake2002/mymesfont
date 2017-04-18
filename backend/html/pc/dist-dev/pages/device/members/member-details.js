define("pages/device/members/member-details.js",function(require, exports, module) {
"use strict";
const React = require("react");
const components_1 = require("../../../components/global/components");
const index_1 = require("../../../components/antd/index");
;
;
/**
 * 设备报警
 *
 * @class DeviceDrive
 * @extends {PureComponentGenerics<IDeviceDriveProps, IDeviceDriveState>}
 */
class DeviceDrive extends components_1.PureComponentGenerics {
    constructor() {
        super(...arguments);
        this.menu = React.createElement(index_1.Menu, { onClick: this.handleMenuClick },
            React.createElement(index_1.Menu.Item, { key: '1' }, "\u79FB\u9664\u5173\u6CE8"),
            React.createElement(index_1.Menu.Item, { key: '2' }, "\u590D\u5236"),
            React.createElement(index_1.Menu.Item, { key: '3' }, "\u79FB\u52A8"),
            React.createElement(index_1.Menu.Item, { key: '4' }, "\u5220\u9664"),
            React.createElement(index_1.Menu.Item, { key: '5' }, "\u65E5\u5FD7"));
    }
    handleMenuClick() {
    }
    render() {
        let { props } = this;
        return (React.createElement("section", { className: 'device-details' },
            React.createElement(index_1.Button, { className: 'btn-position' }, "\u5173\u6CE8"),
            React.createElement("h4", null,
                React.createElement("p", null, "\u4E0A\u6D77\u8FEA\u65AF\u5C3C"),
                React.createElement("p", null, "DSN_YXNM1012")),
            React.createElement("table", { className: 'table-details' },
                React.createElement("tbody", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, "\u8BBE\u5907\u7F16\u53F7"),
                        React.createElement("td", null, props.data['1'])),
                    React.createElement("tr", null,
                        React.createElement("th", null, "\u8BBE\u5907\u540D\u79F0"),
                        React.createElement("td", null)),
                    React.createElement("tr", null,
                        React.createElement("th", null, "\u8BBE\u5907\u578B\u53F7"),
                        React.createElement("td", null)),
                    React.createElement("tr", null,
                        React.createElement("th", null, "\u5B89\u88C5\u5730\u70B9"),
                        React.createElement("td", null)),
                    React.createElement("tr", null,
                        React.createElement("th", null, "\u7ECF\u5EA6"),
                        React.createElement("td", null)),
                    React.createElement("tr", null,
                        React.createElement("th", null, "\u7EAC\u5EA6"),
                        React.createElement("td", null)),
                    React.createElement("tr", null,
                        React.createElement("th", null, "\u5B89\u88C5\u65F6\u95F4"),
                        React.createElement("td", null)),
                    React.createElement("tr", null,
                        React.createElement("th", null, "\u5B9E\u65F6\u6570\u636E\u5E93"),
                        React.createElement("td", null)),
                    React.createElement("tr", null,
                        React.createElement("th", null, "\u5173\u8054\u6D41\u7A0B\u56FE"),
                        React.createElement("td", null)),
                    React.createElement("tr", null,
                        React.createElement("th", null, "\u533A\u57DF\u67B6\u6784"),
                        React.createElement("td", null)))),
            React.createElement("section", { className: 'component-slip-footer' },
                React.createElement(index_1.Button, null, "\u7F6E\u9876"),
                React.createElement(index_1.Button, null, "\u4FEE\u6539"),
                React.createElement(index_1.Button, null, "\u542F\u52A8"),
                React.createElement(index_1.Dropdown, { overlay: this.menu },
                    React.createElement(index_1.Button, null, "\u66F4\u591A")))));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DeviceDrive;
});
//# sourceMappingURL=member-details.js.map
