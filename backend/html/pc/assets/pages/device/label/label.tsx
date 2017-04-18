import * as React from 'react';
import Tree from '../../../components/tree/index';
import { Icon, Menu, Dropdown, Modal, Input, Button } from '../../../components/antd/index';
import { get, post } from '../../../components/ajax/index';
import './label.css'

let tagName; // 修改标签时记录原标签
let TagListData;  // 记录标签数据
let listDataFlag = false;
export class Label extends React.Component<any, any> {
    state = {
        gData: [],
        visible: false,
        selectedIndex: 0
    }
    async getTagList() {   // 获取标签列表
        let json = await get('/tag_list', {
            category: this.props.type // user-用户， device-设备
        });
        return json;
    }
    async postNewTag(tagName) {  // 新增标签
        let json = await post('/new_tag', {
            tagName: tagName // 标签名称
        });
        return json;
    }
    async postModifiedTag(parameter) {  // 修改
        let json = await post('/modified_tag', {
            tagName: parameter.tagName, // 原标签名称
            newTagName: parameter.newTagName // 新标签名称
        });
        return json;
    }
    async postDeleteTag(tagName) {  // 删除
        let json = await post('/delete_tag', {
            tagName: tagName
        });
        return json;
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
                }
                data.push(obj);
                if (item.Name === this.props.selectedName) {
                    selectedIndex = index;
                }
            })
            TagListData = data;
            this.setState({
                gData: data,
                selectedIndex
            })
        })
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
        if (e.key === '0') {  // 修改标签
            let labelItem = data.find(item => {
                tagName = item.name;  // 记录修改之前的标签名
                return item.name === e.item.props.name;
            });
            labelItem.input = 'input';
            this.setState({
                gData: data
            }, () => {
                (this.refs['myInput'] as any).focus();
            });
        } else if (e.key === '1') {   // 删除标签
            this.postDeleteTag(e.item.props.name).then(val => {
                this.findItem(data, e.item.props.name);
                TagListData = data;
                this.setState({
                    gData: data
                })
            })
        }
    }
    findItem(data, name) {  // 删除标签
        data.find((item, index, arr) => {
            if (item.name === name) {
                arr.splice(index, 1);
            }
        });
    }
    meueRender(name) {
        return <Menu onClick={this.handleMenuClick.bind(this)}>
            <Menu.Item key='0' name={name}>编辑</Menu.Item>
            <Menu.Item key='1' name={name}>删除</Menu.Item>
        </Menu>
    }
    dropDown(name) {
        return name !== '已关注' && <span onClick={this.stopClick} style={{ marginRight: '0px' }}>
            <Dropdown overlay={this.meueRender(name)} trigger={['click']}>
                <Icon className='treeIcon' type='ellipsis' style={{ position: 'static' }} />
            </Dropdown>
        </span>
    }
    stopClick(e) {
        e.stopPropagation();
    }
    onClick() {   // 新增标签
        this.setState({
            visible: true
        }, () => {
            (this.refs['myrefs'] as any).focus();
        })
    }
    inputDom() {
        return this.state.visible && <Input onBlur={this.inputBlur.bind(this)} ref={'myrefs'} />
    }
    inputBlur(e) {
        let name = e.target.value;
        this.postNewTag(e.target.value).then(val => {
            let data = [...this.state.gData];
            data.push({
                name: name,
                total: 0
            })
            TagListData = data;
            this.setState({
                gData: data,
                visible: false
            })
        })
    }
    onClickLabel(index, item) {
        if (this.props.onLabelClick) {
            this.props.onLabelClick(item)
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
        }
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
        })
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
        })
    }
    render() {
        let labelList = data => data.map((item, index) => {
            if (item.input === 'input') {
                return <Input key={index} onChange={this.changeLabelName.bind(this)}
                    onBlur={this.blurLabelName.bind(this)}
                    value={item.name}
                    ref={'myInput'}
                    />
            }
            return <div key={index} onClick={() => this.onClickLabel(index, item)}
                className={this.state.selectedIndex === index && 'selected'}>
                <span className='labelName'>{item.name}</span>
                <span className='labelNumberLeft'>(</span>
                <span className='labelNumber'>{item.total}</span>
                <span className='labelNumberRight'>)</span>
                {this.dropDown(item.name)}
            </div >
        });
        return (
            <section className='myLabel'>
                {labelList(this.state.gData)}
                {this.inputDom()}
                <div className='labelBtn'>
                    <Button onClick={this.onClick.bind(this)}>新建标签</Button>
                </div>
            </section>
        );
    }
}

(Label as any).defaultProps = {
    type: 'user'
}