define("pages/roles/index.js",function(require, exports, module) {
"use strict";
const React = require("react");
class Component extends React.PureComponent {
    render() {
        const { state } = this;
        return React.createElement("section", { className: 'page-roles' },
            React.createElement("h2", null, "roles"));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Component;
});
//# sourceMappingURL=index.js.map
