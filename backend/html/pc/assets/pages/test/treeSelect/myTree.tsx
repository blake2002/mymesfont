import * as React from 'react';
import Tree from '../../../components/tree/index';
import { message } from '../../../components/antd/index';
import { get, post } from '../../../components/ajax/index';

const TreeNode = Tree.TreeNode;

const gData = [];  // 架构树数据

export class Mytree extends React.Component<any, any> {
    state = {
        gData,
        expandedKeys: [],
        visible: false,
        autoExpandParent: true,
        defaultValue: '',
        handle: '',
        selectedKeys: []
    }
    async getRegionalArchitectureTreeListAjax() {   // 获取区域架构树
        let parameter = this.props.treeType === 'region_tree' ? '/region_tree' : '/department_tree';
        let json = await get(parameter, {});
        return json;
    }
    async getRegionChildrenAjax(parentId) {  // 获取子节点
        let parameter = this.props.treeType === 'region_tree' ? '/region_children' : '/department_children';
        let json = await get(parameter, {
            parentId: parentId
        });
        return json;
    }
    async getTreeForefather(nodeId) {   // 获取节点所有祖先节点id
        let parameter = this.props.treeType === 'region_tree' ? '/region_tree_forefather' :
            '/department_tree_forefather';
        let requestArguments = this.props.treeType === 'region_tree' ? { regionId: nodeId } :
            { departmentId: nodeId };
        let json = await get(parameter, requestArguments);
        return json;
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
            };   // 节点
            if (rootData.Area && rootData.Area.length) {  // 权限数组
                (Nodeobj as any).children = [];
                this.mapArea(rootData.Area, rootData.ID, (Nodeobj as any).children);
            }
            data.push(Nodeobj);
            this.setState({
                gData: data
            });
        });
    }
    onSelect(e, obj) {
        const data = [...this.state.gData];
        this.loop(data, obj.node.props.eventKey, (item, index, arr) => {
            if (this.props.onClick) {
                let parameter = {
                    id: item.key,
                    name: item.title,
                    type: item.nodeType
                }
                if (item.nodeType !== 'NSCompanys' && this.props.treeType === 'region_tree') {
                    message.info('请选择公司！');
                    return;
                }
                this.props.onClick(parameter);
            }
        });
        this.setState({
            selectedKeys: [obj.node.props.eventKey]
        })
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
            }
            nodeObj.isLeaf = value.Type === 'NSCompanys' ? true : false;
            nodeChildren.push(nodeObj);
            if (value.Area && value.Area.length) {
                (nodeObj as any).children = [];
                (nodeObj as any).Jurisdiction = true;
                this.mapArea(value.Area, value.ID, (nodeObj as any).children);
            }
        })
    }
    getNodeParentId(area, nodeId) {
        let item = area.find(item => item.key === nodeId);

        if (!item) {
            area.find(value => {
                if (value.children) {
                    item = this.getNodeParentId(value.children, nodeId);
                    return item;
                }
            })
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
                        }
                        nodeObj.isLeaf = obj.Type === 'NSCompanys' ? true : false;
                        item.children.push(nodeObj)
                    })
                    this.setState({
                        expandedKeys,
                        autoExpandParent: false,
                        gData: data
                    })
                })
            });
        } else {
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
            return <TreeNode key={item.key} title={
                <span>
                    {item.title}
                </span>} isLeaf={item.isLeaf}>
                {
                    item.children && item.children.length && loop(item.children)
                }
            </TreeNode>;
        });
        return (
            <Tree
                onSelect={this.onSelect.bind(this)}
                expandedKeys={this.state.expandedKeys}
                onExpand={this.onExpand.bind(this)}
                autoExpandParent={this.state.autoExpandParent}
                selectedKeys={this.state.selectedKeys}
                loadData={this.loadData.bind(this)}
                >
                {loop(this.state.gData)}
            </Tree>
        );
    }
}