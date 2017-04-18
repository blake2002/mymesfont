import * as React from 'react'
export { React }

import { get, post } from '../../../components/ajax/index'
import {
    Table, Input, Icon, Button, Switch, Spin,
    ModalSlip, message, Pagination
} from '../../../components/antd/index'
import Details from './_details'
import RoleAjax from './_roleAjaxData'

export class EditableTable extends React.Component<any, any>  {
    state = {
        columns: [],
        dataSource: [],
        loading: true,
        rowKey: 'key',
        currentKey: '',// 当前选择的rowKey值   
        role_detail: {},
        pageTotal: 1,
        pageIndex: 1
    }
    pageSize = 12

    componentWillMount() {
        this.updateAjax();
    }

    updateAjax() {
        let p1 = this.updateListTemplate()
        let p2 = this.updateRoleList()
        Promise.all([p1, p2]).then(() => {
            this.setState({
                columns: RoleAjax.role_columns, dataSource: RoleAjax.role_list,
                loading: false, rowKey: RoleAjax.role_key,
                pageTotal: RoleAjax.pageCount

            })
        })
    }

    //角色列表
    updateRoleList() {
        return RoleAjax.get_role_list(this.state.pageIndex, this.pageSize)
    }

    //模板
    updateTemplate() {
        return RoleAjax.get_role_template()
    }

    //列表模板
    updateListTemplate() {
        return RoleAjax.get_role_list_template()
    }
    

    /////////////////////////////////////////////////////////////////////////////////////////////


    onRowClick = (record, index) => {
        if (this.rowSelection.selectedRowKeys.length == 0) {
            let currentKey = record[this.state.rowKey]
            this.setState({
                currentKey: record[this.state.rowKey]
            })
            let ret = RoleAjax.get_role_detail(currentKey)

            ret.then(() => {
                this.setState({
                    role_detail: RoleAjax.role_detail[currentKey]
                })
            })

        }
    }

    rowSelection = {
        selectedRowKeys: [],
        onChange: (selectedRowKeys, selectedRows) => {
            this.rowSelection.selectedRowKeys = selectedRowKeys
            this.setState(this.state);
        }
    }
    rowClassName(record, index) {
        if (this.state.currentKey === record[this.state.rowKey]) {
            return 'selected-td';
        }
        return '';
    }
    getTableHeight() {
        let height = document.body.clientHeight -255 ;
        return height;
        // if (height <= this.state.dataSource.length * 55) {
        //     return height;
        // } else {
        //     return null;
        // }
    }
    render() {
        return <section className='main-right-content-box'>
            <Table
                rowKey={this.state.rowKey}
                rowSelection={this.rowSelection}
                columns={this.state.columns}
                dataSource={this.state.dataSource}
                onRowClick={this.onRowClick}
                rowClassName={this.rowClassName.bind(this)}
                pagination={false}
                scroll={{ x: true, y: this.getTableHeight() }}
            />
            <Details
                dataSource={this.state.dataSource}
                selectedRowKeys={this.rowSelection.selectedRowKeys}
                rowKey={this.state.rowKey}
                currentKey={this.state.currentKey}
                role_detail={this.state.role_detail}
                onEnableChange={this.onEnableChange.bind(this)}
                updateData={this.updateAjax.bind(this)}
            />
            <Pagination className='mt20'
                onChange={this.paginationOnChange.bind(this)}
                current={this.state.pageIndex}
                total={this.state.pageTotal * this.pageSize}
                defaultPageSize={this.pageSize}
            />
        </section>
    }
    onEnableChange(v) {
        let { currentKey, dataSource } = this.state
        for (let i in dataSource) {
            let obj = dataSource[i]
            if (obj[this.state.rowKey] == currentKey) {
                this.state.dataSource[i].Enable = v
                break
            }
        }
        this.setState(this.state)

    }
    paginationOnChange(pageIndex, pageSize) {
        this.state.pageIndex = pageIndex
        let p = this.updateRoleList()
        p.then(() => {
            this.setState({
                pageIndex,
                dataSource: RoleAjax.role_list,
                pageTotal: RoleAjax.pageCount
            })
        })
    }

}