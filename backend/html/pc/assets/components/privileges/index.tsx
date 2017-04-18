import * as React from 'react';


interface IComponentProps {
    value: string
};
interface IComponentState { };
/**
 * 判断是否有权限组件版
 * 
 * @export
 * @class Component
 * @extends {React.Component<IComponentProps, IComponentState>}
 */
export default class Component extends React.Component<IComponentProps, IComponentState> {
    public render(): JSX.Element {
        let {props, state} = this;

        if (havePrivileges(props.value)) {
            return (this.props.children as any);
        } else {
            return null;
        }
    }
}

let userPrivileges: string[] = JSON.parse(localStorage.getItem('userPrivileges'));
// console.log(userPrivileges);

/**
 * 判断 是否有权限
 * 
 * @export
 * @param {string} value
 * @returns {boolean}
 */
export function havePrivileges(value: string): boolean {
    return true
    if (!value) {
        console.warn(`未配置权限！请在页面中输出权限 export let privileges = '/device/devices'`);
        return true;
    }

    return !!userPrivileges.find(privileges => privileges === value);
}