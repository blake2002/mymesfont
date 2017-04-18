define("pages/device/selectTree/mytree.js",function(require, exports, module) {
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
const index_1 = require("../../../components/tree/index");
const index_2 = require("../../../components/antd/index");
const index_3 = require("../../../components/ajax/index");
const TreeNode = index_1.default.TreeNode;
const gData = []; // 架构树数据
class Mytree extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            gData,
            expandedKeys: [],
            visible: false,
            autoExpandParent: true,
            defaultValue: '',
            handle: '',
            checkedKeys: [],
            selectedKeys: []
        };
    }
    getRegionalArchitectureTreeListAjax() {
        return __awaiter(this, void 0, void 0, function* () {
            let parameter = this.props.treeType === 'region_tree' ? '/region_tree' : '/department_tree';
            let json = yield index_3.get(parameter, {});
            return json;
        });
    }
    getRegionChildrenAjax(parentId) {
        return __awaiter(this, void 0, void 0, function* () {
            let parameter = this.props.treeType === 'region_tree' ? '/region_children' : '/department_children';
            let json = yield index_3.get(parameter, {
                parentId: parentId
            });
            return json;
        });
    }
    getTreeForefather(nodeId) {
        return __awaiter(this, void 0, void 0, function* () {
            let parameter = this.props.treeType === 'region_tree' ? '/region_tree_forefather' :
                '/department_tree_forefather';
            let requestArguments = this.props.treeType === 'region_tree' ? { regionId: nodeId } :
                { departmentId: nodeId };
            let json = yield index_3.get(parameter, requestArguments);
            return json;
        });
    }
    componentWillMount() {
        this.getRegionalArchitectureTreeListAjax().then(value => {
            const data = [...this.state.gData];
            let rootData = this.props.treeType === 'department_tree' ? value.data.Organization : value.data.Area; // 根节点
            let Nodeobj = {
                key: rootData.ID,
                title: rootData.Name,
                nodeType: this.props.treeType === 'department_tree' ? 'root' : rootData.Type,
                parentNodeId: '',
                OrderbyIndex: rootData.OrderbyIndex,
                Tail: rootData.Tail
            }; // 节点
            if (rootData.Area && rootData.Area.length) {
                Nodeobj.children = [];
                this.mapArea(rootData.Area, rootData.ID, Nodeobj.children);
            }
            data.push(Nodeobj);
            let [checkedKeys, selectedKeys] = [[], []];
            if (this.props.value) {
                this.props.value.forEach(item => {
                    checkedKeys.push(item.id);
                    selectedKeys.push(item.id);
                });
            }
            this.setState({
                gData: data,
                checkedKeys,
                selectedKeys
            });
        });
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedNode) {
            this.setState({
                checkedKeys: nextProps.selectedNode,
                selectedKeys: nextProps.selectedNode
            });
        }
    }
    onSelect(e, obj) {
        const data = [...this.state.gData];
        let nodeItem = this.getNodeParentId(data, obj.node.props.eventKey);
        if (nodeItem.nodeType !== 'NSCompanys' && this.props.treeType === 'region_tree'
            && this.props.jurisdiction === 'only') {
            index_2.message.info('请选择公司！');
            return;
        }
        else if (this.props.jurisdiction === 'part' && this.props.treeType === 'region_tree' &&
            nodeItem.nodeType === 'NSPlanets') {
            index_2.message.info('不能选择根节点！');
            return;
        }
        let parameter = [];
        e.forEach(value => {
            let item = this.getNodeParentId(data, value);
            parameter.push({
                id: item.key,
                name: item.title,
                type: item.nodeType
            });
        });
        if (this.props.onClick) {
            this.props.onClick(parameter);
        }
        this.setState({
            checkedKeys: e,
            selectedKeys: e
        });
    }
    onCheck(e, obj) {
        const data = [...this.state.gData];
        let nodeItem = this.getNodeParentId(data, obj.node.props.eventKey);
        if (nodeItem.nodeType !== 'NSCompanys' && this.props.treeType === 'region_tree'
            && this.props.jurisdiction === 'only') {
            index_2.message.info('请选择公司！');
            return;
        }
        else if (this.props.jurisdiction === 'part' && this.props.treeType === 'region_tree' &&
            nodeItem.nodeType === 'NSPlanets') {
            index_2.message.info('不能选择根节点！');
            return;
        }
        let parameter = [];
        e.forEach(value => {
            let item = this.getNodeParentId(data, value);
            parameter.push({
                id: item.key,
                name: item.title,
                type: item.nodeType
            });
        });
        if (this.props.onClick) {
            this.props.onClick(parameter);
        }
        this.setState({
            checkedKeys: e,
            selectedKeys: e
        });
    }
    mapArea(area, parentId, nodeChildren) {
        area.map(value => {
            let nodeObj = {
                key: value.ID,
                title: value.Name,
                nodeType: value.Type,
                parentNodeId: parentId,
                OrderbyIndex: value.OrderbyIndex,
                isLeaf: false
            };
            nodeObj.isLeaf = value.Type === 'NSCompanys' ? true : false;
            nodeChildren.push(nodeObj);
            if (value.Area && value.Area.length) {
                nodeObj.children = [];
                nodeObj.Jurisdiction = true;
                this.mapArea(value.Area, value.ID, nodeObj.children);
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
    loop(data, key, callback) {
        let flag = false;
        data.find((item, index, arr) => {
            if (flag) {
                return true;
            }
            if (item.key === key) {
                flag = true;
                return callback(item, index, arr);
            }
            if (item.children) {
                return this.loop(item.children, key, callback);
            }
        });
    }
    onExpand(expandedKeys, obj) {
        const data = [...this.state.gData];
        if (obj.expanded) {
            let parentKey = obj.node.props.eventKey;
            this.loop(data, parentKey, (item) => {
                if (item.children !== undefined) {
                    this.setState({
                        expandedKeys,
                        autoExpandParent: false
                    });
                    return;
                }
                this.getRegionChildrenAjax(item.key).then((value) => {
                    if (value.data === undefined) {
                        this.setState({
                            expandedKeys,
                            autoExpandParent: false
                        });
                        return;
                    }
                    item.children = item.children || [];
                    value.data.forEach(obj => {
                        let nodeObj = {
                            key: obj.ID,
                            title: obj.Name,
                            nodeType: this.props.treeType === 'region_tree' ? obj.Type : 'NSCompanys',
                            parentNodeId: item.key,
                            Tail: obj.Tail,
                            OrderbyIndex: obj.OrderbyIndex,
                            isLeaf: false
                        };
                        nodeObj.isLeaf = obj.Type === 'NSCompanys' ? true : false;
                        item.children.push(nodeObj);
                    });
                    this.setState({
                        expandedKeys,
                        autoExpandParent: false,
                        gData: data
                    });
                });
            });
        }
        else {
            this.setState({
                expandedKeys,
                autoExpandParent: false
            });
        }
    }
    loadData(node) {
        return new Promise((resolve) => {
            resolve();
        });
    }
    render() {
        const loop = data => data.map((item) => {
            return React.createElement(TreeNode, { key: item.key, title: React.createElement("span", null, item.title), isLeaf: item.isLeaf }, item.children && item.children.length && loop(item.children));
        });
        return (React.createElement(index_1.default, { multiple: this.props.multiple, checkable: this.props.multiple, checkStrictly: this.props.multiple, checkedKeys: this.state.checkedKeys, selectedKeys: this.state.selectedKeys, onSelect: this.onSelect.bind(this), onCheck: this.onCheck.bind(this), expandedKeys: this.state.expandedKeys, onExpand: this.onExpand.bind(this), autoExpandParent: this.state.autoExpandParent, loadData: this.loadData.bind(this), className: 'selectTree' }, loop(this.state.gData)));
    }
}
exports.Mytree = Mytree;
});
//# sourceMappingURL=mytree.js.map
