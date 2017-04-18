define("pages/system/systemMenuManager/index.js",function(require, exports, module) {
"use strict";
const React = require("react");
exports.React = React;
// import { Link } from 'react-router';
// import { PageGenerics } from '../../../components/global/components';
const index_1 = require("../../../components/antd/index");
const _nav_1 = require("../_nav");
const _grid_1 = require("./_grid");
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
        let handleSave = () => {
            this.refs['table'].handleSave();
        };
        const operations = React.createElement("div", null,
            React.createElement(index_1.Button, { className: 'menu-manager-btn-add', type: "ghost", onClick: handleAdd }, "\u65B0\u589E\u83DC\u5355"),
            React.createElement(index_1.Button, { className: 'menu-manager-btn-add-lower', type: "ghost", onClick: handleAddChildren }, "\u65B0\u589E\u4E0B\u7EA7\u83DC\u5355"),
            React.createElement(index_1.Button, { className: 'menu-manager-btn-add-lower', type: "primary", onClick: handleSave }, "\u4FDD\u5B58"));
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
