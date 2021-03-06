define("pages/system/roleManager/roleAttribute/_roleMenuTree.js",function(require, exports, module) {
"use strict";
const React = require("react");
exports.React = React;
const index_1 = require("../../../../components/antd/index");
const _roleAjaxData_1 = require("../_roleAjaxData");
const index_2 = require("../../../../components/ajax/index");
require("./index.css");
class RoleMenuTree extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            expandedKeys: [],
            autoExpandParent: true,
            checkedKeys: [],
            menuList: [],
        };
        this.modifiedCheckedKeys = {};
        this.onExpand = (expandedKeys, expanded) => {
            this.setState({
                expandedKeys,
                autoExpandParent: false,
            });
        };
        this.onCheck = (checkedKeys, e) => {
            const checked = e.checked;
            let keyName = e.node.props.eventKey;
            if (this.modifiedCheckedKeys[keyName] == undefined) {
                this.modifiedCheckedKeys[keyName] = {
                    default: !checked,
                    value: checked
                };
            }
            else {
                this.modifiedCheckedKeys[keyName]['value'] = checked;
            }
            this.setState({
                checkedKeys
            });
        };
        this.loadData = (treeNode) => {
            const key = treeNode.props.eventKey;
            if (this.findMenuObjBy_ID(key).children.length == 0) {
                let promise = index_2.get('/menu_list', {
                    parentId: key,
                });
                promise.then((result) => {
                    let menuList = result['data']['MenuList'];
                    this.appendChildren(key, menuList);
                    this.setState({
                        menuData: this.state.menuList
                    });
                });
                return promise;
            }
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 100);
            });
        };
    }
    /**
    * _ID：唯一ID
    * callback（parent父节点，子节点）
    */
    findDataSource(callback) {
        let each = (rootAry, callback) => {
            for (let i in rootAry) {
                let menuObj = rootAry[i];
                if (callback) {
                    let ret = callback(rootAry, menuObj, i); //callback (parent,obj)
                    if (ret)
                        return ret;
                }
                if (menuObj.children && menuObj.children.length != 0) {
                    let ret = each(menuObj.children, callback); //递归
                    if (ret)
                        return ret;
                }
            }
            return null;
        };
        return each(this.state.menuList, callback);
    }
    findMenuObjBy_ID(ID) {
        return this.findDataSource((menus, menu, index) => {
            if (ID == menu.ID)
                return menu;
            //不反回知道默认返回什么值 undefined?
        });
    }
    /**
 * 设置子集数据
 * @param parentId 上级key
 * @param menu_list 被添加的菜单数组
 */
    appendChildren(ID, menu_list) {
        return this.findDataSource((menus, menu, index) => {
            if (menu.ID == ID) {
                menu.children = menu_list;
                return true;
            }
        });
    }
    //disableCheckbox={this.state.checkedKeys.indexOf(item.ID) != -1}
    render() {
        const loop = data => data.map((item) => {
            if (item.children) {
                return (React.createElement(index_1.TreeNode, { key: item.ID, title: item.Name }, loop(item.children)));
            }
            return React.createElement(index_1.TreeNode, { key: item.ID, title: item.Name, isLeaf: true });
        });
        return (React.createElement(index_1.Tree, { checkable: true, checkStrictly: true, onExpand: this.onExpand, expandedKeys: this.state.expandedKeys, autoExpandParent: this.state.autoExpandParent, onCheck: this.onCheck, checkedKeys: this.state.checkedKeys, loadData: this.loadData }, loop(this.state.menuList)));
    }
    componentWillMount() {
        this.updateData();
    }
    save() {
        let addMenuIds = [];
        let removeMenuIds = [];
        for (let key in this.modifiedCheckedKeys) {
            let obj = this.modifiedCheckedKeys[key];
            if (obj.default != obj.value) {
                if (obj.value == true) {
                    addMenuIds.push(key);
                }
                else {
                    removeMenuIds.push(key);
                }
            }
        }
        if (addMenuIds.length == 0 && removeMenuIds.length == 0) {
            index_1.message.success('无任何修改操作');
            return;
        }
        let roleId = this.props.query.rowKey;
        let p = _roleAjaxData_1.default.post_role_auth_for_menu(roleId, addMenuIds, removeMenuIds);
        p.then((reponse) => {
            if (reponse.code == 0) {
                index_1.message.success('保存成功');
            }
        });
    }
    updateData() {
        let p1 = this.updateRoleAuth();
        let p2 = this.updateMenuList();
        Promise.all([p1, p2]).then(() => {
            this.setState(this.state);
        });
    }
    updateRoleAuth() {
        let roleId = this.props.query.rowKey;
        let p1 = _roleAjaxData_1.default.get_role_auth_for_menu(roleId);
        p1.then((reponse) => {
            this.state.checkedKeys = _roleAjaxData_1.default.role_auth_for_menu;
        });
        return p1;
    }
    updateMenuList() {
        let promise = index_2.get('/menu_list', {
            parentId: '-1',
        });
        promise.then((result) => {
            let menuList = result['data']['MenuList'];
            this.state.menuList = menuList;
        });
        return promise;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RoleMenuTree;
});
//# sourceMappingURL=_roleMenuTree.js.map
