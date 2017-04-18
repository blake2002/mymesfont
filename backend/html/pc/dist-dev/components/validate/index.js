define("components/validate/index.js",function(require, exports, module) {
"use strict";
const React = require("react");
const index_1 = require("../antd/index");
const rule_1 = require("./rule");
exports.addRule = rule_1.addRule;
exports.getLength = rule_1.getLength;
const components_1 = require("../global/components");
;
;
/**
 * 验证类
 *
 * @class Validate
 * @extends {React.Component<IValidateProps, IValidateState>}
 */
class Validate extends components_1.PureComponentGenerics {
    constructor() {
        super(...arguments);
        /**
         * 状态
         *
         * @memberOf Validate
         */
        this.states = {
            msg: [],
            validate: true
        };
    }
    /**
     * 验证 --> 保存验证
     *
     * @param {string} type
     * @param {string} value
     * @returns
     *
     * @memberOf Validate
     */
    valueValidateSave(type, value) {
        let state = this.states;
        let msg = rule_1.messages[type];
        let parameter = this.props[type];
        let validate = this.valueValidate(type, value);
        this.states.validate = state.validate && validate;
        this.setState(this.states);
        if (!validate) {
            state.msg.push(msg(value, parameter));
        }
        return validate;
    }
    /**
     * 渲染
     *
     * @returns {JSX.Element}
     *
     * @memberOf Validate
     */
    render() {
        return (React.createElement(index_1.Popover, { overlayClassName: 'ant-popover-warning', placement: 'topLeft', content: this.msgRender(), visible: !this.states.validate }, this.inputRender()));
    }
    /**
     * 输入框渲染
     *
     * @returns
     *
     * @memberOf Validate
     */
    inputRender() {
        let type = this.props.type;
        let InputAny = index_1.Input;
        if (this.props.value) {
            return (React.createElement(InputAny, { value: this.props.value, defaultValue: this.props.defaultValue, type: type, name: this.props.name, onChange: this.onChange.bind(this), onBlur: this.validate.bind(this) }));
        }
        else {
            return (React.createElement(InputAny, { defaultValue: this.props.defaultValue, type: type, name: this.props.name, onChange: this.onChange.bind(this), onBlur: this.onBlur.bind(this) }));
        }
    }
    /**
     * 验证事件
     *
     * @private
     * @param {any} e
     * @returns
     *
     * @memberOf Validate
     */
    validate(e) {
        let value = e.target.value;
        let state = this.states;
        state.msg = [];
        state.validate = true;
        // 去除前后空格
        value = rule_1.replaceDefault(value);
        let requiredValidate = true;
        if (this.props.required) {
            requiredValidate = this.valueValidateSave('required', value);
        }
        else {
            requiredValidate = this.valueValidate('required', value);
        }
        // if (requiredValidate) {
        //     for (let key in this.props) {
        //         if (messages.hasOwnProperty(key)) {
        //             e.target.value = this.valueReplace(key, value);
        //             this.valueValidateSave(key, value);
        //         }
        //     }
        // }
        this.hiddenPopover();
    }
    /**
     * 定时隐藏提示框
     *
     * @private
     *
     * @memberOf Validate
     */
    hiddenPopover() {
        clearTimeout(this.hiddenST);
        let stFun = () => {
            this.setState(this.states);
        };
        this.hiddenST = setTimeout(() => stFun(), 4500);
    }
    /**
     * 输入值 替换
     *
     * @private
     * @param {any} key
     * @param {any} value
     * @returns
     *
     * @memberOf Validate
     */
    valueReplace(key, value) {
        let replaceFunction = rule_1.replaceArray[key];
        if (replaceFunction) {
            return replaceFunction(value);
        }
        else {
            return value;
        }
    }
    /**
     * 验证信息渲染
     *
     * @returns
     *
     * @memberOf Validate
     */
    msgRender() {
        return React.createElement("div", null, this.states.msg.map((value, index) => React.createElement("p", { key: index }, value)));
    }
    /**
     * 验证
     *
     * @param {string} type 验证类型
     * @param {string} value 验证值
     * @returns
     *
     * @memberOf Validate
     */
    valueValidate(type, value) {
        let parameter = this.props[type];
        let rule = rule_1.ruleArray[type] || rule_1.ruleDefault(type);
        let validate = rule(value, parameter);
        return validate;
    }
    onBlur(e) {
        this.validate(e);
        if (this.props.onBlur) {
            this.props.onBlur(e, this.states.validate);
        }
    }
    onChange(e) {
        this.validate(e);
        if (this.props.onChange) {
            this.props.onChange(e, this.states.validate);
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Validate;
});
//# sourceMappingURL=index.js.map
