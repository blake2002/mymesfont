import * as React from 'react';
export { React };

import { get, post } from '../../../components/ajax/index'
import {
    Table, Input, Icon, Button, Switch, Spin,
    ModalSlip, message
} from '../../../components/antd/index';
import EditableCell from './_cell'
import MyDetails from '../_myDetails'

export class EditableTable extends React.Component<any, any> {
    state = {
        dataSource: [],
        loadingKey: '',
        selectedRowKeys: [],
        selectedRowKey: '',//单选
        modalSlipVisible: false,
        finish: false,
    };
    columns = []
    initColumns() {
        let onCellChange = (record, index, colKey) => {
            return (value) => {
                if (colKey == 'Enable') value = value ? '1' : '0';
                this.findDataSource((menus, menu, index) => {
                    if (menu._ID === record._ID) {
                        if (menu['__flag'] == undefined) {
                            menu['__flag'] = 'modify'
                        }
                        menu[colKey] = value
                    }
                });
            };
        };

        let renderColumns = (text, record, index, colKey) => {
            if (colKey === 'Enable') {
                return <Switch
                    defaultChecked={record.Enable == '1'}
                    onChange={onCellChange(record, index, 'Enable')}
                />;
            }
            // console.log(record);
            return <EditableCell
                value={text}
                onChange={onCellChange(record, index, colKey)}
                finish={this.state.finish ? true : undefined}
                flag={record['__flag']}
            />;
        };

        this.columns = [{
            title: '名称',
            dataIndex: 'Name',
            key: 'Name',
            width: '20%',
            render: (text, record, index) => renderColumns(text, record, index, 'Name')
        }, {
            title: '标识',
            dataIndex: 'ID',
            key: 'ID',
            width: '20%',
            render: (text, record, index) => renderColumns(text, record, index, 'ID')
        }, {
            title: '链接',
            dataIndex: 'Link',
            key: 'Link',
            width: '20%',
            render: (text, record, index) => renderColumns(text, record, index, 'Link')
        }, {
            title: '排序',
            dataIndex: 'OrderbyIndex',
            key: 'OrderbyIndex',
            width: '20%',
            render: (text, record, index) => renderColumns(text, record, index, 'OrderbyIndex')
        }, {
            title: '启用/禁用',
            dataIndex: 'Enable',
            key: 'Enable',
            width: '20%',
            render: (text, record, index) => renderColumns(text, record, index, 'Enable')
        }];
    }

    //加载真实DOM之前
    componentWillMount() {
        this.initColumns();
        this.updateDataSource();
    }
    componentDidUpdate(prevProps, prevState) {
        this.state.finish = false;
    }

    _modifiedMenuList = {}

    /**
     * _ID：唯一ID
     * callback（parent父节点，子节点）
     */
    findDataSource(callback) {
        let each = (rootAry, callback) => {
            for (let i in rootAry) {
                let menuObj = rootAry[i];
                if (callback) {
                    let ret = callback(rootAry, menuObj, i);//callback (parent,obj)
                    if (ret) return ret;
                }
                if (menuObj.children && menuObj.children.length != 0) {
                    let ret = each(menuObj.children, callback);//递归
                    if (ret) return ret;
                }
            }
            return null;
        }
        return each(this.state.dataSource, callback);
    }

    findMenuObjBy_ID(_ID) {
        return this.findDataSource((menus, menu, index) => {
            if (_ID == menu._ID)
                return menu;
            //不反回知道默认返回什么值 undefined?
        });
    }
    remoteMenuObjBy_ID(_ID) {
        return this.findDataSource((menus, menu, index) => {
            if (menu._ID == _ID) {
                menus.splice(index, 1);
                return true;
            }
        });
    }
    modifyMenuObjBy_ID(_ID, colKey, value) {
        return this.findDataSource((menus, menu, index) => {
            if (menu._ID == _ID) {
                menu[colKey] = value;
                return true;
            }
        });
    }
    /**
     * 设置子集数据
     * @param parentId 上级key
     * @param menu_list 被添加的菜单数组
     */
    appendChildren(_ID, menu_list) {
        return this.findDataSource((menus, menu, index) => {
            if (menu._ID == _ID) {
                menu.children = menu_list;
                return true;
            }
        });
    }

    /**
     * 添加菜单
     */
    handleAdd() {
        const { dataSource } = this.state;
        const newData = {
            Name: '',
            ID: '',
            _ID: MyDetails.newGuid(),
            Link: '',
            Enable: 1,
            OrderbyIndex: '',
            __flag: 'new'
        }
            ;
        this.state.dataSource.unshift(newData);
        this.setState({
            dataSource: this.state.dataSource
        });
    }

    /**
     * 添加子菜单
     */
    handleAddChildren = () => {
        let _ID = this.state.selectedRowKey;
        console.log(_ID)
        if (_ID == '') return;//未选中 
        let menuObj = this.findMenuObjBy_ID(_ID);
        if (menuObj['children'] && menuObj['children'].length == 0) {//未加载子集候不允许添加子集
            return;
        }
        const newData = {
            Name: '',
            ID: '',
            _ID: MyDetails.newGuid(),
            Link: '',
            Enable: 1,
            OrderbyIndex: 100,
            __flag: 'new',
            parentMenuID: menuObj.ID,
        };

        if (menuObj['children'] && menuObj['children'].length > 0) {
            menuObj['children'].unshift(newData);
        }
        else {
            menuObj['children'] = [newData];
        }
        this.setState({
            dataSource: this.state.dataSource
        });
    }

    verify() {
        let isok = '';
        let verifyKeys = {};
        this.findDataSource((menus, menu, index) => {
            if (menu.Name == '' || menu.ID == '') {
                isok = '标识与名称不能为空';
                return;
            }
            if (verifyKeys[menu.ID] == '1') {
                isok = '标识不能重名';
                return;
            }
            verifyKeys[menu.ID] = '1';
        });
        return isok
    }
    //保存所有
    handleSave() {
        let newDatas = []
        let modifyDatas = []
        let { dataSource } = this.state
        let verify = this.verify()
        if (verify != '') {
            message.error(verify)
            return;
        }
        this.findDataSource((menus, menu, index) => {
            if (menu['__flag'] == 'new') {
                newDatas.push(menu)
            }
            else if (menu['__flag'] == 'modify') {
                modifyDatas.push({ ...menu, menuID: menu.ID })
            }
        });
        console.log('new', newDatas)
        console.log('modify', modifyDatas)
        let p1 = post('/new_menu', { props: newDatas });
        let p2 = post('/modified_menu', { props: modifyDatas });
        Promise.all([p1, p2]).then((result) => {
            message.success('保存成功!');
            this.updateDataSource().then(() => {
                this.setState({ dataSource: this.state.dataSource, finish: true });
            })
        });
    }

    adjustCheckSet(_ID, selected) {
        let menuObj = this.findMenuObjBy_ID(_ID);
        if (menuObj) {
            let menuSelectAll = (menu) => {
                let menuSelect = (menu) => {
                    if (selected) {
                        this.state.selectedRowKeys.push(menu._ID); //需要做不重复处理
                    }
                    else {
                        for (let i in this.state.selectedRowKeys) {
                            let rowKey = this.state.selectedRowKeys[i];
                            if (rowKey == menu._ID) {
                                this.state.selectedRowKeys.splice(i, 1);
                                break;
                            }
                        }
                    }
                };
                menuSelect(menu);
                let menuList = menu.children;
                for (let i in menuList) {
                    let menuObj = menuList[i];
                    menuSelectAll(menuObj);//递归   
                }
            };
            menuSelectAll(menuObj);

        }
    }

    unique(ary, isStrict) {
        if (ary.length < 2)
            return [ary[0]] || [];
        var tempObj = {}, newArr = [];
        for (var i = 0; i < ary.length; i++) {
            var v = ary[i];
            var condition = isStrict ? (typeof tempObj[v] != typeof v) : false;
            if ((typeof tempObj[v] == "undefined") || condition) {
                tempObj[v] = v;
                newArr.push(v);
            }
        }
        return newArr;
    }

    render() {
        const { dataSource } = this.state;
        const columns = this.columns;

        const rowSelection = {
            type: 'checkbox',
            selectedRowKeys: this.state.selectedRowKeys,//指定选中项的 key 数组，需要和 onChange 进行配合	Array	[]
            onChange: (selectedRowKeys, selectedRows) => {//选中项发生变化的时的回调	Function
                if (selectedRowKeys.length > 0 && selectedRowKeys[0] == undefined) {
                    selectedRowKeys.splice(0, 1);
                }
                this.setState({ selectedRowKeys: selectedRowKeys });
            },
            // getCheckboxProps(record) {//选择框的默认属性配置

            // },
            onSelect: (record, selected, selectedRows) => {//用户手动选择/取消选择某列的回调	Function

                this.adjustCheckSet(record._ID, selected);
                this.state.selectedRowKeys = this.unique(this.state.selectedRowKeys, false);
                if (this.state.selectedRowKeys.length > 0 && this.state.selectedRowKeys[0] == undefined) {
                    this.state.selectedRowKeys.splice(0, 1);
                }
                let modalSlipVisible = this.state.selectedRowKeys.length > 0;
                this.setState({
                    selectedRowKeys: this.state.selectedRowKeys,
                    modalSlipVisible: modalSlipVisible
                });

                // this.modalSlipShow();

            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                if (this.state.selectedRowKeys.length > 0 && this.state.selectedRowKeys[0] == undefined) {
                    this.state.selectedRowKeys.splice(0, 1);
                }
                if (!selected) {
                    this.modalSlipHide();
                } else {
                    this.modalSlipShow();
                }
            }
        }

        return <section className='main-right-content-box'>
            <Table
                rowKey='_ID'
                rowClassName={this.rowClassName.bind(this)}
                pagination={false}
                dataSource={dataSource}
                columns={columns}
                onExpandedRowsChange={this.onExpandedRowsChange.bind(this)}
                onExpand={this.onExpand.bind(this)}
                rowSelection={rowSelection}
                onRowClick={this.onRowClick.bind(this)}
                scroll={{ x: true, y: this.getTableHeight() }}
            />
            <ModalSlip title={'菜单管理'}
                onCancel={this.modalSlipHide.bind(this)} visible={this.state.modalSlipVisible}>
                {this.getModalSlipContent()}
            </ModalSlip>
        </section>
    }
    getTableHeight() {
        let height = document.body.clientHeight - 255;
        return height;
        // if (height <= this.state.dataSource.length * 55) {
        //     return height;
        // } else {
        //     return null;
        // }
    }
    getModalSlipContent() {
        let each = (rootAry, _ID) => {
            for (let i in rootAry) {
                let menuObj = rootAry[i];
                if (menuObj._ID == _ID) {
                    return menuObj;
                } else if (menuObj.children && menuObj.children.length != 0) {
                    let ret = each(menuObj.children, _ID);//递归
                    if (ret) return ret;
                }
            }
            return null;
        }
        return <section>
            <ul className='ul-details'>
                {
                    this.state.selectedRowKeys.map((value, index) => {
                        if (value != undefined) {
                            let menuObj = each(this.state.dataSource, value);
                            return <li key={menuObj._ID}>{menuObj.Name}</li>;
                        }
                    })}
            </ul>
            <section className='component-slip-footer'>
                <Button onClick={this.onButtonDelete.bind(this)}>删除</Button>
            </section>
        </section>
    }
    onButtonDelete() {
        let ids = [];
        for (let i in this.state.selectedRowKeys) {
            let menuObj = this.findMenuObjBy_ID(this.state.selectedRowKeys[i]);
            ids.push(menuObj.ID);
        }
        let promise = post('/delete_menu', {
            menuIDs: ids,
        });
        promise.then((result) => {
            if (result.code == 0) {
                for (let _ID of this.state.selectedRowKeys) {
                    let ret = this.remoteMenuObjBy_ID(_ID);
                    if (!ret) message.warning('未删除成功' + _ID);
                }
                message.success('删除成功')
                this.setState({
                    selectedRowKeys: [],
                    modalSlipVisible: false,
                    dataSource: this.state.dataSource
                });
            }
        });
    }

    modalSlipHide() {
        this.setState({
            modalSlipVisible: false
        });
    }
    modalSlipShow() {
        this.setState({
            modalSlipVisible: true
        });
    }

    onRowClick(record, index, cellDom) {
        this.setState({ selectedRowKey: record._ID });
    }

    rowClassName(record, index) {
        if (this.state.selectedRowKey === record._ID) {
            return 'selected-td';
        }
        return '';
    }

    /**
     * 展开的行变化时触发
     * expandedRows 行 1,2
     */
    onExpandedRowsChange(expandedRows) {

    }



    /**
     * 点击展开图标时触发
     * expanded 是否展开
     */
    onExpand(expanded, record) {
        if (expanded && record['children'].length == 0) {//
            this.setState({
                loadingKey: record._ID
            });
            let promise = get('/menu_list', {
                parentId: record.ID, //提交上一级菜单ID
            });
            promise.then((result) => {
                let menuList = result['data']['MenuList'];
                this.appendChildren(record._ID, menuList);
                //check
                let index = this.state.selectedRowKeys.indexOf(record._ID);
                this.adjustCheckSet(record._ID, index != -1);
                this.state.selectedRowKeys = this.unique(this.state.selectedRowKeys, false);
                this.setState({
                    loadingKey: '-1',
                    dataSource: this.state.dataSource
                });
            });

        } else {
            this.setState({
                loadingKey: '-1'
            });
        }

    }

    updateDataSource() {
        let promise = get('/menu_list', {
            // userId: 'xxx',
            // token: 'xxx',
            parentId: '-1', //提交上一级菜单ID
        });
        promise.then((result) => {
            let menuList = result['data']['MenuList'];
            let verifyKeys = {};
            this.state.dataSource = menuList;
            this.findDataSource((menus, menu, index) => {
                if (menu.Name == '' || menu.ID == '') {
                    delete menus[index]
                }
                if (verifyKeys[menu.ID] == '1') {
                    delete menus[index]
                }
                verifyKeys[menu.ID] = '1';
            });
            this.setState({
                dataSource: menuList
            });
        });
        return promise
    }
}