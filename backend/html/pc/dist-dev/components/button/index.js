define("components/button/index.js",function(require, exports, module) {
"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
require("../antd/style/index.css");
const React = require("react");
let Spin = require('antd/lib/spin/index');
let Button = require('antd/lib/button/index');
exports.Button = Button;
let SpinC = Spin;
const index_1 = require("../privileges/index");
class Component extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            loading: false
        };
    }
    onClick(e) {
        let onClickBack = this.props.onClick(e);
        let self = this;
        if (onClickBack && onClickBack.then) {
            self.state.loading = true;
            self.setState(self.state);
            return onClickBack.then(function (arg) {
                self.state.loading = false;
                self.setState(self.state);
                return arg;
            }, function (arg) {
                self.state.loading = false;
                self.setState(self.state);
                return arg;
            });
        }
        else {
            return onClickBack;
        }
    }
    render() {
        let pr = true;
        if (this.props.privileges) {
            pr = index_1.havePrivileges(this.props.privileges);
        }
        let prop = Object.assign({}, this.props);
        if (prop.privileges) {
            delete prop.privileges;
        }
        if (pr) {
            return (React.createElement("span", { className: this.props && this.props.className },
                React.createElement(SpinC, { spinning: this.state.loading, size: 'small', style: { display: 'inline-block' } },
                    React.createElement(Button, __assign({}, prop, { className: '', onClick: this.props.onClick && this.onClick.bind(this) }), this.props.children))));
        }
        else {
            return null;
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Component;
});
//# sourceMappingURL=index.js.map
