define("pages/login/index.js",function(require, exports, module) {
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
const index_1 = require("../../components/validate/index");
const index_2 = require("../../components/antd/index");
const components_1 = require("../../components/global/components");
const index_3 = require("../../components/ajax/index");
require("./index.css");
class Component extends components_1.PageGenerics {
    constructor() {
        super(...arguments);
        this.states = {
            username: '',
            password: ''
        };
    }
    loginAjax() {
        return __awaiter(this, void 0, void 0, function* () {
            let json = index_3.post('/login', {
                username: this.states.username,
                password: this.states.password,
                token: '0'
            }).then((json) => {
                localStorage.setItem('token', json.data['token']);
                localStorage.setItem('userId', json.data['userId']);
                localStorage.setItem('userPrivileges', JSON.stringify(json.data['userPrivileges']));
                this.props.jump('/');
            });
        });
    }
    onChange(e) {
        let target = e.target;
        console.log(target.name);
        this.states[target.name] = target.value;
        console.log(target.value);
    }
    render() {
        return React.createElement("section", { className: 'page-login' },
            React.createElement("section", { className: 'page-login-content' },
                React.createElement("h2", null, "\u767B\u5F55"),
                React.createElement("table", null,
                    React.createElement("tbody", null,
                        React.createElement("tr", null,
                            React.createElement("td", null,
                                React.createElement(index_1.default, { required: true, onChange: this.onChange.bind(this), name: 'username' }))),
                        React.createElement("tr", null,
                            React.createElement("td", null,
                                React.createElement(index_1.default, { required: true, onChange: this.onChange.bind(this), name: 'password', type: 'password' }))),
                        React.createElement("tr", null,
                            React.createElement("td", null,
                                React.createElement(index_2.Button, { onClick: this.loginAjax.bind(this) }, "\u767B\u5F55")))))));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Component;
exports.style = 'separate';
});
//# sourceMappingURL=index.js.map
