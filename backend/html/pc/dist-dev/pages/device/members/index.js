define("pages/device/members/index.js",function(require, exports, module) {
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
const index_4 = require("../../../components/antd/index");
const _main_1 = require("../../_main");
const _variable_1 = require("../../device/device/add/_variable");
const selectTree_1 = require("../selectTree/selectTree");
const index_5 = require("../../../components/privileges/index");
exports.privileges = '/device/members';
class Com extends index_1.default {
    constructor() {
        super(...arguments);
        this.columns = [{
                width: '150px',
                title: '人员编号',
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
            }];
        this.ajaxLableGetUrl = '/tag_member_list';
        this.addUrl = '/device/members/add';
        this.title = '人员';
        this.ajaxGetUrl = '/member_list';
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
    ajaxCount() {
        return __awaiter(this, void 0, void 0, function* () {
            let regionId = yield this.getRegionId();
            let { data } = yield index_2.get('/member_count', {
                regionId: regionId
            });
            this.state.count = data;
            this.setStateMerge();
            return data;
        });
    }
    ajaxGetDetail() {
        return __awaiter(this, void 0, void 0, function* () {
            let { data } = yield index_2.get('/member_detail', {
                memberId: this.props.query.Id
            });
            let Path = data.NSUsers.RegionPath[0].Path;
            this.state.regionId = Path[Path.length - 1].ID;
            return {
                pageCount: 1,
                pageIndex: 1,
                pageList: [data.NSUsers]
            };
        });
    }
    /**
     * 根据选中删除
     *
     * @param {any[]} value
     *
     * @memberOf Device
     */
    ajaxDelete(value) {
        return __awaiter(this, void 0, void 0, function* () {
            let arr = value.map(value => value.UserID);
            yield index_2.post('/member_belongs', {
                operate: 'remove',
                regionId: this.props.query.regionId,
                memberIds: arr
            });
            this.modalSlipVisible(false);
            this.componentDidMount();
            index_4.message.success('删除成功！');
        });
    }
    menuRender() {
        let { state } = this;
        return React.createElement(index_4.Menu, { onClick: this.onMenuClick.bind(this) },
            React.createElement(index_4.Menu.Item, { key: 'all' },
                "\u5168\u90E8",
                this.title,
                "\uFF08",
                state.count.all,
                "\uFF09"),
            React.createElement(index_4.Menu.Item, { key: 'concerned' },
                "\u5DF2\u5173\u6CE8\uFF08",
                state.count.concerned,
                "\uFF09"));
    }
    /**
     * 选择框渲染
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
                React.createElement(index_4.Button, { privileges: '/device/members:move' }, "\u79FB\u52A8"),
                React.createElement(index_4.Button, { privileges: '/device/members:remove', onClick: () => this.onDelete(this.state.selectedRows) }, "\u79FB\u9664")));
    }
    ajaxAdd(idArray) {
        return __awaiter(this, void 0, void 0, function* () {
            yield index_2.post('/member_belongs', {
                operate: 'append',
                regionId: this.props.query.regionId,
                memberIds: idArray
            });
            index_4.message.success('添加成功！');
            this.componentDidMount();
        });
    }
    onOk(data) {
        this.ajaxAdd(data.map(value => value['UserID']));
    }
    titleAddRender() {
        let { state } = this;
        return state.regionType !== 'NSPlanets' &&
            (React.createElement("span", null,
                React.createElement(index_5.default, { value: '/device/members:add' },
                    React.createElement("a", { onClick: () => {
                            this.refs['SelectVar'].modalShow(true);
                        } },
                        "\u9009\u62E9",
                        this.title)),
                React.createElement(_variable_1.SelectMember, { ref: 'SelectVar', onOk: this.onOk.bind(this) })));
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
        return React.createElement(MemberDetails, { regionId: this.state.regionId, id: this.state.detailsDataSource.UserID, query: this.props.query, onChange: () => this.getDataSource() });
    }
    renderMainLeft() {
        return React.createElement(_main_1.MainLeft, { LabelType: 'user', type: 'relationMember', treeType: this.treeType, regionId: this.state.regionId, ref: 'tree' });
    }
    renderTree() {
        return React.createElement(index_4.Modal, { onOk: this.onOkTree.bind(this), visible: this.state.treeVisible, title: '移动', onCancel: () => {
                this.state.treeVisible = false;
                this.setState(this.state);
            } },
            React.createElement(selectTree_1.MyTreeSelect, { jurisdiction: 'part', onGetNode: this.onGetNode.bind(this), treeType: this.treeType }));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Com;
class MemberDetails extends _details_1.default {
    constructor() {
        super(...arguments);
        this.ignoreList = ['Name', 'UserID'];
    }
    renderTree() {
        return React.createElement(index_4.Modal, { onOk: this.onOkTree.bind(this), visible: this.state.treeVisible, title: '移动', onCancel: () => {
                this.state.treeVisible = false;
                this.setState(this.state);
            } },
            React.createElement(selectTree_1.MyTreeSelect, { jurisdiction: 'part', onGetNode: this.onGetNode.bind(this), treeType: this.treeType }));
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            let { data } = yield index_2.get('/member_detail', {
                memberId: this.props.id
            });
            data.NSUsers = index_3.objectToArray(data.NSUsers);
            this.state.data.NSDevices = data.NSUsers;
            this.state.data.NSDevicesTemplate = data.NSUsersTemplate;
            this.deviceDataOperation = new index_3.DeviceDataOperation('NSDevices', this.props.id, this.state.data.NSDevices, this.state.data.NSDevicesTemplate.Props);
            this.setState(this.state);
        });
    }
    ajaxUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            let { data } = yield index_2.post('/top_member', {
                memberId: this.props.id,
                props: {
                    NSUsers: this.deviceDataOperation.getUpdate()
                }
            });
            this.props.onChange();
            index_4.message.success('修改成功！');
        });
    }
    onTagOk() {
        return __awaiter(this, void 0, void 0, function* () {
            yield index_2.post('/tag_member', {
                memberIds: [this.props.id],
                tagNames: this.state.selectTagList
            });
            this.state.tagModalVisible = false;
            this.setState(this.state);
            index_4.message.success('添加成功！');
        });
    }
    ajaxConcern(bl = true) {
        return __awaiter(this, void 0, void 0, function* () {
            let ajaxUrl = bl ? '/concern_member' : '/unconcern_member';
            if (bl) {
                yield index_2.post(ajaxUrl, {
                    memberId: this.props.id
                });
            }
            else {
                yield index_2.post(ajaxUrl, {
                    memberIds: [this.props.id]
                });
            }
            let msg = bl ? '关注成功！' : '取消关注成功！';
            this.componentWillMount();
            index_4.message.success(msg);
        });
    }
    ajaxMoveDevice(idArray) {
        return __awaiter(this, void 0, void 0, function* () {
            yield index_2.post('/member_belongs', {
                operate: 'append',
                memberIds: idArray,
                regionId: this.state.treeSelectId
            });
            yield index_2.post('/member_belongs', {
                operate: 'remove',
                memberIds: idArray,
                regionId: this.props.regionId
            });
            this.props.onChange();
            index_4.message.success('移动成功！');
        });
    }
    ajaxGetTag() {
        return __awaiter(this, void 0, void 0, function* () {
            let { data } = yield index_2.get('/tag_list', {
                category: 'user'
            });
            this.state.tagList = [];
            data.TagList.forEach(value => {
                this.state.tagList.push({
                    label: value['Name'],
                    value: value['Name']
                });
            });
            this.setState(this.state);
        });
    }
    renderTitle() {
        return React.createElement("h4", null,
            React.createElement("p", null, this.getValue('Name')),
            React.createElement("p", null, this.getValue('UserID')));
    }
    renderFooter() {
        let { props, state } = this;
        return React.createElement("section", { className: 'component-slip-footer' },
            (this.getValue('Top') === '1') || (this.getValue('Top') == null) ?
                React.createElement(index_4.Button, { onClick: () => this.topChange('1') }, "\u7F6E\u9876") :
                React.createElement(index_4.Button, { onClick: () => this.topChange('0') }, "\u53D6\u6D88\u7F6E\u9876"),
            React.createElement(index_4.Dropdown, { overlay: this.menu },
                React.createElement(index_4.Button, null, "\u66F4\u591A")));
    }
}
exports.MemberDetails = MemberDetails;
});
//# sourceMappingURL=index.js.map
