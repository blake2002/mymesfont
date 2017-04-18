define("pages/process/desgin/index.js",function(require, exports, module) {
"use strict";
const React = require("react");
exports.React = React;
// import { Link } from 'react-router';
// import { PageGenerics } from '../../../components/global/components';
const index_1 = require("../../../components/antd/index");
const _nav_1 = require("../_nav");
const _cell_1 = require("./_cell");
require("./index.css");
class Device extends React.Component {
    componentWillMount() {
    }
    render() {
        let handleAdd = () => {
            this.refs['table'].handleAdd();
        };
        let handleAddChildren = () => {
            this.refs['table'].handleAddChildren();
        };
        const operations = React.createElement("div", null,
            React.createElement(index_1.Button, { className: 'menu-manager-btn-add', type: "ghost", onClick: handleAdd }, "\u65B0\u5EFA\u6D41\u7A0B"),
            React.createElement(index_1.Button, { className: 'menu-manager-btn-add-lower', type: "ghost", onClick: handleAddChildren }, "\u5BFC\u5165\u6D41\u7A0B"));
        return React.createElement("section", { className: 'h100 page-device' },
            React.createElement("section", null,
                React.createElement(_nav_1.default, { operations: operations }),
                React.createElement(_cell_1.EditableTable, { query: 1, ref: 'table' })));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Device;
});
//# sourceMappingURL=index.js.map
