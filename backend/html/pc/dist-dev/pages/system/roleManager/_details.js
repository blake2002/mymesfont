define("pages/system/roleManager/_details.js",function(require, exports, module) {
"use strict";
const React = require("react");
const index_1 = require("../../../components/antd/index");
const react_router_1 = require("react-router");
require("./index.css");
const _roleAjaxData_1 = require("./_roleAjaxData");
//props rowKey dataSource selectedRowKeys
class Details extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            mode: 0,
            role_detail: {},
            modalSlipVisable: false,
            treeVisible: false,
            treeSelectId: ''
        };
        this.treeType = 'region_tree';
        this.onButtonDelete = () => {
            let p = _roleAjaxData_1.default.post_delete_role(this.props.selectedRowKeys);
            p.then((reponse) => {
                if (reponse.code == 0) {
                    index_1.message.success('删除成功');
                    this.props.updateData();
                }
            });
            return p;
        };
        this.menu = React.createElement(index_1.Menu, { onClick: this.handleClick.bind(this) },
            React.createElement(index_1.Menu.Item, { key: '1' }, "\u5386\u53F2\u7248\u672C"),
            React.createElement(index_1.Menu.Item, { key: 'del' }, "\u5220\u9664"),
            React.createElement(index_1.Menu.Item, { key: '5' }, "\u65E5\u5FD7"));
    }
    componentWillMount() {
        console.log('componentWillMount');
    }
    componentWillUpdate(nextProps, nextState) {
        this.state.modalSlipVisable = nextProps.selectedRowKeys.length > 0 || nextProps.currentKey != '';
        nextProps.selectedRowKeys.length <= 0 ? this.state.mode = 0 : this.state.mode = 1;
        if (this.state.mode == 0 && this.state.modalSlipVisable) {
            this.state.role_detail = nextProps.role_detail;
        } //this.updateData(nextProps.currentKey)
    }
    updateData(currentKey) {
        let ret = _roleAjaxData_1.default.get_role_detail(currentKey);
        ret.then(() => {
            this.state.role_detail = _roleAjaxData_1.default.role_detail[currentKey];
        });
    }
    getAreaNames(area) {
        let names = '';
        for (let i in area) {
            let path = area[i].Path;
            names += path[path.length - 1].Name + ',';
        }
        return names.substring(0, names.length - 1);
    }
    renderDetail() {
        let { state, props } = this;
        return (React.createElement("section", { className: 'device-details' },
            React.createElement("h4", null,
                React.createElement("p", null, this.state.role_detail['Name'] || ''),
                React.createElement("p", null, this.state.role_detail['ID'] || '')),
            React.createElement("table", { className: 'table-details' },
                React.createElement("tbody", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, "\u89D2\u8272\u7C7B\u578B"),
                        React.createElement("td", null, this.state.role_detail['Type'])),
                    React.createElement("tr", null,
                        React.createElement("th", null, "\u533A\u57DF\u67B6\u6784"),
                        React.createElement("td", null, this.getAreaNames(this.state.role_detail['Area']))),
                    React.createElement("tr", null,
                        React.createElement("th", null, "\u7EC4\u7EC7\u67B6\u6784"),
                        React.createElement("td", null, this.getAreaNames(this.state.role_detail['Organization']))))),
            React.createElement("section", { className: 'component-slip-footer' },
                React.createElement(react_router_1.Link, { to: {
                        pathname: '/system/roleManager/roleAttribute/_roleNav',
                        query: {
                            rowKey: this.props.currentKey
                        }
                    } },
                    React.createElement(index_1.Button, null, "\u4FEE\u6539")),
                React.createElement(index_1.Button, { onClick: this.onEnable.bind(this) }, this.state.role_detail['Enable'] == 'true' ? '禁用' : '启用'),
                React.createElement(index_1.Dropdown, { overlay: this.menu },
                    React.createElement(index_1.Button, null, "\u66F4\u591A")))));
    }
    onEnable() {
        let v = this.state.role_detail['Enable'] == 'true' ? 'false' : 'true';
        let p = _roleAjaxData_1.default.post_modified_role(this.state.role_detail['ID'], [{
                'ParameterName': 'Enable',
                'ParameterValue': v
            }]);
        p.then((reponse) => {
            if (reponse.code == 0) {
                index_1.message.success('修改成功');
                this.state.role_detail['Enable'] = v;
                // this.setState(this.state)
                this.props.onEnableChange(v);
            }
        });
    }
    renderMultipleSelect() {
        if (this.props.selectedRowKeys.length == 0) {
            return React.createElement("div", null);
        }
        let each = (rootAry, key) => {
            for (let i in rootAry) {
                let wfObj = rootAry[i];
                if (wfObj[this.props.rowKey] == key) {
                    return wfObj;
                }
            }
            return null;
        };
        return React.createElement("section", null,
            React.createElement("ul", { className: 'ul-details' },
                " ",
                this.props.selectedRowKeys.map((value, index) => {
                    if (value != undefined) {
                        let wfObj = each(this.props.dataSource, value);
                        return React.createElement("li", { key: wfObj[this.props.rowKey] }, wfObj.Name);
                    }
                })),
            React.createElement("section", { className: 'component-slip-footer' },
                React.createElement(index_1.Button, { onClick: this.onButtonDelete }, "\u5220\u9664")));
    }
    render() {
        return React.createElement(index_1.ModalSlip, { title: '角色详情', onCancel: () => this.setState({ modalSlipVisable: false }), visible: this.state.modalSlipVisable }, this.state.mode === 0 ?
            this.renderDetail() :
            this.renderMultipleSelect());
    }
    handleClick(e) {
        if (e.key == 'del') {
            this.onButtonDelete();
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Details;
});
//# sourceMappingURL=_details.js.map
