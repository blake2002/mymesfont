define("components/text-input/index.js",function(require, exports, module) {
"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
const React = require("react");
const index_1 = require("../validate/index");
const components_1 = require("../global/components");
require("./index.css");
;
;
class TextInput extends components_1.PureComponentGenerics {
    constructor() {
        super(...arguments);
        this.states = {
            show: true,
            value: this.props.value || this.props.defaultValue
        };
    }
    render() {
        let { states, props } = this;
        return (React.createElement("section", { className: 'cp-text-input ' + (this.states.show ? 'show-text' : '') },
            React.createElement("span", { className: 'cp-text-input-text', onClick: this.spanClick.bind(this) }, this.states.value),
            React.createElement("span", { className: 'cp-text-input-input' },
                React.createElement(index_1.default, __assign({}, props, { onBlur: this.onBlur.bind(this) })))));
    }
    onBlur(e, bl) {
        if (bl) {
            this.states.show = true;
            this.states.value = e.target.value;
            this.setState(this.states);
        }
        if (this.props.onBlur) {
            this.props.onBlur(e, bl);
        }
    }
    spanClick() {
        this.states.show = false;
        this.setState(this.states);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TextInput;
});
//# sourceMappingURL=index.js.map
