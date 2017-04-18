define("pages/device/device/_details.js",function(require, exports, module) {
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
const index_1 = require("../../../components/antd/index");
const react_router_1 = require("react-router");
const index_2 = require("../../../components/ajax/index");
const index_3 = require("../../../components/template-input/index");
const selectTree_1 = require("../selectTree/selectTree");
const index_4 = require("../../../components/privileges/index");
;
/**
 * 设备详情页面
 *
 * @class DeviceDrive
 * @extends {PureComponentGenerics<IDeviceDriveProps, IDeviceDriveState>}
 */
class DeviceDrive extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            data: {
                NSDevices: [],
                NSDevicesTemplate: {
                    Props: []
                }
            },
            tagList: [],
            treeVisible: false,
            tagModalVisible: false,
            selectTagList: [],
            treeSelectId: ''
        };
        this.deviceDataOperation = new index_3.DeviceDataOperation('NSDevices', this.props.id, this.state.data.NSDevices, this.state.data.NSDevicesTemplate.Props);
        this.treeType = 'region_tree';
        this.menu = React.createElement(index_1.Menu, { onClick: this.menuClick.bind(this) },
            React.createElement(index_1.Menu.Item, { key: 'addTag' }, "\u6DFB\u52A0\u6807\u7B7E"),
            React.createElement(index_1.Menu.Item, { key: 'move' }, "\u79FB\u52A8"),
            React.createElement(index_1.Menu.Item, { key: 'delete' }, "\u5220\u9664"));
        this.ignoreList = ['DeviceID', 'DeviceName'];
        this.treeTitle = '区域架构';
    }
    menuClick({ key }) {
        switch (key) {
            case 'delete':
                index_1.Modal.confirm({
                    title: '删除',
                    content: '确定删除?',
                    onOk: () => {
                        this.ajaxDelete();
                    }
                });
                break;
            case 'addTag':
                this.ajaxGetTag();
                this.state.tagModalVisible = true;
                this.setState(this.state);
                break;
            case 'move':
                this.state.treeVisible = true;
                this.setState(this.state);
                break;
            default:
                break;
        }
    }
    ajaxConcern(bl = true) {
        return __awaiter(this, void 0, void 0, function* () {
            let ajaxUrl = bl ? '/concern_device' : '/unconcern_device';
            if (bl) {
                yield index_2.post(ajaxUrl, {
                    deviceId: this.props.id
                });
            }
            else {
                yield index_2.post(ajaxUrl, {
                    deviceIds: [this.props.id]
                });
            }
            let msg = bl ? '关注成功！' : '取消关注成功！';
            this.componentWillMount();
            index_1.message.success(msg);
        });
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            let { data } = yield index_2.get('/device_detail', {
                deviceId: this.props.id,
                categroy: 'NSDevices'
            });
            data.NSDevices = index_3.objectToArray(data.NSDevices);
            this.state.data = data;
            this.deviceDataOperation = new index_3.DeviceDataOperation('NSDevices', this.props.id, this.state.data.NSDevices, this.state.data.NSDevicesTemplate.Props);
            this.setState(this.state);
        });
    }
    componentWillMount() {
        this.getData();
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.id !== nextProps.id) {
            this.props = nextProps;
            this.componentWillMount();
        }
    }
    getTemplate(value) {
        let { NSDevicesTemplate } = this.state.data;
        let { Props } = NSDevicesTemplate;
        return Props.find(data => data.Name === value.ParameterName);
    }
    /**
     * 是否显示
     *
     * @param {DevicesTemplate} template
     * @returns
     *
     * @memberOf DeviceDrive
     */
    isShow(template) {
        let show = true;
        if (!template) {
            show = false;
        }
        else {
            if (template.Visible === 'false') {
                show = false;
            }
            if (template.Form && template.Form.Type === 'Hidden') {
                show = false;
            }
            if (template.Name === 'Latitude') {
                show = false;
            }
        }
        return show;
    }
    /**
     * 根据模版找值
     *
     * @param {NSDevices} value
     * @returns
     *
     * @memberOf AddInformation
     */
    getValueByTemplate(template) {
        let { NSDevices } = this.state.data;
        return NSDevices.find(data => data.ParameterName === template.Name);
    }
    listRender() {
        return this.state.data.NSDevicesTemplate.Props.map((template, index) => {
            let value = this.getValueByTemplate(template);
            let bl = this.isShow(template);
            if (bl && this.ignoreList.indexOf(template.Name) === -1) {
                return React.createElement("tr", { key: index },
                    template.Name === 'Longitude' ?
                        React.createElement("th", null, "\u7ECF\u7EAC\u5EA6") :
                        React.createElement("th", null, template.Description),
                    React.createElement("td", null,
                        React.createElement(index_3.ParameterText, { data: value, template: template, dataList: this.state.data.NSDevices })));
            }
        });
    }
    /**
     * 获取值
     *
     * @param {string} key
     * @returns
     *
     * @memberOf DeviceDrive
     */
    getValue(key) {
        return this.deviceDataOperation.getValue(key);
    }
    /**
     * 更新值
     *
     * @param {string} key
     * @param {string} value
     *
     * @memberOf DeviceDrive
     */
    update(key, value) {
        return this.deviceDataOperation.update(key, value);
    }
    enableChange(bl = true) {
        this.update('Enable', bl.toString());
        this.ajaxUpdate();
    }
    topChange(bl) {
        this.update('Top', bl);
        this.ajaxUpdate();
    }
    ajaxUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(this.deviceDataOperation.getUpdate());
            let { data } = yield index_2.post('/modified_device', {
                deviceId: this.props.id,
                props: {
                    NSDevices: this.deviceDataOperation.getUpdate()
                }
            });
            this.props.onChange();
            // this.setState(this.state);
            index_1.message.success('修改成功！');
        });
    }
    ajaxDelete() {
        return __awaiter(this, void 0, void 0, function* () {
            yield index_2.post('/delete_device', {
                deviceIds: [this.props.id]
            });
            this.props.onChange();
            index_1.message.success('删除成功！');
        });
    }
    getRegionPath() {
        let str = '';
        if (!this.state.data.NSDevices.length) {
            return str;
        }
        let arr = this.state.data.NSDevices.find(value => value.ParameterName === 'RegionPath'
            || value.ParameterName === 'DepartmentPath')
            .ParameterValue[0].Path;
        arr.forEach(value => {
            str += value.Name + '-';
        });
        str = str.replace(/\-$/g, '');
        return str;
    }
    renderFooter() {
        let { props, state } = this;
        return React.createElement("section", { className: 'component-slip-footer' },
            (this.getValue('Top') === '0') || (this.getValue('Top') == null) ?
                React.createElement(index_1.Button, { onClick: () => this.topChange('1') }, "\u7F6E\u9876") :
                React.createElement(index_1.Button, { onClick: () => this.topChange('0') }, "\u53D6\u6D88\u7F6E\u9876"),
            React.createElement(index_4.default, { value: '/device/devices:modify' },
                React.createElement(react_router_1.Link, { to: {
                        pathname: '/device/device/update',
                        query: __assign({}, props.query, { DeviceID: props.id })
                    } },
                    React.createElement(index_1.Button, null, "\u4FEE\u6539"))),
            React.createElement(index_4.default, { value: '/device/devices:enable' }, this.getValue('Enable') === 'true' ?
                React.createElement(index_1.Button, { onClick: () => this.enableChange(false) }, "\u7981\u7528") :
                React.createElement(index_1.Button, { onClick: () => this.enableChange(true) }, "\u542F\u52A8")),
            React.createElement(index_1.Dropdown, { overlay: this.menu },
                React.createElement(index_1.Button, null, "\u66F4\u591A")));
    }
    renderTitle() {
        return React.createElement("h4", null,
            React.createElement("p", null, this.getValue('DeviceName')),
            React.createElement("p", null, this.getValue('DeviceID')));
    }
    tagListOnChange(e) {
        this.state.selectTagList = e;
    }
    ajaxGetTag() {
        return __awaiter(this, void 0, void 0, function* () {
            let { data } = yield index_2.get('/tag_list', {
                category: 'device',
                pageIndex: 1,
                pageSize: 10
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
    onTagOk() {
        return __awaiter(this, void 0, void 0, function* () {
            let { data } = yield index_2.post('/tag_device', {
                deviceIds: [this.props.id],
                tagNames: this.state.selectTagList
            });
            this.state.tagModalVisible = false;
            this.setState(this.state);
            index_1.message.success('添加成功！');
        });
    }
    renderTagList() {
        return React.createElement(index_1.Modal, { visible: this.state.tagModalVisible, title: '添加标签', onOk: this.onTagOk.bind(this), onCancel: () => {
                this.state.tagModalVisible = false;
                this.setState(this.state);
            } },
            React.createElement(index_1.CheckboxGroup, { options: this.state.tagList, onChange: this.tagListOnChange.bind(this) }));
    }
    onGetNode(obj) {
        this.state.treeSelectId = obj[0].id;
    }
    ajaxMoveDevice(idArray) {
        return __awaiter(this, void 0, void 0, function* () {
            yield index_2.post('/move_device', {
                deviceIds: idArray,
                newCompanyId: this.state.treeSelectId
            });
            this.state.treeVisible = false;
            index_1.message.success('移动成功！');
        });
    }
    onOkTree() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ajaxMoveDevice([this.props.id]);
            this.props.onChange();
        });
    }
    renderTree() {
        return React.createElement(index_1.Modal, { onOk: this.onOkTree.bind(this), visible: this.state.treeVisible, title: '移动', onCancel: () => {
                this.state.treeVisible = false;
                this.setState(this.state);
            } },
            React.createElement(selectTree_1.MyTreeSelect, { jurisdiction: 'only', onGetNode: this.onGetNode.bind(this), treeType: this.treeType }));
    }
    renderRegion() {
        if (!this.state.data.NSDevices.length) {
            return '';
        }
        let arr = this.state.data.NSDevices.find(value => value.ParameterName === 'RegionPath'
            || value.ParameterName === 'DepartmentPath')
            .ParameterValue[0].Path;
        let linkTo = arr[arr.length - 1].ID;
        return React.createElement("tr", null,
            React.createElement("th", null, this.treeTitle),
            React.createElement("td", null,
                React.createElement(react_router_1.Link, { to: '/device/device/index?regionId=' + linkTo }, this.getRegionPath())));
    }
    render() {
        let { props, state } = this;
        let { data } = state;
        let objConcerned = this.getValue('Concerned');
        return (React.createElement("section", { className: 'device-details' },
            objConcerned && (objConcerned === 'False' ?
                React.createElement(index_1.Button, { onClick: () => this.ajaxConcern(true), className: 'btn-position' }, "\u5173\u6CE8") :
                React.createElement(index_1.Button, { onClick: () => this.ajaxConcern(false), className: 'btn-position' }, "\u53D6\u6D88\u5173\u6CE8")),
            this.renderTitle(),
            React.createElement("table", { className: 'table-details' },
                React.createElement("tbody", null,
                    this.listRender(),
                    this.renderRegion())),
            this.renderFooter(),
            this.renderTagList(),
            this.renderTree()));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DeviceDrive;
// post('/new_tag', {
//     tagName: '核弹制造机'
// }); 
});
//# sourceMappingURL=_details.js.map
