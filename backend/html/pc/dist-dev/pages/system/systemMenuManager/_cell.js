define("pages/system/systemMenuManager/_cell.js",function(require, exports, module) {
"use strict";
const React = require("react");
// import { get, post } from '../../../components/ajax/index'
const index_1 = require("../../../components/antd/index");
class EditableCell extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            value: this.props.value,
            // flag: this.props.flag || CellFlag.None,
            editable: false,
        };
        /**
         * 编辑框发生变化候触发
         */
        this.handleChange = (e) => {
            const value = e.target.value;
            if (value != this.props.value) {
                this.props.onChange(value);
            }
            this.setState({ value });
        };
        /**
         * 开始编辑模式
         */
        this.edit = () => {
            this.setState({ editable: true });
        };
    }
    componentWillMount() {
        this.state.editable = this.props.flag === 'new';
    }
    componentWillUpdate(nextProps, nextState) {
        if (nextProps.finish && nextProps.finish == true) {
            this.state.editable = false;
        }
    }
    render() {
        const { value, editable } = this.state;
        return (React.createElement("span", { className: "editable-cell" }, editable ?
            React.createElement("span", { className: "editable-cell-input-wrapper" },
                React.createElement(index_1.Input, { className: 'editable-cellName', value: value, onChange: this.handleChange }))
            :
                React.createElement("span", { className: "editable-cell-text-wrapper", onClick: this.edit }, value || ' ')));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EditableCell;
});
//# sourceMappingURL=_cell.js.map
