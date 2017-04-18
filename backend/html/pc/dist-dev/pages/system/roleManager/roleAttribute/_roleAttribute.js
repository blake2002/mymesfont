define("pages/system/roleManager/roleAttribute/_roleAttribute.js",function(require, exports, module) {
"use strict";
const React = require("react");
exports.React = React;
const index_1 = require("../../../../components/antd/index");
const index_2 = require("../../../../components/template-table/index");
const index_3 = require("../../../../components/template-input/index");
const _roleAjaxData_1 = require("../_roleAjaxData");
class RoleAttribute extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            role_template: [],
            role_detail: [],
            isNew: this.props.query.rowKey == undefined
        };
        this.handleChange = (template, e) => {
            const value = e.target.value;
            this.state.role_detail[template.Name] = value;
            this.setState({
                role_detail: this.state.role_detail
            });
        };
    }
    save() {
        if (this.state.isNew) {
            let Operation = new index_3.DeviceDataOperation('NSDevices', '', this.state.role_detail, this.state.role_template);
            let data = Operation.getData();
            _roleAjaxData_1.default.post_add_role(data).then((reponse) => {
                if (reponse.code == 0) {
                    index_1.message.success('新建成功');
                }
            });
        }
        else {
            let Operation = new index_3.DeviceDataOperation('NSDevices', '', this.state.role_detail, this.state.role_template);
            let data = Operation.getData2();
            console.log((data));
            let roleId = this.props.query.rowKey;
            _roleAjaxData_1.default.post_modified_role(roleId, data).then((reponse) => {
                if (reponse.code == 0) {
                    index_1.message.success('保存成功');
                }
            });
        }
    }
    componentWillMount() {
        if (this.state.isNew) {
            let p1 = _roleAjaxData_1.default.get_role_template();
            p1.then(() => {
                this.setState({
                    role_template: _roleAjaxData_1.default.role_template
                });
            });
        }
        else {
            let p1 = _roleAjaxData_1.default.get_role_template();
            let p2 = _roleAjaxData_1.default.get_role_detail(this.props.query.rowKey);
            Promise.all([p1, p2]).then(() => {
                this.setState({
                    role_template: _roleAjaxData_1.default.role_template,
                    role_detail: index_3.objectToArray2(_roleAjaxData_1.default.role_detail[this.props.query.rowKey])
                });
                console.log(this.state.role_detail);
            });
        }
    }
    render() {
        console.log(this.state);
        return (React.createElement("section", null,
            React.createElement(index_2.default, { data: this.state.role_detail, template: this.state.role_template })));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RoleAttribute;
});
//# sourceMappingURL=_roleAttribute.js.map
