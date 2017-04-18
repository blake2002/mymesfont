define("pages/system/dict/index.js",function(require, exports, module) {
"use strict";
const React = require("react");
exports.React = React;
// import { PageGenerics } from '../../../components/global/components';
const index_1 = require("../../../components/antd/index");
const _nav_1 = require("../_nav");
const _grid_1 = require("./_grid");
require("./index.css");
class Device extends React.Component {
    constructor() {
        super(...arguments);
        this.onSave = () => {
            this.refs['table'].onSave();
        };
        this.onNew = () => {
            this.refs['table'].onNew();
        };
    }
    componentWillMount() {
    }
    render() {
        const operations = React.createElement("div", null,
            React.createElement(index_1.Button, { className: 'mr10', onClick: this.onNew }, "\u65B0\u589E\u8BCD\u5178"),
            React.createElement(index_1.Button, { type: 'primary', onClick: this.onSave }, "\u4FDD\u5B58"));
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
