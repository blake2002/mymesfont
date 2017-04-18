import * as React from 'react';
import { Pathname, Search, LocationState, Action, LocationKey } from 'history';
export { React };

interface RouteLocation<query> {
    pathname: Pathname
    search: Search
    query: query
    state: LocationState
    action: Action
    key: LocationKey
    basename?: string;
}

/**
 * 新版本router的跳转方法
 * 
 * @interface RouteComponentProps
 * @extends {ReactRouter.RouteComponentProps<any, any>}
 */
export interface RouteComponentProps<query> extends ReactRouter.RouteComponentProps<any, any> {
    location: RouteLocation<query>
    router: {
        push: (str: string) => void,
        goBack: () => void
    }
}

/**
 * PureComponent
 * 
 * @export
 * @class PureComponentGenerics
 * @extends {React.PureComponent<props, state>}
 * @template props
 * @template state
 */
export class PureComponentGenerics<props, state> extends React.PureComponent<props, state> {
    states: state
    state = Object.assign({}, this.states);
}
export class PureComponent extends PureComponentGenerics<any, any> { }

/**
 * Component
 * 
 * @export
 * @class Component
 * @extends {React.Component<any, any>}
 */
export class Component extends React.Component<any, any> { }

/**
 * 页面参数
 * 
 * @interface PageProps
 * @template query
 */
export interface PageProps<query> {
    /**
     * 返回
     * 
     * 
     * @memberOf PageProps
     */
    goBack: () => void
    /**
     * 跳转页面
     * 
     * 
     * @memberOf PageProps
     */
    jump: (url: string, data?: any) => void
    /**
     * 原始router
     * 
     * @type {RouteComponentProps<query>}
     * @memberOf PageProps
     */
    _router?: RouteComponentProps<query>

    /**
     * 连接
     * 
     * @type {string}
     * @memberOf PageProps
     */
    url: string,

    /**
     * 页面参数
     * 
     * @type {{ [key: string]: string }}
     * @memberOf PageProps
     */
    query: query
}
/**
 *  页面 模版组件
 * 
 * @export
 * @class PageComponent
 * @extends {React.PureComponent<RouteComponentProps<query>, state>}
 * @template query 页面参数
 * @template state 页面状态
 */

export class PageGenerics<query, state> extends React.Component<PageProps<query>, state> {
    setStateMergeSetTimeout;
    /**
     * 用于合并多个setState
     * 
     * 
     * @memberOf PageGenerics
     */
    setStateMerge() {
        if (!this.setStateMergeSetTimeout) {
            this.setStateMergeSetTimeout = setTimeout(() => {
                this.setStateMergeSetTimeout = null;
                this.setState(this.state);
            }, 0);
        }
    }
}
export class Page extends PageGenerics<PageProps<any>, any> { }

/**
 * 原始的router的组件类
 * 
 * @export
 * @class PageComponent
 * @extends {PageComponentGenerics<any, any>}
 */
export class PageComponentGenerics<query, state> extends React.Component<RouteComponentProps<query>, state> { }
export class PageComponent extends PageComponentGenerics<any, any> { }
