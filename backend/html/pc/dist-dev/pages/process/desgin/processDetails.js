define("pages/process/desgin/processDetails.js",function(require, exports, module) {
"use strict";
const React = require("react");
exports.React = React;
const components_1 = require("../../../components/global/components");
const index_1 = require("../../../components/antd/index");
const _main_1 = require("../../_main");
class DeviceAdd extends components_1.PageGenerics {
    constructor() {
        super(...arguments);
        this.state = {};
    }
    componentWillMount() {
    }
    render() {
        let { state, props } = this;
        return React.createElement("section", { className: 'h100 page-device' },
            React.createElement(_main_1.MainLeft, null),
            React.createElement("section", { className: 'main-right' },
                React.createElement("section", { className: 'main-right-tabs' },
                    React.createElement("div", { className: 'main-right-tabs-left ml20 mr20' },
                        React.createElement(index_1.Button, { onClick: () => this.props.goBack() }, " \u8FD4\u56DE")))));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DeviceAdd;
});
//# sourceMappingURL=processDetails.js.map
