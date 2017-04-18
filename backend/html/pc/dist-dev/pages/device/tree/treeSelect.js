define("pages/device/tree/treeSelect.js",function(require, exports, module) {
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
const index_1 = require("../../../components/antd/index");
const index_2 = require("../../../components/ajax/index");
const TreeNode = index_1.TreeSelect.TreeNode;
/**
 * ajax demo
 *
 * @export
 * @class Component
 * @extends {React.Component<any, any>}
 */
class TreeSelectCom extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            value: undefined,
            treeData: []
        };
    }
    getRegionalArchitectureTreeListAjax() {
        return __awaiter(this, void 0, void 0, function* () {
            let parameter = this.props.treeType === 'region_tree' ? '/region_tree' : '/department_tree';
            let json = yield index_2.get(parameter, {});
            return json;
        });
    }
    getRegionChildrenAjax(parentId) {
        return __awaiter(this, void 0, void 0, function* () {
            let parameter = this.props.treeType === 'region_tree' ? '/region_children' : '/department_children';
            let json = yield index_2.get(parameter, {
                parentId: parentId
            });
            return json;
        });
    }
    componentWillMount() {
        this.getRegionalArchitectureTreeListAjax().then(value => {
            console.log(value);
            let treeData = [];
            let treeNodes = this.props.treeType === 'region_tree' ? value.data.Area : value.data.Organization;
            let treeObj = {
                label: treeNodes.Name,
                value: treeNodes.Name,
                key: treeNodes.ID,
                Tail: treeNodes.Tail,
                isLeaf: false,
                Type: treeNodes.Type
            };
            if (treeNodes.Area && treeNodes.Area.length) {
                treeObj.children = [];
                this.mapArea(treeNodes.Area, treeObj.children);
            }
            treeData.push(treeObj);
            this.setState({
                treeData: treeData
            });
        });
    }
    mapArea(area, nodeChildren) {
        area.map(value => {
            let nodeObj = {
                label: value.Name,
                value: value.Name,
                key: value.ID,
                Tail: value.Tail,
                isLeaf: false,
                Type: value.Type
            };
            nodeObj.isLeaf = value.Type === 'NSCompanys' ? true : false;
            nodeChildren.push(nodeObj);
            if (value.Area && value.Area.length) {
                nodeObj.children = [];
                nodeObj.Jurisdiction = true;
                this.mapArea(value.Area, nodeObj.children);
            }
        });
    }
    getNodeParentId(area, nodeId) {
        let item = area.find(item => item.key === nodeId);
        if (!item) {
            area.find(value => {
                if (value.children) {
                    item = this.getNodeParentId(value.children, nodeId);
                    return item;
                }
            });
        }
        return item;
    }
    onChange(value, label, extra) {
        const data = [...this.state.treeData];
        let keys = [];
        let parameter;
        if (this.props.multiple) {
            extra.allCheckedNodes.forEach(obj => {
                keys.push(obj.node.key);
            });
            keys.forEach(key => {
                let nodeItem = this.getNodeParentId(data, key);
                parameter.push({
                    nodeId: nodeItem.key,
                    nodeName: nodeItem.label
                });
            });
        }
        else {
            parameter = extra.triggerNode ? {
                nodeId: extra.triggerNode.props.eventKey,
                nodeName: extra.triggerNode.props.title
            } : {};
            if (extra.triggerNode) {
                let nodeItem = this.getNodeParentId(data, extra.triggerNode.props.eventKey);
                if (nodeItem.Type !== 'NSCompanys' && this.props.treeType === 'region_tree') {
                    index_1.message.info('请选择公司！');
                    return;
                }
            }
        }
        if (this.props.onGetNode) {
            this.props.onGetNode(parameter);
        }
        this.setState({ value });
    }
    onSelect(value, node, extra) {
        // let parameter = {
        //     nodeId: node.props.eventKey,
        //     nodeName: node.props.title
        // }
        // if (this.props.onGetNode) {
        //     this.props.onGetNode(parameter);
        // }
    }
    loadData(node) {
        const data = [...this.state.treeData];
        return new Promise((resolve) => {
            let treeItem = this.getNodeParentId(data, node.props.eventKey);
            if (treeItem.Tail === false) {
                resolve();
                return;
            }
            this.getRegionChildrenAjax(node.props.eventKey).then(value => {
                console.log(value);
                treeItem.children = [];
                value.data.forEach(obj => {
                    let treeNode = {
                        label: obj.Name,
                        value: obj.Name,
                        key: obj.ID,
                        Tail: obj.Tail,
                        isLeaf: false,
                        Type: obj.Type
                    };
                    treeNode.isLeaf = obj.Type === 'NSCompanys' ? true : false;
                    treeItem.children.push(treeNode);
                });
                this.setState({
                    treeData: data
                });
                resolve();
            });
        });
    }
    render() {
        return React.createElement(index_1.TreeSelect, { style: { width: 300 }, value: this.state.value, dropdownStyle: { maxHeight: 400, overflow: 'auto' }, placeholder: 'Please select', allowClear: true, treeData: this.state.treeData, onChange: this.onChange.bind(this), onSelect: this.onSelect.bind(this), multiple: this.props.multiple, treeCheckable: this.props.multiple, showCheckedStrategy: index_1.TreeSelect.SHOW_PARENT, loadData: this.loadData.bind(this) },
            React.createElement(TreeNode, { value: 'parent 1', title: 'parent 1', key: '0-1' },
                React.createElement(TreeNode, { value: 'parent 1-0', title: 'parent 1-0', key: '0-1-1' },
                    React.createElement(TreeNode, { value: 'leaf1', title: 'my leaf', key: 'random' }),
                    React.createElement(TreeNode, { value: 'leaf2', title: 'your leaf', key: 'random1' })),
                React.createElement(TreeNode, { value: 'parent 1-1', title: 'parent 1-1', key: 'random2' },
                    React.createElement(TreeNode, { value: 'sss', title: React.createElement("b", { style: { color: '#08c' } }, "sss"), key: 'random3' }))));
    }
}
exports.TreeSelectCom = TreeSelectCom;
});
//# sourceMappingURL=treeSelect.js.map
