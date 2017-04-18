define("components/switch-text/index.js",function(require, exports, module) {
"use strict";
const React = require("react");
require("./index.css");
;
;
class TextInput extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            show: this.props.defaultShow !== undefined ? this.props.defaultShow : false
        };
    }
    render() {
        let { state, props } = this;
        return (React.createElement("section", { className: 'cp-text-input' }, this.state.show ?
            React.createElement("span", { className: 'cp-text-input-input', onClick: this.inputClick.bind(this) }, this.props.input) :
            React.createElement("span", { className: 'cp-text-input-text', onClick: this.spanClick.bind(this) }, this.props.text)));
    }
    inputClick(e) {
        e.nativeEvent.stopImmediatePropagation();
    }
    componentWillMount() {
        document.addEventListener('click', this.show.bind(this));
    }
    componentWillUnmount() {
        document.removeEventListener('click', this.show.bind(this));
    }
    spanClick(e) {
        this.state.show = true;
        this.setState(this.state);
        e.nativeEvent.stopImmediatePropagation();
    }
    show(e) {
        if (this.state.show) {
            this.state.show = false;
            this.setState(this.state);
        }
    }
    onChange(e) {
        let target = e.target;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TextInput;
});
//# sourceMappingURL=index.js.map
