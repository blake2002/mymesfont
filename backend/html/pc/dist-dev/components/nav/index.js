define("components/nav/index.js",function(require, exports, module) {
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const React = require("react");
const react_router_1 = require("react-router");
const index_1 = require("../ajax/index");
const components_1 = require("../global/components");
const index_2 = require("../privileges/index");
class Component extends components_1.PageGenerics {
    constructor() {
        super(...arguments);
        this.states = {
            unread: 0
        };
    }
    msgInit() {
        return __awaiter(this, void 0, void 0, function* () {
            // get({
            //     url: 'http://192.167.8.34:8020/mes_app/events',
            //     type: 4,
            //     callback: (data: {
            //         unread: string
            //     }) => {
            //         this.setState({
            //             unread: data.unread
            //         });
            //     }
            // }).then(res => {
            //     console.log('消息数量监视开始');
            // });
        });
    }
    componentDidMount() {
        this.msgInit();
    }
    signOut() {
        return __awaiter(this, void 0, void 0, function* () {
            let json = yield index_1.post('/logout');
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            this.props.jump('/login/index');
            console.log(json);
        });
    }
    getLink(to, active, text) {
        let url = this.props.url;
        return React.createElement(react_router_1.Link, { to: to, className: url.indexOf(active) === 0 ? 'active' : '' }, text);
    }
    render() {
        return React.createElement("nav", { className: 'nav' },
            React.createElement(index_2.default, { value: '/device' }, this.getLink('/device/device/index', '/device', '设备管理')),
            this.getLink('/department/members/index', '/department', '组织架构'),
            this.getLink('/model/system/index', '/model', '模型管理'),
            this.getLink('/report/system/index', '/report', '报表管理'),
            this.getLink('/system/systemMenuManager/index', '/system', '系统设置'),
            React.createElement("section", { className: 'nav-right' },
                localStorage.getItem('userId'),
                React.createElement("a", { onClick: this.signOut.bind(this) }, "\u9000\u51FA")));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Component;
});
//# sourceMappingURL=index.js.map
