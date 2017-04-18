import * as React from 'react';
import { PureComponentGenerics } from '../../../components/global/components';
import { Modal, Button, Dropdown, Menu, Icon, ModalSlip, message } from '../../../components/antd/index';
import { get, post } from '../../../components/ajax/index'
import { Link } from 'react-router';

import { MyTreeSelect } from '../../device/selectTree/selectTree';
import './index.css'
import RoleAjax from './_roleAjaxData'
//props rowKey dataSource selectedRowKeys
export default class Details extends React.Component<any, any> {
    state = {
        mode: 0,//0显示单个角色详情 1显示多个
        role_detail: {},//角色详情
        modalSlipVisable: false,
        treeVisible: false,
        treeSelectId: ''
    }
    treeType = 'region_tree'

    componentWillMount() {
        console.log('componentWillMount')
    }

    componentWillUpdate(nextProps, nextState) {
        this.state.modalSlipVisable = nextProps.selectedRowKeys.length > 0 || nextProps.currentKey != ''
        nextProps.selectedRowKeys.length <= 0 ? this.state.mode = 0 : this.state.mode = 1
        if (this.state.mode == 0 && this.state.modalSlipVisable) {
            this.state.role_detail = nextProps.role_detail
            // console.log(nextProps.role_detail)
        }//this.updateData(nextProps.currentKey)
    }

    updateData(currentKey) {
        let ret = RoleAjax.get_role_detail(currentKey)
        ret.then(() => {
            this.state.role_detail = RoleAjax.role_detail[currentKey]
        })
    }

    getAreaNames(area) {
        let names = ''
        for (let i in area) {
            let path = area[i].Path
            names += path[path.length - 1].Name + ','
        }
        return names.substring(0, names.length - 1)
    }

    renderDetail() {
        let { state, props } = this;
        return (<section className='device-details'>
            <h4>
                <p>{this.state.role_detail['Name'] || ''}</p>
                <p>{this.state.role_detail['ID'] || ''}</p>
            </h4>
            <table className='table-details'>
                <tbody>
                    <tr>
                        <th>角色类型</th>
                        <td>{this.state.role_detail['Type']}</td>
                    </tr>
                    <tr>
                        <th>区域架构</th>
                        <td>{this.getAreaNames(this.state.role_detail['Area'])}</td>
                    </tr>
                    <tr>
                        <th>组织架构</th>
                        <td>{this.getAreaNames(this.state.role_detail['Organization'])}</td>
                    </tr>
                </tbody>
            </table>
            <section className='component-slip-footer'>
                <Link to={{
                    pathname: '/system/roleManager/roleAttribute/_roleNav',
                    query: {
                        rowKey: this.props.currentKey
                    }
                }} ><Button>修改</Button></Link>
                <Button onClick={this.onEnable.bind(this)} >{this.state.role_detail['Enable'] == 'true' ? '禁用' : '启用'}</Button>
                <Dropdown overlay={this.menu}><Button>更多</Button></Dropdown>
            </section>
        </section >)
    }
    onEnable() {
        let v = this.state.role_detail['Enable'] == 'true' ? 'false' : 'true'

        let p = RoleAjax.post_modified_role(this.state.role_detail['ID'], [{
            'ParameterName': 'Enable',// 角色ID（值来自于用户模板）
            'ParameterValue': v
        }])
        p.then((reponse) => {
            if (reponse.code == 0) {
                message.success('修改成功')
                this.state.role_detail['Enable'] = v
                // this.setState(this.state)
                this.props.onEnableChange(v)
            }
        })
    }

    renderMultipleSelect() {
        if (this.props.selectedRowKeys.length == 0) {
            return <div />;
        }
        let each = (rootAry, key) => {
            for (let i in rootAry) {
                let wfObj = rootAry[i];
                if (wfObj[this.props.rowKey] == key) {
                    return wfObj;
                }
            }
            return null;
        }
        return <section>
            <ul className='ul-details'> {
                this.props.selectedRowKeys.map((value, index) => {
                    if (value != undefined) {
                        let wfObj = each(this.props.dataSource, value);
                        return <li key={wfObj[this.props.rowKey]}>{wfObj.Name}</li>;
                    }
                })
            }
            </ul>
            <section className='component-slip-footer'>
                <Button onClick={this.onButtonDelete}>删除</Button>
            </section>
        </section>
    }

    onButtonDelete = () => {
        let p = RoleAjax.post_delete_role(this.props.selectedRowKeys)
        p.then((reponse) => {
            if (reponse.code == 0) { 
                message.success('删除成功')
                this.props.updateData()
            }
        })
        return p
    }

    render() {
        return <ModalSlip title={'角色详情'}
            onCancel={() => this.setState({ modalSlipVisable: false })} visible={this.state.modalSlipVisable}>
            {
                this.state.mode === 0 ?
                    this.renderDetail() :
                    this.renderMultipleSelect()
            }
        </ModalSlip>
    }

    menu = <Menu onClick={this.handleClick.bind(this)}>
        <Menu.Item key='1'>历史版本</Menu.Item>
        <Menu.Item key='del'
        >删除</Menu.Item>
        <Menu.Item key='5'>日志</Menu.Item>
    </Menu>;
    handleClick(e) {//item, key, keyPath 
        if (e.key == 'del') {
            this.onButtonDelete()
        }
    }
}
