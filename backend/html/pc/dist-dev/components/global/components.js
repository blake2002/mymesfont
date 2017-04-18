define("components/global/components.js",function(require, exports, module) {
"use strict";
const React = require("react");
exports.React = React;
/**
 * PureComponent
 *
 * @export
 * @class PureComponentGenerics
 * @extends {React.PureComponent<props, state>}
 * @template props
 * @template state
 */
class PureComponentGenerics extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = Object.assign({}, this.states);
    }
}
exports.PureComponentGenerics = PureComponentGenerics;
class PureComponent extends PureComponentGenerics {
}
exports.PureComponent = PureComponent;
/**
 * Component
 *
 * @export
 * @class Component
 * @extends {React.Component<any, any>}
 */
class Component extends React.Component {
}
exports.Component = Component;
/**
 *  页面 模版组件
 *
 * @export
 * @class PageComponent
 * @extends {React.PureComponent<RouteComponentProps<query>, state>}
 * @template query 页面参数
 * @template state 页面状态
 */
class PageGenerics extends React.Component {
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
exports.PageGenerics = PageGenerics;
class Page extends PageGenerics {
}
exports.Page = Page;
/**
 * 原始的router的组件类
 *
 * @export
 * @class PageComponent
 * @extends {PageComponentGenerics<any, any>}
 */
class PageComponentGenerics extends React.Component {
}
exports.PageComponentGenerics = PageComponentGenerics;
class PageComponent extends PageComponentGenerics {
}
exports.PageComponent = PageComponent;
});
//# sourceMappingURL=components.js.map
