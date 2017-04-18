define("pages/test/antd/index.js",function(require, exports, module) {
"use strict";
const React = require("react");
const index_1 = require("../../../components/button/index");
const index_2 = require("../../../components/select/index");
const index_3 = require("../../../components/input/index");
const index_4 = require("../../../components/pagination/index");
const index_5 = require("../../../components/tree/index");
const index_6 = require("../../../components/date-picker/index");
const index_7 = require("../../../components/notification/index");
const index_8 = require("../../../components/validate/index");
const index_9 = require("../../../components/text-input/index");
let TreeNode = index_5.default.TreeNode;
index_8.addRule({
    key: 'gan',
    messages: () => '必须 = 你好',
    rule: (value, parameter) => value === '你好',
});
const Option = index_2.default.Option;
class Component extends React.PureComponent {
    render() {
        return React.createElement("section", { className: 'page=home' },
            React.createElement("h2", null, "\u63D2\u4EF6"),
            React.createElement("ul", null,
                React.createElement("li", null,
                    React.createElement("h3", null, "\u6309\u94AE"),
                    React.createElement(index_1.default, null, "Hello world2!")),
                React.createElement("li", null,
                    React.createElement("h3", null, "\u5206\u9875"),
                    React.createElement(index_4.default, { total: 50 })),
                React.createElement("li", null,
                    React.createElement("h3", null, "\u4E0B\u62C9\u6846"),
                    React.createElement(index_2.default, { size: 'large', defaultValue: 'lucy', style: { width: 200 }, onChange: handleChange },
                        React.createElement(Option, { value: 'jack' }, "Jack"),
                        React.createElement(Option, { value: 'lucy' }, "Lucy"),
                        React.createElement(Option, { value: 'disabled', disabled: true }, "Disabled"),
                        React.createElement(Option, { value: 'yiminghe' }, "Yiminghe"))),
                React.createElement("li", null,
                    React.createElement("h3", null, "\u8F93\u5165\u6846"),
                    React.createElement(index_3.default, null)),
                React.createElement("li", null,
                    React.createElement("h3", null, "\u5F39\u7A97"),
                    React.createElement(index_1.default, { onClick: () => index_7.success({
                            message: '你好',
                            description: 'success'
                        }) }, "success"),
                    React.createElement(index_1.default, { onClick: () => index_7.error({
                            message: '你好',
                            description: 'error'
                        }) }, "error")),
                React.createElement("li", null,
                    React.createElement("h3", null, "\u65F6\u95F4"),
                    React.createElement(index_6.default, null)),
                React.createElement("li", null,
                    React.createElement("h3", null, "\u6811"),
                    React.createElement(index_5.default, { className: 'myCls' },
                        React.createElement(TreeNode, { title: 'parent 1', key: '0-0' },
                            React.createElement(TreeNode, { title: 'parent 1-0', key: '0-0-0', disabled: true },
                                React.createElement(TreeNode, { title: 'leaf', key: '0-0-0-0', disableCheckbox: true }),
                                React.createElement(TreeNode, { title: 'leaf', key: '0-0-0-1' })),
                            React.createElement(TreeNode, { title: 'parent 1-1', key: '0-0-1' },
                                React.createElement(TreeNode, { title: React.createElement("span", { style: { color: '#08c' } }, "sss"), key: '0-0-1-0' })))))),
            React.createElement("h2", null, "\u9A8C\u8BC1\u63D2\u4EF6"),
            React.createElement("div", null,
                React.createElement("h3", null, "\u5B57\u7B26\u4E32\u957F\u5EA6 \u5927\u5C0F=>10 =<20"),
                React.createElement(index_8.default, { required: true, min: 10, max: 20 })),
            React.createElement("div", null,
                React.createElement("h3", null, "\u5B57\u7B26\u4E32\u957F\u5EA6 \u6700\u77ED10 \u6700\u957F12"),
                React.createElement(index_8.default, { required: true, minLength: 10, maxLength: 12 })),
            React.createElement("div", null,
                React.createElement("h3", null, "\u53EA\u80FD\u8F93\u5165\u82F1\u6587\u548C\u6570\u5B57\u548C\u4E2D\u6587"),
                React.createElement(index_8.default, { noSymbol: true })),
            React.createElement("div", null,
                React.createElement("h3", null, "\u624B\u673A\u53F7\u7801"),
                React.createElement(index_8.default, { telephone: true })),
            React.createElement("div", null,
                React.createElement("h3", null, "\u81EA\u5B9A\u4E49\u89C4\u5219"),
                React.createElement(index_8.default, { gan: true }),
                React.createElement("code", null, `addRule({
                        key: 'gan',
                        messages: () => '必须 = 你好',
                        rule: (value, parameter) => value === '你好',
                    })`)),
            React.createElement("div", null,
                React.createElement("h3", null, "\u81EA\u5B9A\u4E49\u89C4\u5219"),
                React.createElement(index_8.default, { gan: true }),
                React.createElement("code", null, `addRule({
                        key: 'gan',
                        messages: () => '必须 = 你好',
                        rule: (value, parameter) => value === '你好',
                    })`)),
            React.createElement("div", null,
                React.createElement("h3", null, "\u624B\u673A\u53F7\u7801 \u663E\u793A"),
                React.createElement("section", null,
                    React.createElement(index_9.default, { telephone: true, defaultValue: '可修改' }))));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Component;
function handleChange(value) {
    console.log(`selected ${value}`);
}
});
//# sourceMappingURL=index.js.map
