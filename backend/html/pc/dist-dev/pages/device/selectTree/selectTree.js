define("pages/device/selectTree/selectTree.js",function(require, exports, module) {
"use strict";
const React = require("react");
const index_1 = require("../../../components/antd/index");
const mytree_1 = require("../selectTree/mytree");
require("./selectTree.css");
const Option = index_1.Select.Option;
class MyTreeSelect extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            value: [],
            gData: this.props.value ? this.props.value : []
        };
    }
    componentWillMount() {
        let value = [];
        this.state.gData.forEach(item => {
            value.push(item.id);
        });
        this.setState({
            value
        });
    }
    onChange(value) {
        let parameter = [];
        value.forEach(item => {
            let nodeObj = this.state.gData.find(obj => {
                return obj.id === item;
            });
            parameter.push(nodeObj);
        });
        if (this.props.onGetNode) {
            this.props.onGetNode(parameter);
        }
        this.setState({
            value
        });
    }
    onClick(e) {
        if (this.props.onGetNode) {
            this.props.onGetNode(e);
        }
        let data = [];
        e.forEach(item => {
            data.push(item.id);
        });
        this.setState({
            value: data,
            gData: e
        });
    }
    render() {
        let children = [];
        this.state.gData.forEach(item => {
            children.push(React.createElement(Option, { key: item.id }, item.name));
        });
        return React.createElement("section", null,
            React.createElement(index_1.Select, { multiple: true, style: { width: '100%' }, dropdownStyle: { height: '0' }, placeholder: 'Please select', onChange: this.onChange.bind(this), value: this.state.value }, children),
            React.createElement(mytree_1.Mytree, { treeType: this.props.treeType, onClick: this.onClick.bind(this), value: this.props.value, jurisdiction: this.props.jurisdiction, multiple: this.props.multiple, selectedNode: this.state.value }));
    }
}
exports.MyTreeSelect = MyTreeSelect;
MyTreeSelect.defaultProps = {
    treeType: 'region_tree',
    multiple: false
};
});
//# sourceMappingURL=selectTree.js.map
