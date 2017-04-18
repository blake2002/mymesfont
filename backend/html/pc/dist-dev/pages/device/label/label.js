define("pages/device/label/label.js",function(require, exports, module) {
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
const index_1 = require("../../../components/antd/index");
const index_2 = require("../../../components/ajax/index");
require("./label.css");
let tagName; // 修改标签时记录原标签
let TagListData; // 记录标签数据
let listDataFlag = false;
class Label extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            gData: [],
            visible: false,
            selectedIndex: 0
        };
    }
    getTagList() {
        return __awaiter(this, void 0, void 0, function* () {
            let json = yield index_2.get('/tag_list', {
                category: this.props.type // user-用户， device-设备
            });
            return json;
        });
    }
    postNewTag(tagName) {
        return __awaiter(this, void 0, void 0, function* () {
            let json = yield index_2.post('/new_tag', {
                tagName: tagName // 标签名称
            });
            return json;
        });
    }
    postModifiedTag(parameter) {
        return __awaiter(this, void 0, void 0, function* () {
            let json = yield index_2.post('/modified_tag', {
                tagName: parameter.tagName,
                newTagName: parameter.newTagName // 新标签名称
            });
            return json;
        });
    }
    postDeleteTag(tagName) {
        return __awaiter(this, void 0, void 0, function* () {
            let json = yield index_2.post('/delete_tag', {
                tagName: tagName
            });
            return json;
        });
    }
    componentWillMount() {
        if (listDataFlag) {
            let selectedIndex = 0;
            TagListData.find((item, index) => {
                selectedIndex = index;
                return item.name === this.props.selectedName;
            });
            this.setState({
                gData: TagListData,
                selectedIndex
            });
            return;
        }
        this.getTagList().then(value => {
            listDataFlag = true;
            let data = [];
            let selectedIndex = 0;
            value.data.TagList.forEach((item, index) => {
                let obj = {
                    name: item.Name,
                    total: item.Count
                };
                data.push(obj);
                if (item.Name === this.props.selectedName) {
                    selectedIndex = index;
                }
            });
            TagListData = data;
            this.setState({
                gData: data,
                selectedIndex
            });
        });
    }
    componentWillReceiveProps(nextProps) {
        // console.log(nextProps);
        // if (nextProps.selectedName) {
        //     let data = [...this.state.gData];
        //     let selectedIndex = 0;
        //     data.find((item, index) => {
        //         selectedIndex = index;
        //         return item.name === nextProps.selectedName;
        //     })
        //     this.setState({
        //         selectedIndex: selectedIndex
        //     })
        // }
    }
    handleMenuClick(e) {
        let data = [...this.state.gData];
        if (e.key === '0') {
            let labelItem = data.find(item => {
                tagName = item.name; // 记录修改之前的标签名
                return item.name === e.item.props.name;
            });
            labelItem.input = 'input';
            this.setState({
                gData: data
            }, () => {
                this.refs['myInput'].focus();
            });
        }
        else if (e.key === '1') {
            this.postDeleteTag(e.item.props.name).then(val => {
                this.findItem(data, e.item.props.name);
                TagListData = data;
                this.setState({
                    gData: data
                });
            });
        }
    }
    findItem(data, name) {
        data.find((item, index, arr) => {
            if (item.name === name) {
                arr.splice(index, 1);
            }
        });
    }
    meueRender(name) {
        return React.createElement(index_1.Menu, { onClick: this.handleMenuClick.bind(this) },
            React.createElement(index_1.Menu.Item, { key: '0', name: name }, "\u7F16\u8F91"),
            React.createElement(index_1.Menu.Item, { key: '1', name: name }, "\u5220\u9664"));
    }
    dropDown(name) {
        return name !== '已关注' && React.createElement("span", { onClick: this.stopClick, style: { marginRight: '0px' } },
            React.createElement(index_1.Dropdown, { overlay: this.meueRender(name), trigger: ['click'] },
                React.createElement(index_1.Icon, { className: 'treeIcon', type: 'ellipsis', style: { position: 'static' } })));
    }
    stopClick(e) {
        e.stopPropagation();
    }
    onClick() {
        this.setState({
            visible: true
        }, () => {
            this.refs['myrefs'].focus();
        });
    }
    inputDom() {
        return this.state.visible && React.createElement(index_1.Input, { onBlur: this.inputBlur.bind(this), ref: 'myrefs' });
    }
    inputBlur(e) {
        let name = e.target.value;
        this.postNewTag(e.target.value).then(val => {
            let data = [...this.state.gData];
            data.push({
                name: name,
                total: 0
            });
            TagListData = data;
            this.setState({
                gData: data,
                visible: false
            });
        });
    }
    onClickLabel(index, item) {
        if (this.props.onLabelClick) {
            this.props.onLabelClick(item);
        }
        // this.setState({
        //     selectedIndex: index
        // });
    }
    blurLabelName(e) {
        let name = e.target.value;
        let parameter = {
            tagName: tagName,
            newTagName: name
        };
        this.postModifiedTag(parameter).then(val => {
            let data = [...this.state.gData];
            let labelItem = data.find(item => {
                return item.name === name;
            });
            delete labelItem.input;
            TagListData = data;
            this.setState({
                gData: data
            });
        });
    }
    changeLabelName(e) {
        let name = e.target.value;
        let data = [...this.state.gData];
        let labelItem = data.find(item => {
            return item.input === 'input';
        });
        labelItem.name = name;
        this.setState({
            gData: data
        });
    }
    render() {
        let labelList = data => data.map((item, index) => {
            if (item.input === 'input') {
                return React.createElement(index_1.Input, { key: index, onChange: this.changeLabelName.bind(this), onBlur: this.blurLabelName.bind(this), value: item.name, ref: 'myInput' });
            }
            return React.createElement("div", { key: index, onClick: () => this.onClickLabel(index, item), className: this.state.selectedIndex === index && 'selected' },
                React.createElement("span", { className: 'labelName' }, item.name),
                React.createElement("span", { className: 'labelNumberLeft' }, "("),
                React.createElement("span", { className: 'labelNumber' }, item.total),
                React.createElement("span", { className: 'labelNumberRight' }, ")"),
                this.dropDown(item.name));
        });
        return (React.createElement("section", { className: 'myLabel' },
            labelList(this.state.gData),
            this.inputDom(),
            React.createElement("div", { className: 'labelBtn' },
                React.createElement(index_1.Button, { onClick: this.onClick.bind(this) }, "\u65B0\u5EFA\u6807\u7B7E"))));
    }
}
exports.Label = Label;
Label.defaultProps = {
    type: 'user'
};
});
//# sourceMappingURL=label.js.map
