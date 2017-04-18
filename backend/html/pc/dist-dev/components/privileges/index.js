define("components/privileges/index.js",function(require, exports, module) {
"use strict";
const React = require("react");
;
;
/**
 * 判断是否有权限组件版
 *
 * @export
 * @class Component
 * @extends {React.Component<IComponentProps, IComponentState>}
 */
class Component extends React.Component {
    render() {
        let { props, state } = this;
        if (havePrivileges(props.value)) {
            return this.props.children;
        }
        else {
            return null;
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Component;
let userPrivileges = JSON.parse(localStorage.getItem('userPrivileges'));
// console.log(userPrivileges);
/**
 * 判断 是否有权限
 *
 * @export
 * @param {string} value
 * @returns {boolean}
 */
function havePrivileges(value) {
    return true;
    if (!value) {
        console.warn(`未配置权限！请在页面中输出权限 export let privileges = '/device/devices'`);
        return true;
    }
    return !!userPrivileges.find(privileges => privileges === value);
}
exports.havePrivileges = havePrivileges;
});
//# sourceMappingURL=index.js.map
