import * as React from 'react';
export { React };

import { get, post } from '../../../components/ajax/index'
import {
    Table, Input, Icon, Button, Switch, Spin,
    ModalSlip, message
} from '../../../components/antd/index';
import Details from './_details'

export class EditableTable extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.columns = [{
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            width: '14.2%'
        }, {
            title: '标识',
            dataIndex: 'key',
            key: 'key',
            width: '14.2%'
        }, {
            title: '类型',
            dataIndex: 'category',
            key: 'category',
            width: '14.2%',
            render: (text, record, index) => (
                this.getDisplayValue(text)
            )
        }, {
            title: '版本',
            dataIndex: 'version',
            key: 'version',
            width: '14.2%'
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: '14.2%'
        }, {
            title: '更新时间',
            dataIndex: 'lastUpdateTime',
            key: 'lastUpdateTime',
            width: '14.2%'
        }, {
            title: '更新人员',
            dataIndex: 'updateBy',
            key: 'updateBy',
            width: '14.2%'
        }];

        this.state = {
            dataSource: [],
            categroy_options: [],
            loadingKey: '',
            selectedRowKeys: [],
            selectedRowKey: '',//单选
            modalSlipVisible: false,
            pageSize: 20
        };
    }
    getDisplayValue(text) {
        for (let obj of this.state.categroy_options) {
            if (obj.key == text) {
                return obj.value;
            }
        }
        return '';
    }

    //加载真实DOM之前
    componentWillMount() {
        let p1 = this.updateDataSource();
        let p2 = this.updateOptions();
        Promise.all([p1, p2]).then((result) => {
            this.setState({
                dataSource: this.state.dataSource,
                categroy_options: this.state.categroy_options
            });
        });
    }

    newGuid() {
        var guid = "";
        for (var i = 1; i <= 32; i++) {
            var n = Math.floor(Math.random() * 16.0).toString(16);
            guid += n;
            if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                guid += "-";
        }
        return guid;
    }

    adjustCheckSet(key, selected) {
        let each = (rootAry) => {
            for (let i in rootAry) {
                let wfObj = rootAry[i];
                if (wfObj.key == key) {
                    return wfObj;
                } else if (wfObj.children && wfObj.children.length != 0) {
                    let ret = each(wfObj.children);//递归
                    if (ret) return ret;
                }
            }
            return null;
        }
        let wfObj = each(this.state.dataSource);
        if (wfObj) {
            let menuSelectAll = (menu) => {
                let menuSelect = (menu) => {
                    if (selected) {
                        this.state.selectedRowKeys.push(menu.key); //需要做不重复处理
                    }
                    else {
                        for (let i in this.state.selectedRowKeys) {
                            let rowKey = this.state.selectedRowKeys[i];
                            if (rowKey == menu.key) {
                                this.state.selectedRowKeys.splice(i, 1);
                                break;
                            }
                        }
                    }
                };
                menuSelect(menu);
                let menuList = menu.children;
                for (let i in menuList) {
                    let wfObj = menuList[i];
                    menuSelectAll(wfObj);//递归   
                }
            };
            menuSelectAll(wfObj);

        }
    }
    unique = (ary, isStrict) => {
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

                this.adjustCheckSet(record.key, selected);
                this.state.selectedRowKeys = this.unique(this.state.selectedRowKeys, false);
                if (this.state.selectedRowKeys.length > 0 && this.state.selectedRowKeys[0] == undefined) {
                    this.state.selectedRowKeys.splice(0, 1);
                }
                let modalSlipVisible = this.state.selectedRowKeys.length > 0;
                this.setState({
                    selectedRowKeys: this.state.selectedRowKeys,
                    modalSlipVisible: modalSlipVisible
                });

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

        return (<div>
            <Table
                pagination={false}
                bordered dataSource={dataSource}
                columns={columns}
                rowSelection={rowSelection}
                onRowClick={this.onRowClick.bind(this)}
                />
            <ModalSlip title={'流程详情'}

                onCancel={this.modalSlipHide.bind(this)} visible={this.state.modalSlipVisible}>
                {
                    this.state.selectedRowKeys.length > 0 ? this.selectRender() : this.detailsRender()
                }
            </ModalSlip>
        </div>);
    }
    detailsRender() {
        let {state} = this;
        let objData = {};
        for (let obj of state.dataSource) {
            if (obj.key == this.state.selectedRowKey) {
                objData = obj;
                break;
            }
        }
        return <Details data={objData} categroy_options={state.categroy_options}
            onSwitchChange={this.onSwitchChange.bind(this)}
            onDelete={(value) => this.onDelete(value)}
            handleMenuClick={(e) => this.handleMenuClick(e)}

            onTop={this.onTop.bind(this)}
            />;
    }

    onSwitchChange(enable, data) {

    }
    onDelete(value) {
        let promise = post('/delete_wf_model', {
            modelIds: [value.id]
        });
        promise.then((result) => {
            this.modalSlipHide();
            this.componentWillMount();
            message.success('删除成功！')
        });
    }
    handleMenuClick(e) {
        let {state} = this;
        let objData = {};
        if (state.selectedRowKeys.length > 0) {
            for (let obj of state.dataSource) {
                if (obj.key == state.selectedRowKey) {
                    objData = obj;
                    break;
                }
            }
        }
        let id = objData['id'];
        let promise = post('/modified_wf_model', {
            modelId: id,
            categor: e.key
        });
        promise.then((result) => {
            if (result.code == 0) {
                console.log(objData);

                console.log(e.key);
                objData['categor'] = e.key;
                this.setState({
                    dataSource: this.state.dataSource
                })
                message.success('修改成功！');
            }
        });
    }
    onTop(data) {

    }

    selectRender() {
        if (this.state.selectedRowKeys.length == 0) {
            return <div />;
        }
        let each = (rootAry, key) => {
            for (let i in rootAry) {
                let wfObj = rootAry[i];
                if (wfObj.key == key) {
                    return wfObj;
                }
            }
            return null;
        }
        return <section>
            <ul className='ul-details'> {
                (this.state.selectedRowKeys.length > 0) ?
                    this.state.selectedRowKeys.map((value, index) => {
                        if (value != undefined) {
                            let wfObj = each(this.state.dataSource, value);
                            return <li key={wfObj.key}>{wfObj.name}</li>;
                        }
                    }) : {

                    }
            }
            </ul>
            <section className='component-slip-footer'>
                <Button onClick={this.onButtonDelete.bind(this)}>删除</Button>
            </section>
        </section>
    }
    onButtonDelete() {
        let contains = (arr, obj) => {
            var i = arr.length;
            while (i--) {
                if (arr[i] === obj) {
                    return i;
                }
            }
            return -1;
        };
        let each = (rootAry, keys) => {
            for (let i = 0; i < rootAry.length; i++) {
                let wfObj = rootAry[i];
                if (wfObj.children && wfObj.children.length != 0) {
                    each(wfObj.children, keys);//递归
                }
                let keyIndex = contains(keys, wfObj.key);
                if (keyIndex != -1) {
                    rootAry.splice(i, 1);
                    keys.splice(keyIndex, 1);
                    i--;
                }
            }
        };

        let promise = post('/delete_menu', {
            menuId: this.state.selectedRowKeys, //提交上一级菜单ID
        });
        promise.then((result) => {
            if (result.code == 0) {
                each(this.state.dataSource, this.state.selectedRowKeys);
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
        let rowSelectFun = () => {
            let childNode = cellDom.target.parentNode.parentNode.childNodes;
            for (var i = childNode.length - 1; i >= 0; i--) {
                if (childNode[i].className.indexOf('ant-table-row') >= 0) {
                    if (childNode[i].style.backgroundColor === 'rgb(231, 244, 253)') {
                        childNode[i].style.backgroundColor = '';
                    }
                }
            }
            if (cellDom.target.parentNode.className.indexOf('ant-table-row') >= 0)
                cellDom.target.parentNode.style.backgroundColor = "#E7F4FD";
            this.state.selectedRowKey = record.key;
        }
        rowSelectFun();//行选择 

        this.modalSlipShow();
    }


    /**
     * 设置子集数据
     * @param parentId 上级key
     * @param menu_list 被添加的菜单数组
     */
    adjustChildrenSet(parentId, menu_list) {
        let each = (key, rootAry, childrenAry) => {
            for (let i in rootAry) {
                let wfObj = rootAry[i];
                if (wfObj.key == parentId) {
                    wfObj.children = childrenAry;
                    return;
                } else if (wfObj.children && wfObj.children.length != 0) {
                    each(parentId, wfObj.children, childrenAry);//递归
                }
            }
        }
        let isok = each(parentId, this.state.dataSource, menu_list);
    }

    updateDataSource() {
        let promise = get('/wf_model_list', {
            pageIndex: this.props.query.current || 1,
            pageSize: this.state.pageSize
        });
        promise.then((result) => {
            let menuList = result['data']['ModelList'];
            this.state.dataSource = menuList;
        });
        return promise;
    }
    updateOptions() {
        let promise = get('/wf_model_categroy_options', {
        });
        promise.then((result) => {
            let list = result['data'];
            this.state.categroy_options = list;
        });
        return promise;
    }
}