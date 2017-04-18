define("pages/test/treeSelect/buttomModel.js",function(require, exports, module) {
"use strict";
const React = require("react");
const index_1 = require("../../../components/antd/index");
const selectTree_1 = require("../../device/selectTree/selectTree");
class ButtonModal extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            visible: false,
            nodeData: this.props.value ? this.props.value : []
        };
    }
    componentWillMount() {
        console.log('11');
    }
    handleOk() {
        this.state.visible = false;
        this.setState(this.state);
        if (this.props.onGetNode) {
            console.log(this.state.nodeData);
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
    render() {
        return React.createElement("section", null,
            React.createElement(index_1.Button, { onClick: this.onClick.bind(this) }, this.props.title),
            React.createElement(index_1.Modal, { title: 'Basic Modal', visible: this.state.visible, onOk: this.handleOk.bind(this), onCancel: this.handleCancel.bind(this), style: { width: '10px' } },
                React.createElement(selectTree_1.MyTreeSelect, { onGetNode: (this.onGetNode.bind(this)), treeType: this.props.treeType, value: this.state.nodeData, jurisdiction: 'part', multiple: true })));
    }
}
exports.ButtonModal = ButtonModal;
});
//# sourceMappingURL=buttomModel.js.map
