define("pages/test/treeSelect/select.js",function(require, exports, module) {
"use strict";
const React = require("react");
const index_1 = require("../../../components/antd/index");
const myTree_1 = require("../treeSelect/myTree");
class MyTreeSelect extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            value: [],
            nodeData: []
        };
    }
    componentWillMount() {
        // console.log('11');
    }
    onChange(value) {
        this.setState({
            value: value
        });
    }
    onClick(e) {
        if (this.props.onGetNode) {
            this.props.onGetNode(e);
        }
        this.setState({
            value: [e.name]
        });
    }
    render() {
        return React.createElement("section", null,
            React.createElement(index_1.Select, { multiple: true, style: { width: '80%' }, dropdownStyle: { height: '0' }, placeholder: 'Please select', onChange: this.onChange.bind(this), value: this.state.value }),
            React.createElement(myTree_1.Mytree, { treeType: this.props.treeType, onClick: this.onClick.bind(this) }));
    }
}
exports.MyTreeSelect = MyTreeSelect;
});
//# sourceMappingURL=select.js.map
