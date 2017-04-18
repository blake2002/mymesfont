define("pages/test/table/index.js",function(require, exports, module) {
"use strict";
const React = require("react");
const index_1 = require("../../../components/table/index");
class TableNew extends index_1.default {
}
const dataSource = [{
        key: '1',
        name: '胡彦斌',
        age: 32,
        address: '西湖区湖底公园1号'
    }, {
        key: '2',
        name: '胡彦祖',
        age: 42,
        address: '西湖区湖底公园1号'
    }];
const columns = [{
        title: '姓名',
        dataIndex: 'name',
        key: 'name'
    }, {
        title: '年龄',
        dataIndex: 'age',
        key: 'age'
    }, {
        title: '住址',
        dataIndex: 'address',
        key: 'address'
    }];
class Component extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            text: '点击我',
            text2: 'text2'
        };
    }
    btnClick() {
        this.setState({
            text: '1',
            text2: 'text2'
        });
    }
    render() {
        const { state } = this;
        return React.createElement("section", { className: 'page-home' },
            React.createElement("h2", null, "\u8868\u683C"),
            React.createElement(TableNew, { dataSource: dataSource, columns: columns }));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Component;
});
//# sourceMappingURL=index.js.map
