define("pages/model/system/_tree.js",function(require, exports, module) {
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
const index_3 = require("../../../components/util/index");
;
;
class ModelTree extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            data: [],
            selectedKeys: [],
            expandedKeys: ['root']
        };
    }
    /**
     * 查找父级别
     *
     * @param {any} key
     * @returns
     *
     * @memberOf ModelTree
     */
    findParent(key) {
        return this.dataFindParent(this.state.data, key);
    }
    /**
     *  查找父级
     *
     * @param {TreeData[]} data
     * @param {any} key
     * @returns {TreeData}
     *
     * @memberOf ModelTree
     */
    dataFindParent(data, key) {
        let findData = data.find(value => {
            return !!value.Children.find(value => value.key === key);
        });
        if (!findData) {
            data.find(value => {
                findData = this.dataFindParent(value.Children, key);
                return !!findData;
            });
        }
        return findData;
    }
    findFristParent(key) {
        return this.dataFindFristParent(this.state.data[0].Children, key);
    }
    /**
     * 查找第一级元素
     *
     * @param {TreeData[]} data
     * @param {any} key
     * @returns {TreeData}
     *
     * @memberOf ModelTree
     */
    dataFindFristParent(data, key) {
        let findData = data.find(value => {
            return !!value.Children.find(value => value.key === key);
        });
        if (!findData) {
            data.find(value => {
                let bl = !!this.dataFindParent(value.Children, key);
                if (bl) {
                    findData = value;
                }
                return bl;
            });
        }
        return findData;
    }
    loop(data) {
        let disabled = this.props.disabled === null ? false : this.props.disabled;
        return data.map((item) => {
            if (item.Children && item.Children.length) {
                return React.createElement(index_1.TreeNode, { disabled: disabled, key: item.key, title: this.titleRander(item) }, this.loop(item.Children));
            }
            return React.createElement(index_1.TreeNode, { disabled: disabled, key: item.key, title: this.titleRander(item) });
        });
    }
    titleRander(data) {
        let name = data.Name || data['ModelName'];
        return React.createElement("div", { className: 'tree-title' },
            React.createElement("span", { className: 'tree-title-text' }, data.type === 'add' ? this.addInputRender(data) :
                React.createElement("span", { className: 'tree-span-click', onClick: () => this.onClick(data) }, name)),
            React.createElement("span", null,
                React.createElement("span", { className: 'fr' },
                    React.createElement(index_1.Dropdown, { overlay: this.menuRender(data), trigger: ['click'] },
                        React.createElement(index_1.Icon, { className: 'treeIcon', type: 'ellipsis' })))));
    }
    onClick(data) {
        if (data.level !== 'root') {
            if (data.level === 'model') {
                this.props.onClick(null, this.getName(data), data);
            }
            else {
                this.props.onClick(this.getName(data), this.getName(this.findFristParent(data.key)), data);
            }
        }
    }
    addInputOnChange(e, data) {
        let target = e.target;
        this.dataChangeName(data, target.value);
    }
    /**
     * 添加按钮失去焦点事件
     *
     * @param {any} e
     * @param {any} data
     *
     * @memberOf ModelTree
     */
    addInputOnBlur(e, treeData) {
        return __awaiter(this, void 0, void 0, function* () {
            let target = e.target;
            let name = index_3.trim(this.getName(treeData));
            if (!name) {
                let pData = this.findParent(treeData.key);
                pData.Children = pData.Children.filter(value => value !== treeData);
                this.setState(this.state);
                return;
            }
            if (treeData.level === 'model') {
                let { data } = yield index_2.post('/new_model', {
                    modelName: name,
                    category: this.props.type
                });
            }
            else {
                let { data } = yield index_2.post('/new_model_node', {
                    modelName: this.getName(this.findFristParent(treeData.key)),
                    parentName: this.getName(this.findParent(treeData.key)),
                    nodeName: name
                });
            }
            // this.props.onClick(name, this.getName(this.findFristParent(treeData.key)), treeData);
            treeData.type = 'select';
            index_1.message.success('添加成功！');
            this.setState(this.state);
        });
    }
    /**
     * 获取名字
     *
     * @param {any} treeData
     * @returns
     *
     * @memberOf ModelTree
     */
    getName(treeData) {
        return treeData['ModelName'] || treeData['Name'];
    }
    /**
     * 添加输入框渲染
     *
     * @param {TreeData} data
     * @returns
     *
     * @memberOf ModelTree
     */
    addInputRender(data) {
        return React.createElement(index_1.Input, { onKeyDown: (e) => this.onKeyDown(e, data), ref: data.key, onBlur: (e) => this.addInputOnBlur(e, data), onChange: e => this.addInputOnChange(e, data) });
    }
    onKeyDown(e, data) {
        if (e && e.keyCode === 13) {
            this.addInputOnBlur(e, data);
        }
    }
    dataChangeName(data, name) {
        if (data['ModelName'] === null) {
            data['Name'] = name;
        }
        else {
            data['ModelName'] = name;
        }
    }
    menuRender(data) {
        return React.createElement(index_1.Menu, { onClick: (param) => this.menuClick(param, data) },
            !(data.level === 'model' && data.Children.length === 1) && React.createElement(index_1.Menu.Item, { key: 'add' }, "\u65B0\u589E"),
            data.level !== 'root' && React.createElement(index_1.Menu.Item, { key: 'delete' }, "\u5220\u9664"));
    }
    menuClick(param, data) {
        switch (param.key) {
            case 'add':
                this.addChildran(data);
                break;
            case 'delete':
                this.deleteModel(data);
                break;
        }
    }
    deleteModel(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.level === 'model') {
                yield index_2.post('/delete_model', {
                    modelName: this.getName(data)
                });
            }
            else {
                yield index_2.post('/delete_model_node', {
                    modelName: this.getName(this.findFristParent(data.key)),
                    nodeName: this.getName(data)
                });
            }
            let pdata = this.findParent(data.key);
            pdata.Children = pdata.Children.filter(value => value !== data);
            this.setState(this.state);
            index_1.message.success('删除成功！');
        });
    }
    onNodeClick(modelName, name) {
        let obj = this.state.data[0].Children.find(value => value.ModelName === modelName);
        let Children = this.dataFindChildren(obj['Children'], name);
        this.props.onClick(this.getName(Children), this.getName(this.findFristParent(Children.key)), Children);
        // this.addExpandedKeys(data.key);
    }
    dataFindChildren(data, name) {
        let findData = data.find(value => {
            let bl = value.Name === name;
            if (bl) {
                this.state.selectedKeys = [value.key];
                this.addExpandedKeys(value.key);
            }
            return bl;
        });
        if (!findData) {
            data.find(value => {
                findData = this.dataFindChildren(value.Children, name);
                return !!findData;
            });
        }
        return findData;
    }
    /**
     * 添加子级
     *
     * @param {TreeChildren} data
     *
     * @memberOf ModelTree
     */
    addChildran(data) {
        let key = index_3.uuid();
        data.Children.push({
            type: 'add',
            key: key,
            Name: '',
            level: this.reduceLevel(data.level),
            Children: []
        });
        this.addExpandedKeys(data.key);
        this.setState(this.state, () => {
            this.refs[key].focus();
        });
    }
    /**
     * 添加展开项
     *
     * @param {string} key
     *
     * @memberOf ModelTree
     */
    addExpandedKeys(key) {
        if (this.state.expandedKeys.indexOf(key) === -1) {
            this.state.expandedKeys.push(key);
        }
    }
    /**
     * 获取数据
     *
     *
     * @memberOf ModelTree
     */
    getDataSource() {
        return __awaiter(this, void 0, void 0, function* () {
            let getData;
            if (this.props.type === 'system') {
                let { data } = yield index_2.get('/system_model_list');
                getData = data;
            }
            else {
                let { data } = yield index_2.get('/custom_model_list');
                getData = data;
            }
            this.state.data = [{
                    ModelName: this.props.type === 'system' ? '系统模型' : '用户模型',
                    Children: getData.ModelList,
                    key: 'root',
                    level: 'root'
                }];
            this.state.data[0].Children.forEach(value => this.addKey(value, 'root'));
            let fristNode = this.state.data[0].Children[0];
            if (this.props.onClick && fristNode) {
                this.props.onClick(null, this.getName(fristNode), fristNode);
            }
            this.setState(this.state);
        });
    }
    addKey(data, pLevel) {
        data.key = index_3.uuid();
        data.level = this.reduceLevel(pLevel);
        data.Children.forEach(value => {
            this.addKey(value, data.level);
        });
    }
    reduceLevel(level) {
        switch (level) {
            case undefined:
                return 'root';
            case 'root':
                return 'model';
            case 'model':
                return 'level2';
            default:
                return 'level3+';
        }
    }
    onExpand(expandedKeys, obj) {
        this.state.expandedKeys = expandedKeys;
        this.setState(this.state);
    }
    onSelect(key) {
        this.state.selectedKeys = key;
        this.setState(this.state);
    }
    render() {
        let { props, state } = this;
        return (React.createElement("section", null,
            React.createElement(index_1.Tree, { selectedKeys: this.state.selectedKeys, onSelect: this.onSelect.bind(this), expandedKeys: state.expandedKeys, onExpand: this.onExpand.bind(this) }, this.loop(this.state.data))));
    }
    /**
     * 组件渲染完毕获取ajax数据
     *
     *
     * @memberOf Device
     */
    componentDidMount() {
        this.getDataSource();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ModelTree;
;
;
class CheckTree extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            value: this.props.defaultValue,
            data: []
        };
    }
    /**
     * 获取数据
     *
     *
     * @memberOf ModelTree
     */
    getDataSource() {
        return __awaiter(this, void 0, void 0, function* () {
            let getData;
            let { data } = yield index_2.get('/model_related_node_options', {
                modelType: this.props.type,
                modelName: ''
            });
            getData = data;
            this.state.data = getData.ModelList;
            this.state.data.forEach(value => this.addKey(value, 'root'));
            this.setState(this.state);
        });
    }
    /**
     * ajax数据添加key
     *
     * @param {(TreeData | TreeChildren)} data
     *
     * @memberOf ModelTree
     */
    addKey(data, pLevel) {
        data.key = index_3.uuid();
        data.level = this.reduceLevel(pLevel);
        data.Children.forEach(value => {
            this.addKey(value, data.level);
        });
    }
    reduceLevel(level) {
        switch (level) {
            case undefined:
                return 'root';
            case 'root':
                return 'model';
            case 'model':
                return 'level2';
            default:
                return 'level3+';
        }
    }
    findFristParent(key) {
        return this.dataFindFristParent(this.state.data, key);
    }
    /**
     * 查找第一级元素
     *
     * @param {TreeData[]} data
     * @param {any} key
     * @returns {TreeData}
     *
     * @memberOf ModelTree
     */
    dataFindFristParent(data, key) {
        let findData = data.find(value => {
            return !!value.Children.find(value => value.key === key);
        });
        if (!findData) {
            data.find(value => {
                let bl = !!this.dataFindParent(value.Children, key);
                if (bl) {
                    findData = value;
                }
                return bl;
            });
        }
        return findData;
    }
    /**
     *  查找父级
     *
     * @param {TreeData[]} data
     * @param {any} key
     * @returns {TreeData}
     *
     * @memberOf ModelTree
     */
    dataFindParent(data, key) {
        let findData = data.find(value => {
            return !!value.Children.find(value => value.key === key);
        });
        if (!findData) {
            data.find(value => {
                findData = this.dataFindParent(value.Children, key);
                return !!findData;
            });
        }
        return findData;
    }
    onChange(obj) {
        this.state.value = obj;
        this.setState(this.state);
        if (this.props.onChange) {
            this.props.onChange(obj);
        }
    }
    clearValue() {
        this.state.value = null;
        this.setState(this.state);
    }
    titleRander(data) {
        let name = data.Name || data['ModelName'];
        let checked;
        if (this.state.value) {
            checked = data.Name === this.state.value.Name &&
                this.findFristParent(data.key)['ModelName'] === this.state.value.ModelName;
        }
        return React.createElement("span", null, data.level === 'model' ? name :
            React.createElement(index_1.Checkbox, { checked: checked, onChange: (e) => {
                    if (e.target['checked']) {
                        this.onChange({
                            Name: data['Name'],
                            ModelName: this.findFristParent(data.key)['ModelName']
                        });
                    }
                    else {
                        this.onChange(null);
                    }
                } }, name));
    }
    loop(data) {
        return data.map((item) => {
            if (item.Children && item.Children.length) {
                return React.createElement(index_1.TreeNode, { key: item.key, title: this.titleRander(item) }, this.loop(item.Children));
            }
            return React.createElement(index_1.TreeNode, { key: item.key, title: this.titleRander(item) });
        });
    }
    render() {
        let { props, state } = this;
        return (React.createElement("section", null,
            React.createElement(index_1.Tree, null, this.loop(this.state.data))));
    }
    /**
     * 组件渲染完毕获取ajax数据
     *
     *
     * @memberOf Device
     */
    componentDidMount() {
        this.getDataSource();
    }
}
exports.CheckTree = CheckTree;
// post('/delete_model', {
//     modelName: 'test'
// })
});
//# sourceMappingURL=_tree.js.map
