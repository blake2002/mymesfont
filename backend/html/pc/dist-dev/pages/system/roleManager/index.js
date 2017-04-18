define("pages/system/roleManager/index.js",function(require, exports, module) {
"use strict";
const React = require("react");
exports.React = React;
const react_router_1 = require("react-router");
// import { PageGenerics } from '../../../components/global/components';
const index_1 = require("../../../components/antd/index");
const _nav_1 = require("../_nav");
const _grid_1 = require("./_grid");
require("./index.css");
class Device extends React.Component {
    componentWillMount() {
    }
    render() {
        const operations = React.createElement("div", null,
            React.createElement(react_router_1.Link, { to: {
                    pathname: '/system/roleManager/roleAttribute/_roleNav',
                } },
                React.createElement(index_1.Button, null, "\u65B0\u5EFA")));
        return React.createElement("section", { className: 'h100 page-device' },
            React.createElement("section", null,
                React.createElement(_nav_1.default, { operations: operations }),
                React.createElement(_grid_1.EditableTable, { ref: 'table' })));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Device;
});
//# sourceMappingURL=index.js.map
