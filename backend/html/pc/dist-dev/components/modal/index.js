define("components/modal/index.js",function(require, exports, module) {
"use strict";
const React = require("react");
let modal = require('antd/lib/modal/index');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = modal;
let Icon = require('antd/lib/icon/index');
require("./index.css");
;
;
class ModalSlip extends React.Component {
    render() {
        let { props } = this;
        return (React.createElement("section", { className: 'component-slip ' + (this.props.visible ? 'visible' : '') },
            React.createElement("div", { className: 'component-slip-content' },
                React.createElement("div", { className: 'component-slip-title' },
                    React.createElement(Icon, { onClick: () => this.props.onCancel(), className: 'component-slip-close', type: 'close' }),
                    props.title),
                props.children)));
    }
}
exports.ModalSlip = ModalSlip;
});
//# sourceMappingURL=index.js.map
