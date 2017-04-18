define("test/global/index.js",function(require, exports, module) {
"use strict";
const React = require("react");
const ReactDOM = require("react-dom");
class App extends React.Component {
    render() {
        return (React.createElement("section", { className: 'h100' }));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
ReactDOM.render(React.createElement(App, null), document.getElementById('app'));
});
//# sourceMappingURL=index.js.map
