import * as React from 'react'
export { React }

import { get, post } from '../../../components/ajax/index'
import {
    Table, Input, Icon, Button, Switch, Spin,
    ModalSlip, message
} from '../../../components/antd/index'
import Details from './_details'
import MyPagination from './_pagination'
import RoleAjax from './_roleAjaxData'

export class EditableTable extends React.Component<any, any>  {
    state = {
        columns: [],
        dataSource: [],
        loading: true,
        rowKey: 'key',
        currentKey: '',// 当前选择的rowKey值   
    }


    componentWillMount() {
        this.updateAjax();
    }

    updateAjax() {
        let p1 = this.updateTemplate()
        let p2 = this.updateRoleList()
        Promise.all([p1, p2]).then(() => {
            this.setState({
                columns: RoleAjax.role_columns, dataSource: RoleAjax.role_list,
                loading: false, rowKey: RoleAjax.role_key
            })
        })
    }

    //角色列表
    updateRoleList() {
        return RoleAjax.get_role_list(1, 20)
    }

    //模板
    updateTemplate() {
        return RoleAjax.get_role_template()
    }

    /////////////////////////////////////////////////////////////////////////////////////////////
    //行选择多选绑定
    rowSelectedClickBind(record, index) {
        let currentKey = record[this.state.rowKey]
        let keyIndex = this.rowSelection.selectedRowKeys.indexOf(currentKey)
        if (keyIndex != -1) {
            this.rowSelection.selectedRowKeys.splice(keyIndex, 1)
        } else {
            this.rowSelection.selectedRowKeys.push(currentKey)
        }
        this.setState({ currentKey })
    }

    onRowClick = (record, index) => {
        this.rowSelectedClickBind(record, index)
    }

    rowSelection = {
        selectedRowKeys: [],
        onChange: (selectedRowKeys, selectedRows) => {
            this.rowSelection.selectedRowKeys = selectedRowKeys
            this.setState(this.state);
        }
    }

    render() {
        return <section>
            <Table
                rowKey={this.state.rowKey}
                rowSelection={this.rowSelection}
                columns={this.state.columns}
                bordered dataSource={this.state.dataSource}
                onRowClick={this.onRowClick}
                rowClassName={(record, index) => {
                    if (this.state.currentKey === record[this.state.rowKey]) return 'selected-td'
                    return ''
                }}
            />
            <Details
                dataSource={this.state.dataSource}
                selectedRowKeys={this.rowSelection.selectedRowKeys}
                rowKey={this.state.rowKey}
                currentKey={this.state.currentKey}
            />
            < MyPagination />
        </section>
    }

    //新建角色
    new_role(){
        console.log('new_role');
    }
}