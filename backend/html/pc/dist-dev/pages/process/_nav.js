define("pages/process/_nav.js",function(require, exports, module) {
"use strict";
const React = require("react");
exports.React = React;
const _main_1 = require("../_main");
const components_1 = require("../../components/global/components");
class Nav extends components_1.PureComponentGenerics {
    render() {
        return React.createElement(_main_1.Nav, { data: [{
                    name: '设计时',
                    url: '/process/desgin/index',
                    operations: this.props.operations
                }, {
                    name: '已发布',
                    url: '/process/desgin/index',
                    operations: ''
                }, {
                    name: '运行时',
                    url: '/process/desgin/index',
                    operations: ''
                }] });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Nav;
});
//# sourceMappingURL=_nav.js.map
