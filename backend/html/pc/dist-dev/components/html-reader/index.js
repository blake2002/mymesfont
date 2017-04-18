define("components/html-reader/index.js",function(require, exports, module) {
"use strict";
const React = require("react");
class MyClass extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            b: 'bb',
            dd: this.props.a
        };
    }
    log(name) {
        ;
    }
    render() {
        return (React.createElement("div", null, this.state.b));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MyClass;
});
//# sourceMappingURL=index.js.map
