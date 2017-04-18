define("pages/device/device/_information.js",function(require, exports, module) {
"use strict";
const React = require("react");
exports.React = React;
const components_1 = require("../../../components/global/components");
const index_1 = require("../../../components/antd/index");
;
;
/**
 * 设备信息
 *
 * @class DeviceDrive
 * @extends {PureComponentGenerics<IDeviceDriveProps, IDeviceDriveState>}
 */
class DeviceDrive extends components_1.PureComponentGenerics {
    render() {
        return (React.createElement("section", null,
            React.createElement("table", { className: 'table-from' },
                React.createElement("tbody", null,
                    React.createElement("tr", null,
                        React.createElement("td", null, "\u8BBE\u5907\u7F16\u53F7")),
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement(index_1.Input, { placeholder: '请输入' }))),
                    React.createElement("tr", null,
                        React.createElement("td", null, "\u8BBE\u5907\u540D\u79F0")),
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement(index_1.Input, { placeholder: '请输入' }))),
                    React.createElement("tr", null,
                        React.createElement("td", null, "\u8BBE\u5907\u578B\u53F7")),
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement(index_1.Input, { placeholder: '请输入' }))),
                    React.createElement("tr", null,
                        React.createElement("td", null, "\u5B89\u88C5\u5730\u70B9")),
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement(index_1.Input, { placeholder: '请输入' }))),
                    React.createElement("tr", null,
                        React.createElement("td", null, "\u7ECF\u5EA6")),
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement(index_1.Input, { placeholder: '请输入' }))),
                    React.createElement("tr", null,
                        React.createElement("td", null, "\u7EAC\u5EA6")),
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement(index_1.Input, { placeholder: '请输入' }))),
                    React.createElement("tr", null,
                        React.createElement("td", null, "\u5B89\u88C5\u65F6\u95F4")),
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement(index_1.DatePicker, { placeholder: '点击选择' }))),
                    React.createElement("tr", null,
                        React.createElement("td", null, "\u5B9E\u65F6\u6570\u636E\u5E93")),
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement(index_1.Input, { placeholder: '请输入' }))),
                    React.createElement("tr", null,
                        React.createElement("td", null, "\u5173\u8054\u6D41\u7A0B\u56FE")),
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement(index_1.Select, { style: { width: '100%' }, defaultValue: '1' },
                                React.createElement(index_1.Option, { value: '1' }, "\u5206\u7EC41"),
                                React.createElement(index_1.Option, { value: '2' }, "\u5206\u7EC42"),
                                React.createElement(index_1.Option, { value: '3' }, "\u5206\u7EC4")))),
                    React.createElement("tr", null,
                        React.createElement("td", null, "\u5206\u7EC4")),
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement(index_1.Select, { style: { width: '100%' }, defaultValue: '1' },
                                React.createElement(index_1.Option, { value: '1' }, "\u5206\u7EC41"),
                                React.createElement(index_1.Option, { value: '2' }, "\u5206\u7EC42"),
                                React.createElement(index_1.Option, { value: '3' }, "\u5206\u7EC4"))))))));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DeviceDrive;
});
//# sourceMappingURL=_information.js.map
