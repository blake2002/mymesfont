define("components/template-table/index.js",function(require, exports, module) {
"use strict";
const React = require("react");
const index_1 = require("../template-input/index");
;
;
/**
 * 新增设备-表单
 *
 * @class AddInformation
 * @extends {React.Component<IAddInformationProps, IAddInformationState>}
 */
class AddInformation extends React.Component {
    /**
     * 根据模版找值
     *
     * @param {NSDevices} value
     * @returns
     *
     * @memberOf AddInformation
     */
    getValue(template) {
        let { data } = this.props;
        data = data || [];
        let value = data.find(data => data.ParameterName === template.Name);
        if (!value) {
            value = {
                ParameterName: template.Name,
                ParameterValue: ''
            };
            data.push(value);
        }
        return value;
    }
    /**
     * 是否显示
     *
     * @param {DevicesTemplate} template
     * @returns
     *
     * @memberOf AddInformation
     */
    isShow(template) {
        let show = true;
        if (!template) {
            show = false;
        }
        else {
            if (template.Visible === 'false') {
                show = false;
            }
            if (template.Form && template.Form.Type === 'Hidden') {
                show = false;
            }
            if (template.Name === 'Latitude') {
                show = false;
            }
        }
        return show;
    }
    render() {
        let { props, state } = this;
        let { data, template } = props;
        return (React.createElement("table", { className: 'table-from' }, template.map(template => {
            let value = this.getValue(template);
            let bl = this.isShow(template);
            if (bl) {
                return React.createElement("tbody", { key: value.ParameterName },
                    React.createElement("tr", null, template.Name === 'Longitude' ?
                        React.createElement("td", null, "\u7ECF\u7EAC\u5EA6") :
                        React.createElement("td", null, template.Description)),
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement(index_1.default, { dataList: data, data: value, template: template }))));
            }
        })));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AddInformation;
});
//# sourceMappingURL=index.js.map
