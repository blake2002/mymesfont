import * as React from 'react';
import { Input, Popover } from '../antd/index';
import {
    addRule, getLength, messages,
    regExpArray, ruleDefault, ruleArray, replaceArray, RuleFunction, replaceDefault
} from './rule';
import { InputProps } from 'antd/lib/input/Input';
import { PureComponentGenerics } from '../global/components';

/**
 * 验证组件 属性
 * 
 * @interface IValidateProps
 * @extends {InputProps}
 */
export interface IValidateProps {
    /**
     * 输入框类型
     * 
     * @type {string}
     * @memberOf IValidateProps
     */
    type?: 'lable' | string,

    /**
     * 必填
     * 
     * @type {boolean}
     * @memberOf IValidateProps
     */
    required?: boolean
    /**
     * 数值最小值
     * 
     * @type {number}
     * @memberOf IValidateProps
     */
    min?: number
    /**
     * 数值最大值
     * 
     * @type {number}
     * @memberOf IValidateProps
     */
    max?: number
    /**
     * 字符串长度最小值
     * 
     * @type {number}
     * @memberOf IValidateProps
     */
    minLength?: number
    /**
     * 字符串长度最大值
     * 
     * @type {number}
     * @memberOf IValidateProps
     */
    maxLength?: number
    /**
     * 是否开启符号输入
     * 
     * @type {number}
     * @memberOf IValidateProps
     */
    noSymbol?: boolean

    /**
     * 电话
     * 
     * @type {boolean}
     * @memberOf IValidateProps
     */
    telephone?: boolean

    placeholder?: string
    value?: string
    defaultValue?: string

    /**
     * 自定义规则
     * 
     */
    [key: string]: any


    /**
     * 改变事件
     * 
     * 
     * @memberOf IValidateProps
     */
    onChange?: (e: any, bl: boolean) => void;
    /**
     * 改变事件
     * 
     * 
     * @memberOf IValidateProps
     */
    onBlur?: (e: any, bl: boolean) => void;


    name?: string
};
/**
 * 状态
 * 
 * @interface IValidateState
 */
export interface IValidateState {
    /**
     * 验证信息
     * 
     * @type {string[]}
     * @memberOf IValidateState
     */
    msg?: string[],
    /**
     * 验证结果
     * 
     * @type {boolean}
     * @memberOf IValidateState
     */
    validate?: boolean

    /**
     * 是否显示input 类型不是lable的时候始终现实input
     * 
     * @type {boolean}
     * @memberOf IValidateState
     */
    show?: boolean


    value?: string

};
/**
 * 验证类
 * 
 * @class Validate
 * @extends {React.Component<IValidateProps, IValidateState>}
 */
class Validate extends PureComponentGenerics<IValidateProps, IValidateState> {

    /**
     * 状态
     *
     * @memberOf Validate
     */
    states = {
        msg: [],
        validate: true
    }
    private hiddenST

    /**
     * 验证 --> 保存验证
     * 
     * @param {string} type
     * @param {string} value
     * @returns
     *  
     * @memberOf Validate
     */
    valueValidateSave(type: string, value: string) {
        let state = this.states;
        let msg = messages[type];
        let parameter = this.props[type];
        let validate = this.valueValidate(type, value);

        this.states.validate = state.validate && validate;
        this.setState(this.states);
        if (!validate) {
            state.msg.push(msg(value, parameter))
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
    render(): JSX.Element {
        return (<Popover overlayClassName='ant-popover-warning'
            placement='topLeft' content={this.msgRender()} visible={!this.states.validate}>
            {
                this.inputRender()
            }
        </Popover >);
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
        let InputAny = Input as any;
        if (this.props.value) {
            return (<InputAny value={this.props.value} defaultValue={this.props.defaultValue} type={type}
                name={this.props.name}
                onChange={this.onChange.bind(this)}
                onBlur={this.validate.bind(this)} />);
        } else {
            return (<InputAny defaultValue={this.props.defaultValue} type={type} name={this.props.name}
                onChange={this.onChange.bind(this)}
                onBlur={this.onBlur.bind(this)} />);
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
    private validate(e) {
        let value = e.target.value;
        let state = this.states;
        state.msg = [];
        state.validate = true;
        // 去除前后空格
        value = replaceDefault(value);

        let requiredValidate = true;
        if (this.props.required) {
            requiredValidate = this.valueValidateSave('required', value);
        } else {
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
    private hiddenPopover() {
        clearTimeout(this.hiddenST);

        let stFun = () => {
            this.setState(this.states);
        }
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
    private valueReplace(key, value) {
        let replaceFunction = replaceArray[key];
        if (replaceFunction) {
            return replaceFunction(value);
        } else {
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
    private msgRender() {
        return <div>{
            this.states.msg.map((value, index) => <p key={index}>{value}</p>)
        }</div>;
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
    private valueValidate(type: string, value: string) {
        let parameter = this.props[type];
        let rule = ruleArray[type] || ruleDefault(type);
        let validate = rule(value, parameter);
        return validate;
    }

    private onBlur(e) {
        this.validate(e);
        if (this.props.onBlur) {
            this.props.onBlur(e, this.states.validate);
        }
    }

    private onChange(e) {
        this.validate(e);
        if (this.props.onChange) {
            this.props.onChange(e, this.states.validate);
        }
    }
}


export { addRule, getLength };
export default Validate;



