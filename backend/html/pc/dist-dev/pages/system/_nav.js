define("pages/system/_nav.js",function(require, exports, module) {
"use strict";
const React = require("react");
exports.React = React;
const _main_1 = require("../_main");
const components_1 = require("../../components/global/components");
class Nav extends components_1.PureComponentGenerics {
    render() {
        return React.createElement(_main_1.Nav, { data: [{
                    name: '系统菜单管理',
                    url: '/system/systemMenuManager/index',
                    operations: this.props.operations
                }, {
                    name: '角色管理',
                    url: '/system/roleManager/index',
                    operations: this.props.operations
                }, {
                    name: '字典管理',
                    url: '/system/dict/index',
                    operations: this.props.operations
                }, {
                    name: '日志',
                    url: '/system/systemMenuManagq111er/index',
                    operations: ''
                }] });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Nav;
});
//# sourceMappingURL=_nav.js.map
