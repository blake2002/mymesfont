define("pages/device/device/seach.js",function(require, exports, module) {
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
const components_1 = require("../../../components/global/components");
const index_1 = require("../../../components/antd/index");
const index_2 = require("../../../components/ajax/index");
const _main_1 = require("../../_main");
const index_3 = require("../../../components/util/index");
const value_1 = require("../../../components/global/value");
require("./seach.css");
;
/**
 * 设备搜索
 *
 * @export
 * @class DeviceSeach
 * @extends {PageGenerics<IDeviceAddProps, any>}
 */
class DeviceSeach extends components_1.PageGenerics {
    constructor() {
        super(...arguments);
        this.key = 'DeviceList';
        this.title = '设备';
        this.returnUrl = '/device/device/index';
        this.state = {
            total: 0,
            pageSize: 10,
            count: 0,
            regionList: [],
            deviceList: []
        };
        this.listUrl = '/device/device/index';
    }
    ajaxSeach() {
        return __awaiter(this, void 0, void 0, function* () {
            let { data } = yield index_2.get({
                url: '/search_region_tree',
                data: {
                    searchTarget: 'device',
                    keyword: index_3.trim(this.props.query.seach),
                    top: -1,
                    pageSize: this.state.pageSize,
                    pageIndex: this.props.query.seachCurrent || 1
                },
                type: 2
            });
            this.state.regionList = data.RegionList;
            this.state.deviceList = data.DeviceList;
            this.state.count = data.TotalCount;
            let count = data.RegionCount > data.DeviceCount ? data.RegionCount : data.DeviceCount;
            this.state.total = count;
            this.setState(this.state);
            return data;
        });
    }
    renderBlue(text) {
        let str = text.replace(new RegExp(this.props.query.seach, 'g'), `<span className="blue">${this.props.query.seach}</span>`);
        return React.createElement("span", { dangerouslySetInnerHTML: { __html: str } });
    }
    getPathString(arr) {
        let str = '';
        arr.forEach(value => str += (value.Name + '-'));
        str.replace(/\-&/g, '');
        return str;
    }
    onPaginationChange(index) {
        this.props.query.seachCurrent = index;
        value_1.default.jump(value_1.default.url, this.props.query);
    }
    onDeviceClick(obj) {
        value_1.default.jump(this.listUrl, {
            Id: obj.DeviceID || obj.UserID
        });
    }
    onRegionClick(obj) {
        value_1.default.jump(this.listUrl, {
            regionId: obj.ID
        });
    }
    render() {
        let { state, props } = this;
        return React.createElement("section", { className: 'h100 page-device-seach' },
            React.createElement(_main_1.MainLeft, null,
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
                                            React.createElement("span", { className: 'td-span' }, this.renderBlue(value.DeviceID)),
                                            React.createElement("span", { className: 'td-span' }, this.renderBlue(value.DeviceName)),
                                            React.createElement("span", { className: 'td-span' }, value.DeviceType));
                                    })))),
                        React.createElement(index_1.Pagination, { className: 'mt20', current: parseInt(props.query.seachCurrent || '1', null), total: state.total, pageSize: state.pageSize, onChange: this.onPaginationChange.bind(this) })))));
    }
    /**
     * 组件渲染完毕获取ajax数据
     *
     *
     * @memberOf Device
     */
    componentDidMount() {
        this.ajaxSeach();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DeviceSeach;
});
//# sourceMappingURL=seach.js.map
