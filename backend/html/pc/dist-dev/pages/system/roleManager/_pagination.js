define("pages/system/roleManager/_pagination.js",function(require, exports, module) {
"use strict";
const React = require("react");
exports.React = React;
const index_1 = require("../../../components/antd/index");
class MyPagination extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            current: 1
        };
    }
    /**
     * 插入真实DOM之前
     */
    componentWillMount() {
    }
    /**
     * 页码改变的回调，参数是改变后的页码及每页条数
     */
    onChange(page, pageSize) {
        this.setState({ current: page });
    }
    render() {
        return React.createElement(index_1.Pagination, { defaultCurrent: 1, total: 5, onChange: this.onChange.bind(this) });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MyPagination;
});
//# sourceMappingURL=_pagination.js.map
