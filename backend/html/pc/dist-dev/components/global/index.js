define("components/global/index.js",function(require, exports, module) {
"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
const React = require("react");
const ReactDOM = require("react-dom");
const react_router_1 = require("react-router");
const index_1 = require("../nav/index");
const components_1 = require("./components");
const superagent = require("superagent");
const value_1 = require("./value");
const index_2 = require("../privileges/index");
class Main extends components_1.PageComponentGenerics {
    constructor() {
        super(...arguments);
        this.state = {
            loading: 0,
            page: React.createElement("div", null),
            style: 'separate'
        };
    }
    asyncLoading() {
        this.state.loading = 0;
        let props = this.props;
        // 自动解析
        let url = props.route.path === '*' ? '../../pages' +
            props.location.pathname + '.js' : '../../pages/' + props.route.path + '.js';
        if (window.__md5Array) {
            let md5obj = window.__md5Array.find(value => value.path === url);
            if (md5obj) {
                url = md5obj.md5;
            }
        }
        console.log('加载：' + url);
        this.setState(this.state);
        value_1.default.url = props.location.pathname;
        value_1.default.query = props.location.query;
        value_1.default.jump = (url, data) => this.jump(url, data);
        value_1.default.goBack = () => props.router.goBack();
        setTimeout(() => this.setState({ loading: 1 }), 0);
        try {
            require.async(url, (mod) => {
                setTimeout(() => {
                    this.state.loading = 2;
                    let error = 404;
                    let haveP = index_2.havePrivileges(mod.privileges);
                    if (!haveP) {
                        error = 401;
                    }
                    if (mod && haveP) {
                        let Page = mod.default;
                        this.setPage(React.createElement(Page, __assign({}, this.getPageProps())), mod.style);
                    }
                    else {
                        require.async('../../pages/error/index.js', (mod) => {
                            this.setPage(React.createElement(mod.default, __assign({ status: 404 }, this.getPageProps())), mod.style);
                        });
                    }
                }, 0);
            });
        }
        catch (error) {
            console.log(error);
        }
    }
    /**
     * 获取页面参数
     *
     *
     * @memberOf Main
     */
    getPageProps() {
        let { props } = this;
        return {
            goBack: () => props.router.goBack(),
            jump: (url, data) => this.jump(url, data),
            url: props.location.pathname,
            query: props.location.query,
            _router: props
        };
    }
    jump(url, data) {
        let ajaxRequest = superagent.get(url);
        ajaxRequest.query(data);
        let query = ajaxRequest._query[0] || '';
        query = query ? '?' + query : '';
        this.props.router.push(url + query);
    }
    setPage(Page, style) {
        this.setState({
            page: Page,
            style: style
        });
    }
    shouldComponentUpdate(nextProps, nextState) {
        let oldLocation = this.props.location;
        let location = nextProps.location;
        if (oldLocation.pathname !== location.pathname
            || oldLocation.search !== location.search) {
            // if (oldLocation.pathname === location.pathname) {
            this.state.page = React.createElement("div", null);
            // }
            this.props = nextProps;
            this.state = nextState;
            this.asyncLoading();
            return false;
        }
        return true;
    }
    componentDidMount() {
        this.asyncLoading();
    }
    /**
     * 判断是否有token
     *
     *
     * @memberOf Main
     */
    componentWillMount() {
        let token = localStorage.getItem('token');
        if (!token) {
            this.props.router.push('/login/index');
        }
    }
    getLoadingClass() {
        switch (this.state.loading) {
            case 0:
                return '';
            case 1:
                return 'loading-box-loading';
            case 2:
                return 'loading-box-complete';
            case 3:
                return 'loading-box-complete';
        }
    }
    render() {
        let style = this.state.style;
        if (!style) {
            return React.createElement("div", { className: 'h100' },
                React.createElement(index_1.default, __assign({}, this.getPageProps())),
                React.createElement("div", { className: 'loading-box ' + this.getLoadingClass() },
                    React.createElement("div", { className: 'loading-box-inner' })),
                React.createElement("section", { className: 'main-content' },
                    React.createElement("section", { className: 'main-content-pr' }, this.state.page)));
        }
        else if (style === 'separate') {
            return React.createElement("div", { className: 'h100' },
                React.createElement("div", { className: 'loading-box ' + this.getLoadingClass() },
                    React.createElement("div", { className: 'loading-box-inner' })),
                this.state.page);
        }
    }
}
class AppRouter extends React.Component {
    render() {
        return (React.createElement(react_router_1.Router, { history: react_router_1.hashHistory },
            React.createElement(react_router_1.Redirect, { from: '/', to: '/device/device/index' }),
            React.createElement(react_router_1.Route, { path: '*', component: Main })));
    }
}
ReactDOM.render(React.createElement(AppRouter, null), document.getElementById('app'));
});
//# sourceMappingURL=index.js.map
