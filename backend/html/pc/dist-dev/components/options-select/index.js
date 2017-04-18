define("components/options-select/index.js",function(require, exports, module) {
"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const React = require("react");
const index_1 = require("../ajax/index");
const index_2 = require("../antd/index");
/**
 * 获取后台枚举
 * group-设备分组, 如: 空调锅炉
 * rtdb, 实时数据库, 如：RTDB001, RTDB002
 * flowchart - 设备关联流程图,
 * 设备驱动
 * 注：设备驱动的模板内的选项值，不从此接口取
 * driver - 设备驱动分类, 如: ModbusRTU, OmronHostLink
 * 设备变量
 * var_type - 变量类型
 * var_datatype - 数据类型, 如byte,int,string
 * var_convertor, 工程转换
 * enum_switch, 启用禁用
 *
 * @export
 * @param {Categroy} categroy
 */
exports.getOptions = (categroy) => __awaiter(this, void 0, void 0, function* () {
    let { data } = yield index_1.get({
        url: '/dict_options',
        data: {
            categroy: categroy
        },
        type: 1
    });
    return data;
});
;
;
class OptionsSelect extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            data: []
        };
    }
    ajaxData() {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield exports.getOptions(this.props.type);
            this.state.data = data;
            this.props.onChange(this.state.data[0].Key, this.state.data[0].Value);
            this.setState(this.state);
        });
    }
    onChange(value) {
        this.props.onChange(value, this.state.data.find(data => data.Key === value).Value);
    }
    componentDidMount() {
        this.ajaxData();
    }
    render() {
        if (this.state.data.length > 0) {
            return React.createElement(index_2.Select, __assign({}, this.props, { onChange: this.onChange.bind(this), defaultValue: this.state.data[0].Key }), this.state.data.map(value => React.createElement(index_2.Option, { key: value.Key, value: value.Key }, value.Value)));
        }
        else {
            return React.createElement("span", null,
                React.createElement(index_2.Select, __assign({}, this.props, { onChange: this.onChange.bind(this) })));
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = OptionsSelect;
});
//# sourceMappingURL=index.js.map
