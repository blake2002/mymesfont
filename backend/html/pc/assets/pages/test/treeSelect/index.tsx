import * as React from 'react';
import { TreeSelect, message } from '../../../components/antd/index';
import { get, post } from '../../../components/ajax/index';
const TreeNode = TreeSelect.TreeNode;

import butt from './buttomModel';
export { butt };

/**
 * ajax demo
 * 
 * @export
 * @class Component
 * @extends {React.Component<any, any>}
 */
export class TreeSelectCom extends React.Component<any, any> {
    state = {
        value: undefined,
        treeData: []
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
            }
            if (treeNodes.Area && treeNodes.Area.length) {  // 权限数组
                (treeObj as any).children = [];
                this.mapArea(treeNodes.Area, (treeObj as any).children);
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
            }
            nodeObj.isLeaf = value.Type === 'NSCompanys' ? true : false;
            nodeChildren.push(nodeObj);
            if (value.Area && value.Area.length) {
                (nodeObj as any).children = [];
                (nodeObj as any).Jurisdiction = true;
                this.mapArea(value.Area, (nodeObj as any).children);
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
                })
            });
        } else {
            parameter = extra.triggerNode ? {
                nodeId: extra.triggerNode.props.eventKey,
                nodeName: extra.triggerNode.props.title
            } : {};
            if (extra.triggerNode) {
                let nodeItem = this.getNodeParentId(data, extra.triggerNode.props.eventKey);
                if (nodeItem.Type !== 'NSCompanys' && this.props.treeType === 'region_tree') {
                    message.info('请选择公司！');
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
                (treeItem as any).children = [];
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
                    (treeItem as any).children.push(treeNode);
                })
                this.setState({
                    treeData: data
                });
                resolve();
            });
        });
    }
    render() {
        return <TreeSelect
            style={{ width: 300 }}
            value={this.state.value}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder='Please select'
            allowClear
            treeData={this.state.treeData}
            onChange={this.onChange.bind(this)}
            onSelect={this.onSelect.bind(this)}
            multiple={this.props.multiple}
            treeCheckable={this.props.multiple}
            showCheckedStrategy={TreeSelect.SHOW_PARENT}
            loadData={this.loadData.bind(this)}
            >
            <TreeNode value='parent 1' title='parent 1' key='0-1'>
                <TreeNode value='parent 1-0' title='parent 1-0' key='0-1-1'>
                    <TreeNode value='leaf1' title='my leaf' key='random' />
                    <TreeNode value='leaf2' title='your leaf' key='random1' />
                </TreeNode>
                <TreeNode value='parent 1-1' title='parent 1-1' key='random2'>
                    <TreeNode value='sss' title={<b style={{ color: '#08c' }}>sss</b>} key='random3' />
                </TreeNode>
            </TreeNode>
        </TreeSelect>
    }
}

