
import * as React from 'react'
export { React }

import { get, post } from '../../../components/ajax/index'
import {
    Table, Input, Icon, Button, Switch, Spin,
    ModalSlip, message, Pagination
} from '../../../components/antd/index'
import DictAjax from './_dictAjaxData'
import EditableCell from './_cell'
import MyDetails from './../_myDetails'
export class EditableTable extends React.Component<any, any>  {
    state = {
        columns: [],
        dataSource: [],
        loading: true,
        rowKey: '_ID',
        currentKey: '',// 当前选择的rowKey值   
        finish: false,
        pageIndex: 1,
        pageTotal: 1,
        modalSlipVisable: false
    }
    pageSize = 12
    _modifiedMenuList = {}

    componentWillMount() {
        this.updateAjax()
    }

    updateAjax() {
        let p1 = this.updateTemplate()
        let p2 = this.updateList()
        Promise.all([p1, p2]).then(() => {
            this.template_data_exchange(DictAjax.dict_template)
            this.setState({
                dataSource: DictAjax.dict_list,
                loading: false,
                pageTotal: DictAjax.pageCount
            })
        })
    }
    onCellChange(record, index, colKey) {
        return (value) => {
            console.log(value)
            let { dataSource } = this.state
            for (let i in dataSource) {
                if (dataSource[i].Key === record.Key) {
                    if (dataSource[i]['__flag'] == undefined) {
                        dataSource[i]['__flag'] = 'modify'
                        dataSource[i]['__key'] = Object(dataSource[i]['Key'])
                        dataSource[i]['__type'] = Object(dataSource[i]['Type'])
                    }
                    dataSource[i][colKey] = value
                }
            }

            // if (!this._modifiedMenuList[record.Key]) this._modifiedMenuList[record.Key] = {
            //     Key: record.Key,
            //     Type: record.Type,
            //     Modified: {}
            // }
            // this._modifiedMenuList[record.Key]['Modified'][colKey] = value
        };

    }
    renderColumns = (text, record, index, colKey) => {
        return <EditableCell
            value={text}
            onChange={this.onCellChange(record, index, colKey)}
            finish={this.state.finish ? true : undefined}
            flag={record['__flag']}
        />;
    };


    /**模板转换列 */
    template_data_exchange(templates) {
        let columns = []
        let width = 100 / templates.length
        for (let template of templates) {
            let col = {
                title: template.Description,
                dataIndex: template.Name,
                key: template.Name,
                // width: width,//template.Form.Properties.Width,
                render: (text, record, index) => this.renderColumns(text, record, index, template.Name)
            }
            columns.push(col)
        }
        this.state.columns = columns
    }

    onSave() {
        let newDatas = []
        let modifyDatas = []
        let { dataSource } = this.state
        for (let i in dataSource) {
            let obj = dataSource[i]
            if (obj['__flag'] == 'new') {
                delete obj['__flag']
                newDatas.push(obj)
            }
            else if (obj['__flag'] == 'modify') {
                let oldKey = obj['__key']
                let oldType = obj['__type']
                delete obj['__flag']
                delete obj['__key']
                delete obj['__type']
                modifyDatas.push({
                    Type: oldType,
                    Key: oldKey,
                    Modified: obj
                })
            }
        }
        let promiselist = [];
        console.log(modifyDatas)
        if (modifyDatas.length > 0) {
            let p1 = post('/sys/modified_dict', { props: modifyDatas });
            promiselist.push(p1)
        }
        if (newDatas.length > 0) {
            let p2 = post('/sys/new_dict', { props: newDatas })
            promiselist.push(p2)
        }
        Promise.all(promiselist).then((result) => {
            this.updateList().then(() => {
                this.setState({ dataSource: this.state.dataSource, finish: true });
            })
            message.success('保存成功!');
        });

        // let requestList = Object.keys(this._modifiedMenuList).map((k) => { return this._modifiedMenuList[k] });
        // if (requestList.length === 0) return;
        // let promise = post('/sys/modified_dict', { props: requestList });
        // promise.then((result) => {
        //     if (result.code == 0) {
        //         this._modifiedMenuList = {};
        //         this.updateRoleList().then(() => {
        //             this.setState({ dataSource: this.state.dataSource, finish: true });
        //         })
        //     }
        // });

    }

    onNew() {
        let newData = {
            Key: " ",
            Value: " ",
            Type: " ",
            Description: " ",
            OrderbyIndex: " ",
            _ID: MyDetails.newGuid(),
            __flag: 'new'
        }
        this.state.dataSource.unshift(newData)
        this.setState(this.state)
    }

    //列表
    updateList() {
        return DictAjax.get_list(this.state.pageIndex, this.pageSize)
    }

    //模板
    updateTemplate() {
        return DictAjax.get_template()
    }

    /////////////////////////////////////////////////////////////////////////////////////////////


    onRowClick = (record, index) => {
        // console.log(record);
    }

    rowSelection = {
        selectedRowKeys: [],
        onChange: (selectedRowKeys, selectedRows) => {
            this.rowSelection.selectedRowKeys = selectedRowKeys
            this.state.modalSlipVisable = selectedRowKeys.length > 0
            this.setState(this.state);
        }
    }
    getTableHeight() {
        let height = document.body.clientHeight - 300;
        if (height <= this.state.dataSource.length * 55) {
            return height;
        } else {
            return null;
        }
    }
    render() {
        return <section className='main-right-content-box'>
            <Table
                rowKey={this.state.rowKey}
                rowSelection={this.rowSelection}
                columns={this.state.columns}
                dataSource={this.state.dataSource}
                onRowClick={this.onRowClick}
                rowClassName={(record, index) => {
                    if (this.state.currentKey === record[this.state.rowKey]) return 'selected-td'
                    return ''
                }}
                pagination={false}
                scroll={{x:true,y:this.getTableHeight()}}
            />
            <Pagination className='mt20'
                onChange={this.paginationOnChange.bind(this)}
                current={this.state.pageIndex}
                total={this.state.pageTotal * this.pageSize}
                defaultPageSize={this.pageSize}
            />

            <ModalSlip title={'字典'}
                onCancel={() => this.setState({ modalSlipVisable: false })} visible={this.state.modalSlipVisable}>
                <section>
                    <ul className='ul-details'> {
                        this.rowSelection.selectedRowKeys.map((key, index) => {
                            if (key != undefined) {
                                let wfObj = this.each(key);
                                console.log(wfObj)
                                if (wfObj)
                                    return <li key={wfObj['Key']}>{wfObj.Value}</li>;
                            }
                        })
                    }
                    </ul>
                    <section className='component-slip-footer'>
                        <Button onClick={this.onButtonDelete}>删除</Button>
                    </section>
                </section>

            </ModalSlip>
        </section>
    }
    each = (key) => {
        for (let i in this.state.dataSource) {
            let obj = this.state.dataSource[i]
            let objKey = obj['Key']//obj['__key'] ? obj['__key'] : obj['Key']
            if (objKey == key) return obj
        }
    }

    onButtonDelete = () => {
        let dicts = this.rowSelection.selectedRowKeys.map((key, index) => {
            if (key != undefined) {
                let wfObj = this.each(key);
                return { Key: wfObj.Key, Type: wfObj.Type }
            }
        })
        post('/sys/delete_dict', {
            dicts
        }).then(() => {
            message.success('删除成功!')
            let p = this.updateList()
            p.then(() => {
                this.setState({
                    dataSource: DictAjax.dict_list,
                    pageTotal: DictAjax.pageCount
                })
            })
        })
    }

    paginationOnChange(pageIndex, pageSize) {
        this.state.pageIndex = pageIndex
        let p = this.updateList()
        p.then(() => {
            this.setState({
                pageIndex,
                dataSource: DictAjax.dict_list,
                pageTotal: DictAjax.pageCount
            })
        })
    }
}