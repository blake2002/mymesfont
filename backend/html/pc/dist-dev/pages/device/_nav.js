define("pages/device/_nav.js",function(require, exports, module) {
"use strict";
const React = require("react");
exports.React = React;
const _main_1 = require("../_main");
const components_1 = require("../../components/global/components");
;
;
class Nav extends components_1.PureComponentGenerics {
    render() {
        return React.createElement(_main_1.Nav, { data: [{
                    name: '设备管理',
                    url: '/device/device/index',
                    privileges: '/device/devices'
                }, {
                    name: '关联人员',
                    url: '/device/members/index',
                    privileges: '/device/members'
                },
            ] });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Nav;
});
//# sourceMappingURL=_nav.js.map
