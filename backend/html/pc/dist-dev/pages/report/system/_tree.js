define("pages/report/system/_tree.js",function(require, exports, module) {
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
function getParentString(treeData) {
    if (treeData && treeData.parent && treeData.parent.key !== 'root') {
        let str = getParentString(treeData.parent);
        return str + '$' + treeData.parent.Name;
    }
    else {
        return '';
    }
}
exports.getParentString = getParentString;
;
;
class ModelTree extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            data: [],
            expandedKeys: ['root']
        };
    }
    loop(data) {
        let disabled = this.props.disabled === null ? false : this.props.disabled;
        return data.map((item) => {
            if (item.Children && item.Children.length) {
                return React.createElement(index_1.TreeNode, { data: item, disabled: disabled, key: item.key, title: this.titleRander(item) }, this.loop(item.Children));
            }
            return React.createElement(index_1.TreeNode, { data: item, disabled: disabled, isLeaf: item.HasChild === 0, key: item.key, title: this.titleRander(item) });
        });
    }
    textRander(data) {
        switch (data.type) {
            case 'add':
                return this.addInputRender(data);
            case 'update':
                setTimeout(() => {
                    this.refs[data.key].focus();
                }, 1);
                data.newName = data.Name;
                return this.updateInputRender(data);
            default:
                return React.createElement("span", { onClick: () => this.onClick(data) }, data.Name);
        }
    }
    updateInputRender(data) {
        return React.createElement(index_1.Input, { ref: data.key, defaultValue: data.Name, onBlur: (e) => this.updateInputOnBlur(e, data), onChange: e => this.updateInputOnChange(e, data) });
    }
    updateInputOnChange(e, data) {
        let target = e.target;
        data.newName = target.value;
    }
    updateInputOnBlur(e, treeData) {
        return __awaiter(this, void 0, void 0, function* () {
            let target = e.target;
            let name = index_3.trim(treeData.newName);
            if (!name) {
                index_1.message.success('请输入！');
                this.refs[treeData.key].focus();
                return;
            }
            if (name === treeData.Name) {
                treeData.type = null;
                this.setState(this.state);
                return;
            }
            // console.log(this.getParentString(treeData));
            // console.log(name);
            let { data } = yield index_2.post('/report_modify_dir', {
                parent: getParentString(treeData) || '$',
                dirId: treeData.Id,
                name: name
            });
            treeData.Name = treeData.newName;
            treeData.type = null;
            index_1.message.success('添加成功！');
            this.setState(this.state);
        });
    }
    titleRander(data) {
        let name = data.Name;
        return React.createElement("div", { className: 'tree-title' },
            React.createElement("span", { className: 'tree-title-text' },
                React.createElement("span", { className: 'tree-span-click' }, this.textRander(data))),
            React.createElement("span", null,
                React.createElement("span", { className: 'fr' },
                    React.createElement(index_1.Dropdown, { overlay: this.menuRender(data), trigger: ['click'] },
                        React.createElement(index_1.Icon, { className: 'treeIcon', type: 'ellipsis' })))));
    }
    onClick(data) {
        // if (data.key !== 'root') {
        this.props.onClick(data);
        // }
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
            let name = index_3.trim(treeData.Name);
            if (!name) {
                treeData.parent.Children = treeData.parent.Children.filter(value => value !== treeData);
                if (treeData.parent.Children.length === 0) {
                    treeData.parent.HasChild = 0;
                }
                this.setState(this.state);
                return;
            }
            // console.log(this.getParentString(treeData));
            // console.log(name);
            let { data } = yield index_2.post('/report_create_dir', {
                parent: getParentString(treeData) || '$',
                name: name
            });
            treeData.type = null;
            treeData.Id = data.id;
            index_1.message.success('添加成功！');
            this.setState(this.state);
        });
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
        return React.createElement(index_1.Input, { ref: data.key, onBlur: (e) => this.addInputOnBlur(e, data), onChange: e => this.addInputOnChange(e, data) });
    }
    dataChangeName(data, name) {
        data.Name = name;
    }
    menuRender(data) {
        return React.createElement(index_1.Menu, { onClick: (param) => this.menuClick(param, data) },
            React.createElement(index_1.Menu.Item, { key: 'add' }, "\u65B0\u589E"),
            data.key !== 'root' && React.createElement(index_1.Menu.Item, { key: 'update' }, "\u4FEE\u6539"),
            data.key !== 'root' && React.createElement(index_1.Menu.Item, { key: 'delete' }, "\u5220\u9664"));
    }
    menuClick(param, data) {
        switch (param.key) {
            case 'add':
                this.addChildran(data);
                break;
            case 'update':
                data.type = 'update';
                this.setState(this.state);
                break;
            case 'delete':
                this.deleteModel(data);
                break;
        }
    }
    deleteModel(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield index_2.post('/report_delete_dir', {
                dirId: data.Id
            });
            data.parent.Children = data.parent.Children.filter(value => value !== data);
            this.setState(this.state);
            index_1.message.success('删除成功！');
        });
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
        data.HasChild = data.HasChild || 1;
        data.Children.push({
            type: 'add',
            key: key,
            Name: '',
            parent: data,
            Children: [],
            HasChild: 0
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
    getDirs(treeData) {
        return __awaiter(this, void 0, void 0, function* () {
            let { data } = yield index_2.post('/report_dirs', {
                parent: treeData ? getParentString(treeData) : '',
                name: treeData ? treeData.Name : ''
            });
            data.list.forEach(value => {
                value.Children = value.Children || [];
                value.parent = treeData;
                this.addKey(value);
            });
            return data.list;
        });
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
            let data = yield this.getDirs();
            let id = data.find(value => value.Name === '$').Id;
            data = data.filter(value => value.Name !== '$');
            let fristData = {
                Name: '报表',
                Children: data,
                HasChild: 1,
                Id: id,
                key: 'root'
            };
            data.forEach(value => {
                value.parent = fristData;
            });
            this.props.onClick(data[0]);
            this.state.data = [fristData];
            // this.state.data[0].Children.forEach(value => this.addKey(value, 'root'));
            // if (this.props.onClick) {
            //     let fristNode = this.state.data[0].Children[0];
            //     this.props.onClick(null, this.getName(fristNode), fristNode);
            //     // this.props.onClick('c2', 'ccccTestModel', { level: 'level3+' });
            // }
            this.setState(this.state);
        });
    }
    onLoadData(treeNode) {
        let treeData = treeNode.props.data;
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            // const treeData = [...this.state.treeData];
            // getNewTreeData(treeData, treeNode.props.eventKey, generateTreeNodes(treeNode), 2);
            // this.setState({ treeData });
            // resolve();
            if (treeData.HasChild && !treeData.Children.length) {
                let data = yield this.getDirs(treeData);
                treeData.Children = data;
                this.setState(this.state);
            }
            resolve();
        }));
    }
    addKey(data) {
        data.key = index_3.uuid();
        // data.level = this.reduceLevel(pLevel);
        // data.Children.forEach(value => {
        //     this.addKey(value, data.level);
        // });
    }
    onExpand(expandedKeys) {
        this.state.expandedKeys = expandedKeys;
        this.setState(this.state);
    }
    render() {
        let { props, state } = this;
        return (React.createElement("section", null,
            React.createElement(index_1.Tree, { loadData: this.onLoadData.bind(this), expandedKeys: state.expandedKeys, onExpand: this.onExpand.bind(this) }, this.loop(this.state.data))));
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
});
//# sourceMappingURL=_tree.js.map
