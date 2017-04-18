define("pages/test/ajax/index.js",function(require, exports, module) {
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
const index_1 = require("../../../components/ajax/index");
const index_2 = require("../../../components/button/index");
const buttomModel_1 = require("../treeSelect/buttomModel");
const selectModal_1 = require("../../device/selectTree/selectModal");
/**
 * ajax demo
 *
 * @export
 * @class Component
 * @extends {React.Component<any, any>}
 */
class Component extends React.Component {
    constructor() {
        super(...arguments);
        /**
         * 状态保存log
         *
         *
         * @memberOf Component
         */
        this.state = {
            text: [],
            disabled: false,
            model: false
        };
    }
    /**
     * log输出
     *
     * @param {any} msg
     *
     * @memberOf Component
     */
    log(msg) {
        let textArr = Object.assign(this.state.text);
        textArr.push(msg);
        this.setState({
            text: textArr
        });
    }
    /**
     * 第一个按钮'/test_api'
     *
     *
     * @memberOf Component
     */
    getAjax() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('默认400毫秒只能调用一次');
            this.log('调用第一次');
            let res = index_1.post('/test_api').then(res => {
                this.log('调用第一次成功');
                this.log('-------');
            });
            this.log('调用第二次');
            index_1.post('/test_api').then(res => {
                this.log('调用第二次成功');
            });
        });
    }
    /**
     * 第二个按钮
     * 当按钮点击事件 返回的是 Promise 会有个loading
     * @returns
     *
     * @memberOf Component
     */
    getAjax1() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('缓存');
            this.log('调用第一次');
            let res = yield index_1.post({
                url: '/test_api',
                type: 1,
                data: { __request: 1 }
            });
            this.log('调用第一次成功');
            this.log('调用第二次');
            return index_1.post({
                url: '/test_api',
                type: 1,
                data: { __request: 1 }
            }).then(res => {
                this.log('调用第二次成功');
                this.log('-------');
            });
        });
    }
    /**
     * 第三个按钮
     * 当按钮点击事件 返回的是 Promise 会有个loading
     * @returns
     *
     * @memberOf Component
     */
    getAjax2() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('延迟提交 400ms 只提交最后一次ajax');
            this.log('调用第一次');
            let res = index_1.post({
                url: '/test_api',
                type: 2
            }).then(res => {
                this.log('调用第一次成功');
            });
            this.log('调用第二次');
            return index_1.post({
                url: '/test_api',
                type: 2
            }).then(res => {
                this.log('调用第二次成功');
                this.log('-------');
            });
        });
    }
    getAjax3() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('监听 assets/components/nav/index.tsx');
            let res = index_1.post({
                url: '/test_api',
                type: 3,
                callback: () => {
                    this.log('监听成功');
                    this.log('-------');
                }
            });
        });
    }
    getAjax4() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('取消监听 assets/components/nav/index.tsx');
            index_1.cancelAjaxRecord({
                url: '/test_api',
                type: 3
            });
            index_1.cancelAjaxRecord({
                url: '/test_api',
                type: 4
            });
        });
    }
    getAjax0() {
        return __awaiter(this, void 0, void 0, function* () {
            index_1.post({
                url: '/test_api',
                type: -1
            }).then(res => {
                this.log('调用成功');
                this.log('-------');
            });
        });
    }
    getAjax5() {
        return __awaiter(this, void 0, void 0, function* () {
            index_1.post({
                url: '/test_api',
                type: 4,
                callback: () => {
                    this.log('轮询一次');
                }
            }).then(res => {
                this.log('轮询调用成功');
                this.log('-------');
            });
        });
    }
    getAjax6() {
        return __awaiter(this, void 0, void 0, function* () {
            index_1.post({
                url: '/test_api',
                type: 4,
                callback: () => {
                    this.log('轮询2一次');
                }
            }).then(res => {
                this.log('轮询2调用成功');
                this.log('-------');
            });
        });
    }
    postAjax() {
        return __awaiter(this, void 0, void 0, function* () {
            index_1.post({
                url: 'data',
                data: { a: 1 },
                callback: (req) => {
                    console.log(req);
                }
            });
            index_1.post({
                url: 'data',
                data: { status: 3, comment: '登录过时' },
                callback: (req) => {
                    console.log(req);
                }
            });
            index_1.post({
                url: 'data',
                data: { status: 0, comment: '成功' },
                callback: (req) => {
                    console.log(req);
                }
            });
            index_1.post({
                url: 'data2',
                data: { a: 1 },
                callback: (req) => {
                    console.log(req);
                }
            });
        });
    }
    onclick() {
        let disabled = this.state.disabled ? false : true;
        this.setState({
            disabled: disabled
        });
    }
    /**
     * 渲染
     *
     * @returns
     *
     * @memberOf Component
     */
    myClick() {
        this.setState({
            model: true
        });
    }
    render() {
        return React.createElement("section", { className: 'page-home' },
            React.createElement("h2", null, "\u7B80\u5355\u4F8B\u5B5055"),
            React.createElement("div", null,
                React.createElement(index_2.default, { onClick: this.postAjax.bind(this) }, "code\u68C0\u67E5"),
                React.createElement(index_2.default, { onClick: this.getAjax0.bind(this) }, "\u666E\u901Aajax"),
                React.createElement(index_2.default, { onClick: this.getAjax.bind(this) }, "\u9650\u5236\u8FDE\u7EED\u89E6\u53D1"),
                React.createElement(index_2.default, { onClick: this.getAjax1.bind(this) }, "\u7F13\u5B58"),
                React.createElement(index_2.default, { onClick: this.getAjax2.bind(this) }, "\u5EF6\u8FDF\u63D0\u4EA4"),
                React.createElement(index_2.default, { onClick: this.getAjax3.bind(this) }, "\u76D1\u542C"),
                React.createElement(index_2.default, { onClick: this.getAjax5.bind(this) }, "\u8F6E\u8BE2"),
                React.createElement(index_2.default, { onClick: this.getAjax6.bind(this) }, "\u8F6E\u8BE22"),
                React.createElement(index_2.default, { onClick: this.getAjax4.bind(this) }, "\u53D6\u6D88\u76D1\u542C,\u8F6E\u8BE2")),
            this.state.text.map((value, index) => {
                return React.createElement("p", { key: index }, value);
            }),
            React.createElement(index_2.default, { onClick: this.myClick.bind(this) }, "my click"),
            React.createElement(buttomModel_1.ButtonModal, { title: '点击操作', treeType: 'region_tree', onGetNode: value => { console.log(value); }, value: [{ id: '58', name: '中国' }] }),
            React.createElement(selectModal_1.SelectModal, { onGetNode: value => { console.log(value); } }));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Component;
});
//# sourceMappingURL=index.js.map
