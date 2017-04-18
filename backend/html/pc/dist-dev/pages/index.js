define("pages/index.js",function(require, exports, module) {
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
const index_1 = require("../device/index");
const index_2 = require("../../../components/ajax/index");
const _details_1 = require("../device/_details");
const index_3 = require("../../../components/template-input/index");
class Details extends _details_1.default {
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            let { data } = yield index_2.get('/member_detail', {
                memberId: this.props.id
            });
            this.state.data = data;
            this.deviceDataOperation = new index_3.DeviceDataOperation('NSDevices', this.props.id, this.state.data.NSDevices, this.state.data.NSDevicesTemplate.Props);
            this.setState(this.state);
        });
    }
}
class Com extends index_1.default {
    constructor() {
        super(...arguments);
        this.columns = [{
                title: '用户编号',
                dataIndex: 'UserID',
                key: '1'
            }, {
                title: '姓名',
                dataIndex: 'Name',
                key: '2'
            }, {
                title: '手机',
                dataIndex: 'Tel',
                key: '3'
            }, {
                title: '邮箱',
                dataIndex: 'Email',
                key: '4'
            }, {
                title: '微信',
                dataIndex: 'WeixinID',
                key: '5'
            }, {
                title: '上次登录时间',
                dataIndex: 'GpsTimeStamp',
                key: '6'
            }, {
                title: '启用/禁用',
                dataIndex: 'Enable',
                key: '7',
                render: this.columnsRender.bind(this)
            }];
        this.addUrl = '/device/members/add';
        this.title = '用户';
        this.ajaxGetUrl = '/member_list';
    }
    /**
     * 详情渲染
     *
     * @returns {JSX.Element}
     *
     * @memberOf Com
     */
    detailsRender() {
        let { state } = this;
        return React.createElement(Details, { id: this.state.detailsDataSource.UserID, onChange: () => this.getDataSource() });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Com;
;
;
});
//# sourceMappingURL=index.js.map
