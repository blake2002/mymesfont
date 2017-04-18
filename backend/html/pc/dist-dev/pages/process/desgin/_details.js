define("pages/process/desgin/_details.js",function(require, exports, module) {
"use strict";
const React = require("react");
const index_1 = require("../../../components/antd/index");
const react_router_1 = require("react-router");
require("./index.css");
class DeviceDrive extends React.Component {
    constructor(props) {
        super(props);
        this.menu = React.createElement(index_1.Menu, { onClick: this.handleClick.bind(this) },
            React.createElement(index_1.Menu.Item, { key: '1' }, "\u5386\u53F2\u7248\u672C"),
            React.createElement(index_1.Menu.Item, { key: 'del' }, "\u5220\u9664"),
            React.createElement(index_1.Menu.Item, { key: '5' }, "\u65E5\u5FD7"));
        this.state = {
            categroy_options: props.categroy_options,
            category: props.data['category'] ? props.data.category : ''
        };
    }
    handleClick(e) {
        let key = e.key;
        switch (key) {
            case 'del':
                this.props.onDelete(this.props.data);
                break;
            default:
                break;
        }
    }
    //加载真实DOM之前
    componentWillMount() {
    }
    getDisplayValue(text) {
        for (let obj of this.state.categroy_options) {
            if (obj.key == text) {
                return obj.value;
            }
        }
        return '';
    }
    componentWillUpdate(nextProps, nextState) {
        let category = nextProps.data['category'] ? nextProps.data.category : '';
        this.state.categroy_options = nextProps.categroy_options;
        this.state.category = category;
    }
    render() {
        let { state, props } = this;
        const menu = (React.createElement(index_1.Menu, { onClick: this.props.handleMenuClick }, state.categroy_options.map((obj) => {
            return React.createElement(index_1.Menu.Item, { key: obj.key }, obj.value);
        })));
        return (React.createElement("section", { className: 'device-details' },
            React.createElement(index_1.Button, { className: 'btn-position' }, "\u5173\u6CE8"),
            React.createElement("h4", null,
                React.createElement("p", null, props.data.name),
                React.createElement("p", null, props.data.key)),
            React.createElement("table", { className: 'table-details' },
                React.createElement("tbody", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, "\u6D41\u7A0B\u7248\u672C"),
                        React.createElement("td", null, props.data.version)),
                    React.createElement("tr", null,
                        React.createElement("th", null, "\u6D41\u7A0B\u7C7B\u578B"),
                        React.createElement("td", null,
                            React.createElement(index_1.Dropdown, { trigger: ['click'], overlay: menu },
                                React.createElement(index_1.Button, { type: "ghost", style: { marginLeft: 8 } },
                                    this.getDisplayValue(state.category),
                                    " ",
                                    React.createElement(index_1.Icon, { type: "down" }))))),
                    React.createElement("tr", null,
                        React.createElement("th", null, "\u521B\u5EFA\u65F6\u95F4"),
                        React.createElement("td", null, props.data.createTime)),
                    React.createElement("tr", null,
                        React.createElement("th", null, "\u66F4\u65B0\u65F6\u95F4"),
                        React.createElement("td", null, props.data.lastUpdateTime)),
                    React.createElement("tr", null,
                        React.createElement("th", null, "\u66F4\u65B0\u4EBA\u5458"),
                        React.createElement("td", null, props.data.updateBy)),
                    React.createElement("tr", null,
                        React.createElement("th", null, "\u6D41\u7A0B\u63CF\u8FF0"),
                        React.createElement("td", null, "''")))),
            React.createElement("section", { className: 'component-slip-footer' },
                React.createElement(react_router_1.Link, { to: {
                        pathname: '/process/desgin/processDetails',
                        query: { DeviceID: props.data.DeviceID }
                    } },
                    React.createElement(index_1.Button, null, "\u4FEE\u6539")),
                React.createElement(index_1.Button, { onClick: () => props.onSwitchChange(false, props.data) }, "\u53D1\u5E03"),
                React.createElement(index_1.Dropdown, { overlay: this.menu },
                    React.createElement(index_1.Button, null, "\u66F4\u591A")))));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DeviceDrive;
});
//# sourceMappingURL=_details.js.map
