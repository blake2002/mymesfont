define("pages/device/selectTree/selectModal.js",function(require, exports, module) {
"use strict";
const React = require("react");
const index_1 = require("../../../components/antd/index");
const selectTree_1 = require("./selectTree");
class SelectModal extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            visible: false,
            nodeData: [],
            value: []
        };
    }
    componentWillMount() {
        console.log('11');
    }
    handleOk() {
        this.state.visible = false;
        this.setState(this.state);
        if (this.props.onGetNode) {
            this.props.onGetNode(this.state.nodeData);
        }
    }
    handleCancel() {
        this.state.visible = false;
        this.setState(this.state);
    }
    onClick() {
        this.state.visible = true;
        this.setState(this.state);
    }
    onGetNode(value) {
        this.setState({
            nodeData: value
        });
    }
    onChange(value) {
        this.setState({
            value: value
        });
    }
    render() {
        return React.createElement("section", null,
            React.createElement(index_1.Select, { multiple: true, style: { width: '300px' }, dropdownStyle: { height: '0' }, placeholder: 'Please select', onChange: this.onChange.bind(this), value: this.state.value }),
            React.createElement(index_1.Modal, { title: 'Basic Modal', visible: this.state.visible, onOk: this.handleOk.bind(this), onCancel: this.handleCancel.bind(this), style: { width: '10px' } },
                React.createElement(selectTree_1.MyTreeSelect, { onGetNode: (this.onGetNode.bind(this)), jurisdiction: 'only' })));
    }
}
exports.SelectModal = SelectModal;
});
//# sourceMappingURL=selectModal.js.map
