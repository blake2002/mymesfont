define("pages/test/index.js",function(require, exports, module) {
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const React = require("react");
const index_1 = require("../../components/antd/index");
class Component extends React.Component {
    constructor() {
        super(...arguments);
        this.props = {
            keys: ['0-0-0', '0-0-1']
        };
        this.state = {
            defaultExpandedKeys: this.props.keys,
            defaultSelectedKeys: this.props.keys,
            defaultCheckedKeys: this.props.keys,
        };
    }
    onSelect(info) {
        console.log('selected', info);
    }
    onCheck(info) {
        console.log('onCheck', info);
    }
    onLoadData() {
        return __awaiter(this, void 0, void 0, function* () {
            return React.createElement(index_1.TreeNode, { title: "leaf", key: "0-0-111gfhdghdghdgh11-1" });
        });
    }
    render() {
        return (React.createElement(index_1.Tree, { className: "myCls", showLine: true, checkable: true, defaultExpandedKeys: this.state.defaultExpandedKeys, defaultSelectedKeys: this.state.defaultSelectedKeys, defaultCheckedKeys: this.state.defaultCheckedKeys, onSelect: this.onSelect, onCheck: this.onCheck, loadData: this.onLoadData.bind(this) },
            React.createElement(index_1.TreeNode, { title: "parent 1-0", key: "0-0-0" },
                React.createElement(index_1.TreeNode, { title: "parent 1-0", key: "0-0-0123" },
                    React.createElement(index_1.TreeNode, { title: "adfasdfadf", key: "0-0-0-0123", isLeaf: true }),
                    React.createElement(index_1.TreeNode, { title: "leaf", key: "0-0-0-11231" })),
                React.createElement(index_1.TreeNode, { title: "leaf", key: "0-0-0-1" })),
            React.createElement(index_1.TreeNode, { title: "parent 1-1", key: "0-0-1", isLeaf: true })));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Component;
class Component2 extends React.PureComponent {
    render() {
        return React.createElement("section", { className: 'page=home' },
            React.createElement("h2", null, "\u7B80\u5355\u4F8B\u5B502"),
            React.createElement("div", null, this.props.text2));
    }
}
});
//# sourceMappingURL=index.js.map
