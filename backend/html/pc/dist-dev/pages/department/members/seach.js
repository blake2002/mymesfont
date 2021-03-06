define("pages/department/members/seach.js",function(require, exports, module) {
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
exports.React = React;
const index_1 = require("../../../components/antd/index");
const index_2 = require("../../../components/ajax/index");
const _main_1 = require("../../_main");
const index_3 = require("../../../components/util/index");
const value_1 = require("../../../components/global/value");
const seach_1 = require("../../device/members/seach");
class Com extends seach_1.default {
    constructor() {
        super(...arguments);
        this.title = '人员';
        this.listUrl = '/department/members/index';
    }
    ajaxSeach() {
        return __awaiter(this, void 0, void 0, function* () {
            let { data } = yield index_2.get({
                url: '/search_department_tree',
                data: {
                    keyword: index_3.trim(this.props.query.seach),
                    top: -1,
                    pageSize: this.state.pageSize,
                    pageIndex: this.props.query.seachCurrent || 1
                },
                type: 2
            });
            this.state.regionList = data.DepartmentList;
            this.state.deviceList = data.UserList;
            this.state.count = data.TotalCount;
            let count = data.DepartmentCount > data.UserCount ? data.DepartmentCount : data.UserCount;
            this.state.total = count;
            this.setState(this.state);
            return data;
        });
    }
    render() {
        let { state, props } = this;
        return React.createElement("section", { className: 'h100 page-device-seach' },
            React.createElement(_main_1.MainLeft, { type: 'member' },
                React.createElement("div", { className: 'center-box' },
                    "\u5DF2\u4E3A\u60A8\u641C\u7D22\u5230",
                    React.createElement("span", { className: 'blue' }, this.state.count),
                    "\u4E2A\u7ED3\u679C")),
            React.createElement("section", { className: 'main-right' },
                React.createElement("section", { className: 'main-right-tabs' },
                    React.createElement("div", { className: 'main-right-tabs-left ml20 mr20' },
                        React.createElement(index_1.Button, { onClick: () => {
                                delete this.props.query.seach;
                                value_1.default.jump(this.returnUrl, this.props.query);
                            } }, " \u8FD4\u56DE")),
                    React.createElement(index_1.Tabs, { activeKey: '1', type: 'card' },
                        React.createElement(index_1.TabPane, { tab: this.title + '搜索', key: '1' }))),
                React.createElement("section", { className: 'main-right-content' },
                    React.createElement("section", { className: 'main-right-content-box' },
                        React.createElement("section", { className: 'seach-box' },
                            React.createElement("section", { className: 'region-box' },
                                React.createElement("dl", { className: 'seach-dl' },
                                    React.createElement("dt", null, "\u533A\u57DF\u8282\u70B9"),
                                    state.regionList.map((value, index) => {
                                        return React.createElement("dd", { key: index, onClick: () => this.onRegionClick(value) },
                                            this.getPathString(value.Path),
                                            this.renderBlue(value.Name));
                                    }))),
                            React.createElement("section", { className: 'device-box' },
                                React.createElement("dl", { className: 'seach-dl' },
                                    React.createElement("dt", null, this.title),
                                    state.deviceList.map((value, index) => {
                                        return React.createElement("dd", { key: index, onClick: () => this.onDeviceClick(value) },
                                            React.createElement("span", { className: 'td-span' }, this.renderBlue(value['UserID'])),
                                            React.createElement("span", { className: 'td-span' }, this.renderBlue(value['Name'])));
                                    })))),
                        React.createElement(index_1.Pagination, { className: 'mt20', current: parseInt(props.query.seachCurrent || '1', null), total: state.total, pageSize: state.pageSize, onChange: this.onPaginationChange.bind(this) })))));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Com;
});
//# sourceMappingURL=seach.js.map
