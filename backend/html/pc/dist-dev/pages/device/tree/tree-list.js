define("pages/device/tree/tree-list.js",function(require, exports, module) {
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
const index_4 = require("../../../components/privileges/index");
require("./tree-list.css");
const TreeNode = index_1.default.TreeNode;
const Option = index_2.Select.Option;
const gData = []; // 架构树数据
let selectKey; // 点击节点获取节点key
let treeNodeListData = []; // 待选择的节点列表
const nodeChildren = []; // 待选择的子节点
let loadTreeFlag = false; // 加载组件时是否请求
let regionTreeexpandedKeys; // 加载组件时默认展开节点  区域架构树
let departmentTreeexpandedKeys; // 加载组件时默认展开节点  组织架构树
let region_currentId; // 记录最后传递的节点id  区域架构树
let department_currentId; // 记录最后传递的节点id  组织架构树
let region_tree_data; // 区域架构树
let department_tree_data; // 组织架构树
let recordName; // 记录节点名称是否修改-
let scrollPosition = 0; // 记录滚轮位置
class TreeList extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            gData,
            expandedKeys: [],
            visible: false,
            autoExpandParent: true,
            defaultValue: '',
            handle: '',
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
    handleRegionalTreeListAjax(parameter) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestArguments = {
                operate: parameter.handle,
                // add-新增, delete-删除, edit-修改, moveTo-平级移动节点, changeParentTo-移动至新的父级
                nodeId: parameter.nodeId,
                parentId: parameter.parentid,
                newOrderbyIndex: parameter.OrderbyIndex,
                moveToProps: parameter.moveToProps,
                newParentId: parameter.newParentId,
                nodeType: parameter.nodeType,
                nodeName: parameter.nodeName // 本节点名称
            };
            let parameterUrl = this.props.treeType === 'region_tree' ? '/region_tree' : '/department_tree';
            let json = yield index_3.post(parameterUrl, requestArguments);
            return json;
        });
    }
    getRegionalTreeNodeAjax(nodeType, parentId) {
        return __awaiter(this, void 0, void 0, function* () {
            let requestArguments = {
                nodeType: nodeType,
                parentId: parentId // 若nodeType=NSCountrys or NSStations需要提供上一级parentID
            };
            let json = yield index_3.get('/region_tree_options', requestArguments);
            console.log(json);
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
    // onCheck(info) {
    //     // console.log('onCheck', info);
    // }
    deleteItem(data) {
        let flag = true;
        if (data.length === 0) {
            return;
        }
        data.map((item, index, arr) => {
            if (item.title.length === 0) {
                flag = false;
                arr.splice(index, 1);
            }
            if (flag && item.children) {
                this.deleteItem(item.children);
            }
        });
    }
    componentWillMount() {
        let loadTreeData = this.props.treeType === 'department_tree' ? department_tree_data : region_tree_data;
        let currentId = this.props.treeType === 'region_tree' ? region_currentId : department_currentId;
        if (loadTreeFlag && loadTreeData) {
            this.deleteItem(loadTreeData);
            let openNode;
            let nodeId = this.props.regionId === undefined ? currentId : this.props.regionId;
            this.loop(loadTreeData, nodeId, (item, index, arr) => {
                openNode = item.parentNodeId;
                if (this.props.onCompleted) {
                    this.props.onCompleted(item.key, item.title, item.nodeType);
                }
                return;
            });
            let loadTreeexpandedKeys = this.props.treeType === 'region_tree' ? regionTreeexpandedKeys :
                departmentTreeexpandedKeys;
            let autoExpandParent = loadTreeexpandedKeys ? false : true;
            this.setState({
                gData: loadTreeData,
                expandedKeys: loadTreeexpandedKeys || [openNode],
                selectedKeys: [nodeId],
                autoExpandParent: autoExpandParent
            });
            return;
        }
        this.getRegionalArchitectureTreeListAjax().then(value => {
            const data = [...this.state.gData];
            loadTreeFlag = true;
            let rootData = this.props.treeType === 'department_tree' ? value.data.Organization : value.data.Area; // 根节点
            let Nodeobj = {
                key: rootData.ID,
                title: rootData.Name,
                nodeType: this.props.treeType === 'department_tree' ? 'root' : rootData.Type,
                parentNodeId: '',
                OrderbyIndex: rootData.OrderbyIndex,
                Tail: rootData.Tail
            }; // 节点
            if ((rootData.Area && rootData.Area.length) ||
                (rootData.Organization && rootData.Organization.length)) {
                Nodeobj.children = [];
                Nodeobj.Jurisdiction = true;
                let area = rootData.Area ? rootData.Area : rootData.Organization;
                this.mapArea(area, rootData.ID, Nodeobj.children);
            }
            data.push(Nodeobj);
            if (this.props.treeType === 'region_tree') {
                region_currentId = rootData.ID;
                region_tree_data = data;
            }
            else {
                department_currentId = rootData.ID;
                department_tree_data = data;
            }
            let openNode;
            this.loop(data, this.props.regionId, (item, index, arr) => {
                openNode = item.parentNodeId;
                if (this.props.onCompleted) {
                    this.props.onCompleted(item.key, item.title, item.nodeType);
                }
            });
            if (this.props.regionId === undefined && this.props.onCompleted) {
                this.props.onCompleted(rootData.ID, rootData.Name, rootData.Type);
            }
            if (openNode === undefined && this.props.regionId) {
                this.getTreeForefather(this.props.regionId).then(value => {
                    if (value.data.length === 0) {
                        return;
                    }
                    let parentIds = value.data[0].Path.reverse();
                    let myIndex;
                    parentIds.find((value, index, arr) => {
                        let nodeObj = this.getNodeParentId(data, value.ID) ? this.getNodeParentId(data, value.ID) : {};
                        myIndex = index;
                        return value.ID === nodeObj.key;
                    });
                    this.getChildNode(data, parentIds, myIndex);
                });
            }
            else {
                this.setState({
                    gData: data,
                    expandedKeys: [openNode],
                    selectedKeys: [this.props.regionId]
                });
            }
        });
    }
    componentWillReceiveProps(nextProps) {
        // console.log(nextProps);
        // if (nextProps.regionId !== undefined) {
        //     let loadTreeData = this.props.treeType === 'department_tree' ? department_tree_data : region_tree_data;
        //     let currentId = this.props.treeType === 'region_tree' ? region_currentId : department_currentId;
        //     this.deleteItem(loadTreeData);
        //     let openNode;
        //     let nodeId = this.props.regionId === undefined ? currentId : this.props.regionId;
        //     this.loop(loadTreeData, nodeId, (item, index, arr) => {
        //         openNode = item.parentNodeId;
        //         if (this.props.onCompleted) {
        //             this.props.onCompleted(item.key, item.title, item.nodeType);
        //         }
        //     });
        //     let loadTreeexpandedKeys = this.props.treeType === 'region_tree' ? regionTreeexpandedKeys :
        //         departmentTreeexpandedKeys;
        //     let autoExpandParent = loadTreeexpandedKeys ? false : true;
        //     this.setState({
        //         gData: loadTreeData,
        //         expandedKeys: loadTreeexpandedKeys || [openNode],
        //         selectedKeys: [nodeId],
        //         autoExpandParent: autoExpandParent
        //     });
        // }
    }
    componentDidMount() {
        document.getElementsByClassName('tabpane-content')[0].scrollTop = scrollPosition;
        document.getElementsByClassName('tabpane-content')[0].onscroll = () => {
            scrollPosition = document.getElementsByClassName('tabpane-content')[0].scrollTop;
        };
    }
    getChildNode(data, parents, myIndex) {
        this.getRegionChildrenAjax(parents[myIndex].ID).then((value) => {
            this.loop(data, parents[myIndex].ID, (item, index, arr) => {
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
                    nodeObj.isLeaf = obj.Type === 'NSCompanys' &&
                        this.props.treeType === 'region_tree' ? true : false;
                    item.children.push(nodeObj);
                });
            });
            myIndex--;
            if (myIndex >= 0) {
                this.getChildNode(data, parents, myIndex);
            }
            this.loop(data, this.props.regionId, (item, index, arr) => {
                this.setState({
                    gData: data,
                    expandedKeys: [item.parentNodeId],
                    selectedKeys: [this.props.regionId]
                });
                if (this.props.onCompleted) {
                    this.props.onCompleted(item.key, item.title, item.nodeType);
                }
            });
        });
    }
    onSelect(e, obj) {
        if (!obj.selected) {
            let currentId = this.props.treeType === 'region_tree' ? region_currentId : department_currentId;
            this.setState({
                selectedKeys: [currentId]
            });
            return;
        }
        selectKey = obj.node.props.eventKey;
        if (this.props.treeType === 'region_tree') {
            region_currentId = selectKey;
        }
        else {
            department_currentId = selectKey;
        }
        if (selectKey === '0000') {
            return;
        }
        const data = [...this.state.gData];
        this.loop(data, selectKey, (item, index, arr) => {
            if (this.props.onClick) {
                this.props.onClick(item.key, item.title, item.nodeType);
            }
            return;
        });
    }
    handleMenuClick(e) {
        const data = [...this.state.gData];
        selectKey = e.item.props.id;
        // if (!this.props.treeType) {
        //     return;
        // }
        if (e.key === '0') {
            this.loop(data, selectKey, (item) => {
                let that = this;
                let nodeType = item.nodeType === 'NSPlanets' ? 'NSCountrys' :
                    (item.nodeType === 'NSCountrys' ? 'NSStations' :
                        (item.nodeType === 'NSStations' ? 'NSCitys' : 'NSCompanys'));
                if (item.children === undefined || item.children.length === 0) {
                    item.children = [];
                    this.getRegionChildrenAjax(item.key).then((value) => {
                        if (value.data && value.data.length) {
                            value.data.forEach(val => {
                                let isLeaf = val.Type === 'NSCompanys' && that.props.treeType === 'region_tree' ?
                                    true : false;
                                item.children.push({
                                    key: val.ID,
                                    title: val.Name,
                                    nodeType: val.Type,
                                    parentNodeId: item.key,
                                    OrderbyIndex: val.OrderbyIndex,
                                    isLeaf: isLeaf
                                });
                            });
                        }
                        getKeyData(that);
                    });
                }
                else {
                    getKeyData(that);
                }
                function getKeyData(that) {
                    let isLeaf = nodeType === 'NSCompanys' && that.props.treeType === 'region_tree' ? true : false;
                    item.children.push({
                        key: '0000',
                        title: '',
                        nodeType: nodeType,
                        parentNodeId: item.key,
                        isLeaf: isLeaf
                    });
                    let defaultSelectKey = selectKey;
                    selectKey = '0000';
                    that.setState({
                        expandedKeys: [defaultSelectKey],
                        autoExpandParent: true,
                        visible: true,
                        defaultValue: '',
                        handle: 'add',
                        gData: data
                    }, () => {
                        if (nodeType === 'NSCompanys') {
                            that.refs['0000'].focus();
                        }
                        let ee = nodeType === 'NSCompanys' ? document.getElementsByClassName('treeInput')[0] :
                            document.getElementsByClassName('selectInput')[0];
                        let y = ee.offsetTop;
                        while (ee = ee.offsetParent) {
                            y += ee.offsetTop;
                        }
                        let treeH = document.getElementsByClassName('tabpane-content')[0].clientHeight;
                        let treeNodeH = document.getElementsByClassName('ant-tree')[0].clientHeight;
                        let moveH = y - 150 - treeH / 2;
                        if (moveH < 0) {
                            return;
                        }
                        if (treeNodeH - y < treeH / 2) {
                            document.getElementsByClassName('tabpane-content')[0].scrollTop = treeNodeH - treeH;
                            return;
                        }
                        let myTime = setInterval(() => {
                            let sT = document.getElementsByClassName('tabpane-content')[0].scrollTop;
                            console.log(sT);
                            document.getElementsByClassName('tabpane-content')[0].scrollTop = sT > moveH ?
                                (sT - 20) : (sT + 20);
                            if (sT - moveH < 10) {
                                clearInterval(myTime);
                            }
                        }, 30);
                    });
                }
                if (nodeType === 'NSCompanys') {
                    return true;
                }
                this.getRegionalTreeNodeAjax(nodeType, item.key).then((value) => {
                    nodeChildren.splice(0, nodeChildren.length); // 清空待选节点列表
                    let nodeDataList = [];
                    for (let i = 0; i < value.data.pageList.length; i++) {
                        let theItm = item.children.find((item) => {
                            return item.key === value.data.pageList[i].ID;
                        });
                        if (!theItm) {
                            nodeDataList.push(value.data.pageList[i]);
                            let nodeName = value.data.pageList[i].Name;
                            nodeChildren.push(React.createElement(Option, { key: nodeName }, nodeName));
                        }
                    }
                    treeNodeListData = nodeDataList;
                });
            });
        }
        else if (e.key === '1') {
            this.loop(data, selectKey, (item, index, arr) => {
                recordName = item.title;
                this.setState({
                    visible: true,
                    handle: 'edit'
                }, () => {
                    this.refs[selectKey].focus();
                });
                return;
            });
        }
        else if (e.key === '2') {
            this.loop(data, selectKey, (item, index, arr) => {
                if (index === 0) {
                    return;
                }
                let indexUp = index - 1;
                let targetNodeId = arr[indexUp].key;
                let moveToProps = {};
                moveToProps[targetNodeId] = item.OrderbyIndex;
                let parameter = {
                    handle: 'moveTo',
                    parentid: item.parentNodeId,
                    nodeId: item.key,
                    nodeType: item.nodeType,
                    nodeName: item.title,
                    OrderbyIndex: arr[indexUp].OrderbyIndex,
                    moveToProps: moveToProps
                };
                let recordIndex = item.OrderbyIndex;
                item.OrderbyIndex = arr[indexUp].OrderbyIndex;
                arr[indexUp].OrderbyIndex = recordIndex;
                this.handleRegionalTreeListAjax(parameter).then((value) => {
                    console.log(value);
                    arr[index] = arr.splice(index - 1, 1, arr[index])[0];
                    this.setState({
                        gData: data
                    });
                });
            });
        }
        else if (e.key === '3') {
            this.loop(data, selectKey, (item, index, arr) => {
                if (index === arr.length - 1) {
                    return;
                }
                let indexUp = index + 1;
                let targetNodeId = arr[indexUp].key;
                let moveToProps = {};
                moveToProps[targetNodeId] = item.OrderbyIndex;
                let parameter = {
                    handle: 'moveTo',
                    parentid: item.parentNodeId,
                    nodeId: item.key,
                    nodeType: item.nodeType,
                    nodeName: item.title,
                    OrderbyIndex: arr[indexUp].OrderbyIndex,
                    moveToProps: moveToProps
                };
                let recordIndex = item.OrderbyIndex;
                item.OrderbyIndex = arr[indexUp].OrderbyIndex;
                arr[indexUp].OrderbyIndex = recordIndex;
                this.handleRegionalTreeListAjax(parameter).then((value) => {
                    arr[index] = arr[index + 1];
                    arr[index + 1] = item;
                    this.setState({
                        gData: data
                    });
                });
            });
        }
        else if (e.key === '4') {
            this.confirm();
        }
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
            nodeObj.isLeaf = value.Type === 'NSCompanys' && this.props.treeType === 'region_tree' ? true : false;
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
    inputValue(e) {
        let target = e.target;
        if (target === undefined) {
            return;
        }
        const data = [...this.state.gData];
        this.loop(data, selectKey, (item) => {
            item.title = target.value;
            this.setState({
                gData: data
            });
        });
    }
    onExpand(expandedKeys, obj) {
        if (this.props.treeType === 'region_tree') {
            regionTreeexpandedKeys = expandedKeys;
        }
        else {
            departmentTreeexpandedKeys = expandedKeys;
        }
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
                    console.log(value);
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
                        nodeObj.isLeaf = obj.Type === 'NSCompanys' &&
                            this.props.treeType === 'region_tree' ? true : false;
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
    inputBlur(e) {
        e = e || '';
        let target = e.target;
        const data = [...this.state.gData];
        this.loop(data, selectKey, (item, index, arr) => {
            if (item.title.length === 0 && target || e.length === 0) {
                arr.splice(index, 1);
                this.setState({
                    visible: false,
                    gData: data
                });
                return true;
            }
            let selectedNode = treeNodeListData.find((item) => {
                return item.Name === e;
            }) || {};
            let nodeId = target ? (item.key === '0000' ? '' : item.key) : selectedNode.ID;
            let nodeType = target ? item.nodeType : selectedNode.Type;
            let nodeName = target ? item.title : e;
            if ((!selectedNode.Type && !target) || item.title === recordName) {
                this.setState({
                    visible: false,
                    gData: data
                });
                return true;
            }
            let parameter = {
                handle: this.state.handle,
                parentid: item.parentNodeId,
                nodeId: nodeId,
                nodeType: nodeType,
                nodeName: nodeName,
                OrderbyIndex: null
            };
            if (this.state.handle === 'add') {
                parameter.OrderbyIndex = index === 0 ? 0 : Number(arr[index - 1].OrderbyIndex) + 1;
                item.OrderbyIndex = index === 0 ? 0 : Number(arr[index - 1].OrderbyIndex) + 1;
            }
            this.handleRegionalTreeListAjax(parameter).then(// 增加和修改
            (value) => {
                item.title = nodeName;
                item.key = item.key === '0000' ? value.data.nodeId : nodeId;
                item.isLeaf = item.nodeType === 'NSCompanys' &&
                    this.props.treeType === 'region_tree' ? true : false;
                this.setState({
                    visible: false,
                    gData: data
                });
            });
        });
    }
    stopClick(e) {
        e.stopPropagation();
    }
    meueRender(type, id) {
        return React.createElement(index_2.Menu, { onClick: this.handleMenuClick.bind(this) },
            (!(type === 'NSCompanys') || this.props.treeType === 'department_tree') && !this.props.disabled &&
                React.createElement(index_2.Menu.Item, { key: '0', id: id }, "\u6DFB\u52A0\u5B50\u533A\u57DF"),
            (type === 'NSCompanys') && !this.props.disabled && !(type === 'root') &&
                React.createElement(index_2.Menu.Item, { key: '1', id: id }, "\u4FEE\u6539\u533A\u57DF"),
            (!(type === 'NSPlanets')) && !this.props.disabled && !(type === 'root') &&
                React.createElement(index_2.Menu.Item, { key: '2', id: id }, "\u4E0A\u79FB"),
            (!(type === 'NSPlanets')) && !this.props.disabled && !(type === 'root') &&
                React.createElement(index_2.Menu.Item, { key: '3', id: id }, "\u4E0B\u79FB"),
            (!(type === 'NSPlanets')) && !this.props.disabled && !(type === 'root') &&
                React.createElement(index_2.Menu.Item, { key: '4', id: id }, "\u5220\u9664"));
    }
    dropDown(type, id) {
        return React.createElement("span", { onClick: this.stopClick },
            React.createElement(index_2.Dropdown, { overlay: this.meueRender(type, id), trigger: ['click'] },
                React.createElement(index_2.Icon, { className: 'treeIcon', type: 'ellipsis' })));
    }
    confirm() {
        index_2.Modal.confirm({
            title: '确认删除？',
            content: '删除操作将同时清除改节点下所有子节点及设备信息，并移除相关人员。确认删除？',
            okText: '确认',
            cancelText: '取消',
            onOk: this.handleOk.bind(this)
        });
    }
    handleOk() {
        const data = [...this.state.gData];
        this.loop(data, selectKey, (item, index, arr) => {
            let parameter = {
                handle: 'delete',
                parentid: item.parentNodeId,
                nodeId: item.key,
                nodeType: item.nodeType,
                nodeName: item.title
            };
            this.handleRegionalTreeListAjax(parameter).then((value) => {
                arr.splice(index, 1);
                this.setState({
                    gData: data
                });
            });
        });
    }
    loadData(node) {
        return new Promise((resolve) => {
            resolve();
        });
    }
    render() {
        const loop = data => data.map((item) => {
            let dropDown;
            let dom = (this.state.visible && item.key === selectKey) ? (item.nodeType === 'NSCompanys' ?
                React.createElement(index_2.Input, { ref: item.key, value: item.title, onChange: this.inputValue.bind(this), className: 'treeInput', onBlur: this.inputBlur.bind(this) }) :
                React.createElement(index_2.Select // 从指定数组中选择输入
                , { 
                    // combobox={true}
                    onChange: this.inputValue.bind(this), onBlur: this.inputBlur.bind(this), className: 'selectInput' }, nodeChildren)) :
                React.createElement("span", { className: 'treeNodeDom' }, item.title);
            dropDown = (id) => this.dropDown(item.nodeType, id);
            if (item.Jurisdiction && index_4.havePrivileges('/device/devices/update/nsDevices')) {
                dropDown = (id) => undefined;
            }
            return React.createElement(TreeNode, { key: item.key, title: React.createElement("span", null,
                    dom,
                    dropDown(item.key)), disabled: this.props.disabled, isLeaf: item.isLeaf }, item.children && item.children.length && loop(item.children));
        });
        return (React.createElement(index_1.default, { className: 'page-device-tree', onSelect: this.onSelect.bind(this), expandedKeys: this.state.expandedKeys, onExpand: this.onExpand.bind(this), autoExpandParent: this.state.autoExpandParent, selectedKeys: this.state.selectedKeys, loadData: this.loadData.bind(this) }, loop(this.state.gData)));
    }
}
exports.TreeList = TreeList;
TreeList.defaultProps = {
    treeType: 'region_tree'
};
});
//# sourceMappingURL=tree-list.js.map
