define("pages/department/members/index.js",function(require, exports, module) {
"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const React = require("react");
const index_1 = require("../../device/device/index");
const index_2 = require("../../../components/ajax/index");
const _details_1 = require("../../device/device/_details");
const index_3 = require("../../../components/template-input/index");
const index_4 = require("../../../components/antd/index");
const react_router_1 = require("react-router");
const _main_1 = require("../../_main");
const _variable_1 = require("../../device/device/add/_variable");
const index_5 = require("../../../components/privileges/index");
exports.privileges = '/department/users';
class Details extends _details_1.default {
    constructor() {
        super(...arguments);
        this.treeTitle = '组织架构';
        this.ignoreList = ['Name', 'UserID'];
        this.treeType = 'department_tree';
        this.menu = React.createElement(index_4.Menu, { onClick: this.menuClick.bind(this) },
            index_5.havePrivileges('/department/users:move') &&
                React.createElement(index_4.Menu.Item, { key: 'move' }, "\u79FB\u52A8"),
            index_5.havePrivileges('/department/users:delete') &&
                React.createElement(index_4.Menu.Item, { key: 'delete' }, "\u5220\u9664"));
    }
    renderTitle() {
        return React.createElement("h4", null,
            React.createElement("p", null, this.getValue('Name')),
            React.createElement("p", null, this.getValue('UserID')));
    }
    renderRegion() {
        return '';
    }
    ajaxMoveDevice(idArray) {
        return __awaiter(this, void 0, void 0, function* () {
            yield index_2.post('/user_belongs', {
                operate: 'append',
                deptUserIds: idArray,
                departmentId: this.state.treeSelectId
            });
            yield index_2.post('/user_belongs', {
                operate: 'remove',
                deptUserIds: idArray,
                departmentId: this.props.regionId
            });
            this.props.onChange();
            index_4.message.success('移动成功！');
        });
    }
    ajaxDelete() {
        return __awaiter(this, void 0, void 0, function* () {
            yield index_2.post('/delete_user', {
                deptUserIds: [this.props.id]
            });
            this.props.onChange();
            index_4.message.success('删除成功！');
        });
    }
    ajaxUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            let { data } = yield index_2.post('/modified_user', {
                deptUserId: this.props.id,
                props: {
                    NSUsers: this.deviceDataOperation.getUpdate()
                }
            });
            this.props.onChange();
            index_4.message.success('修改成功！');
        });
    }
    renderFooter() {
        let { props, state } = this;
        return React.createElement("section", { className: 'component-slip-footer' },
            (this.getValue('Top') === '0') || (this.getValue('Top') == null) ?
                React.createElement(index_4.Button, { onClick: () => this.topChange('1') }, "\u7F6E\u9876") :
                React.createElement(index_4.Button, { onClick: () => this.topChange('0') }, "\u53D6\u6D88\u7F6E\u9876"),
            React.createElement(index_5.default, { value: '/department/users:modify' },
                React.createElement(react_router_1.Link, { to: {
                        pathname: '/department/members/update',
                        query: __assign({}, props.query, { deptUserId: props.id })
                    } },
                    React.createElement(index_4.Button, null, "\u4FEE\u6539"))),
            this.getValue('Enable') === 'true' ?
                React.createElement(index_4.Button, { privileges: '/department/users:enable', onClick: () => this.enableChange(false) }, "\u7981\u7528") :
                React.createElement(index_4.Button, { privileges: '/department/users:enable', onClick: () => this.enableChange(true) }, "\u542F\u52A8"),
            React.createElement(index_4.Dropdown, { overlay: this.menu },
                React.createElement(index_4.Button, null, "\u66F4\u591A")));
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            let { data } = yield index_2.get('/user_detail', {
                deptUserId: this.props.id
            });
            data.NSUsers = index_3.objectToArray(data.NSUsers);
            this.state.data.NSDevices = data.NSUsers;
            this.state.data.NSDevicesTemplate = data.NSUsersTemplate;
            this.deviceDataOperation = new index_3.DeviceDataOperation('NSDevices', this.props.id, this.state.data.NSDevices, this.state.data.NSDevicesTemplate.Props);
            this.setState(this.state);
        });
    }
}
class Com extends index_1.default {
    constructor() {
        super(...arguments);
        this.columns = [{
                width: '150px',
                title: '用户编号',
                dataIndex: 'UserID',
                key: '1'
            }, {
                width: '150px',
                title: '姓名',
                dataIndex: 'Name',
                key: '2'
            }, {
                width: '200px',
                title: '手机',
                dataIndex: 'Tel',
                key: '3'
            }, {
                width: '200px',
                title: '邮箱',
                dataIndex: 'Email',
                key: '4'
            }, {
                width: '200px',
                title: '微信',
                dataIndex: 'WeixinID',
                key: '5'
            }, {
                title: '上次登录时间',
                dataIndex: 'GpsTimeStamp',
                key: '6'
            }, {
                width: '100px',
                title: '启用/禁用',
                dataIndex: 'Enable',
                key: '7',
                render: this.columnsRender.bind(this)
            }];
        this.addUrl = '/department/members/add';
        this.title = '人员';
        this.ajaxGetUrl = '/user_list';
        this.treeType = 'department_tree';
    }
    ajaxGet() {
        return __awaiter(this, void 0, void 0, function* () {
            let { props } = this;
            let regionId = yield this.getRegionId();
            let { data } = yield index_2.get(this.ajaxGetUrl, Object.assign({
                departmentId: regionId,
                pageIndex: props.query.current || 1,
                pageSize: this.state.pageSize,
                cateFilter: props.query.cateFilter || 'all'
            }, {}));
            return data;
        });
    }
    titleRender() {
        let { state } = this;
        let titleText = `全部${this.title}(${state.count.all})`;
        if (this.props.query.cateFilter === 'concerned') {
            titleText = `已关注(${state.count.concerned})`;
        }
        if (this.props.query.cateFilter === 'disabled') {
            titleText = `禁用(${state.count.disabled})`;
        }
        return React.createElement(_main_1.MainRightTitle, { title: this.state.title, text: titleText, menu: this.menuRender() }, this.titleAddRender());
    }
    onOk(data) {
        this.ajaxAdd(data.map(value => value['UserID']));
    }
    ajaxAdd(idArray) {
        return __awaiter(this, void 0, void 0, function* () {
            yield index_2.post('/user_belongs', {
                operate: 'append',
                departmentId: this.props.query.regionId,
                deptUserIds: idArray
            });
            index_4.message.success('添加成功！');
            this.componentDidMount();
        });
    }
    ajaxCount() {
        return __awaiter(this, void 0, void 0, function* () {
            let regionId = yield this.getRegionId();
            let { data } = yield index_2.get('/user_count', {
                departmentId: regionId
            });
            this.state.count = data;
            this.setStateMerge();
            return data;
        });
    }
    ajaxGetDetail() {
        return __awaiter(this, void 0, void 0, function* () {
            let { data } = yield index_2.get('/user_detail', {
                deptUserId: this.props.query.Id
            });
            let Path = [];
            if (data.NSUsers.DepartmentPath) {
                Path = data.NSUsers.DepartmentPath[0].Path;
            }
            else {
                Path = data.NSUsers.Organization[0].Path;
            }
            this.state.regionId = Path[Path.length - 1].ID;
            return {
                pageCount: 1,
                pageIndex: 1,
                pageList: [data.NSUsers]
            };
        });
    }
    titleAddRender() {
        let { state } = this;
        this.props.query.regionId = this.state.regionId;
        if (!this.props.query.Id) {
            return React.createElement("span", null,
                React.createElement(index_5.default, { value: '/department/users:add' },
                    React.createElement("a", { onClick: () => {
                            this.refs['SelectVar'].modalShow(true);
                        } },
                        "\u9009\u62E9",
                        this.title)),
                React.createElement(_variable_1.SelectMember, { ref: 'SelectVar', onOk: this.onOk.bind(this) }),
                React.createElement(index_5.default, { value: '/department/users/add' },
                    React.createElement(react_router_1.Link, { className: 'ml10', to: {
                            pathname: this.addUrl,
                            query: this.props.query
                        } },
                        "\u65B0\u589E",
                        this.title)));
        }
    }
    ajaxUpdate(value, key) {
        return __awaiter(this, void 0, void 0, function* () {
            let dataProps = [];
            if (key) {
                dataProps.push({
                    'ParameterName': key,
                    'ParameterValue': value[key]
                });
            }
            yield index_2.post('/modified_user', {
                deptUserId: value.key,
                props: {
                    NSUsers: dataProps
                }
            });
            index_4.message.success('修改成功！');
        });
    }
    /**
     * 导航渲染
     *
     *
     * @memberOf Device
     */
    navRender() {
        return React.createElement(index_4.Tabs, { type: 'card' },
            React.createElement(index_4.TabPane, { tab: '人员管理', key: '人员管理' }));
    }
    /**
     * 根据选中删除
     *
     * @param {any[]} value
     *
     * @memberOf Com
     */
    ajaxDelete(value) {
        return __awaiter(this, void 0, void 0, function* () {
            let arr = value.map(value => value.UserID);
            yield index_2.post('/delete_user', {
                deptUserIds: arr
            });
            this.modalSlipVisible(false);
            this.componentDidMount();
            index_4.message.success('删除成功！');
        });
    }
    /**
     * 删除渲染
     *
     * @returns
     *
     * @memberOf Com
     */
    selectRender() {
        return React.createElement("section", null,
            React.createElement("ul", { className: 'ul-details' }, this.state.selectedRows.map((value, index) => {
                return React.createElement("li", { key: index + 1 }, value['UserID'] + ' ' + value['Name']);
            })),
            React.createElement("section", { className: 'component-slip-footer' },
                React.createElement(index_4.Button, { privileges: '/department/users:move', onClick: () => {
                        this.state.treeVisible = true;
                        this.setState(this.state);
                    } }, "\u79FB\u52A8"),
                React.createElement(index_4.Button, { privileges: '/department/users:delete', onClick: () => this.onDelete(this.state.selectedRows) }, "\u5220\u9664")));
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
        return React.createElement(Details, { id: this.state.detailsDataSource.UserID, regionId: this.state.regionId, query: this.props.query, onChange: () => this.getDataSource() });
    }
    renderMainLeft() {
        return React.createElement(_main_1.MainLeft, { type: 'member', treeType: this.treeType, regionId: this.state.regionId, ref: 'tree' });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Com;
;
;
});
//# sourceMappingURL=index.js.map
