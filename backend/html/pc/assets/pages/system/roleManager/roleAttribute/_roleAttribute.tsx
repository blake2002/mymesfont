import * as React from 'react'
export { React }
import { Tabs, TabPane, Button, message, Modal, Input, Select } from '../../../../components/antd/index';
import TemplateTable from '../../../../components/template-table/index'
import { objectToArray2, DeviceDataOperation } from '../../../../components/template-input/index'
import RoleAjax from '../_roleAjaxData'

export default class RoleAttribute extends React.Component<any, any>{
    state = {
        role_template: [],
        role_detail: [],
        isNew: this.props.query.rowKey == undefined
    }
    save() { 
        if (this.state.isNew) {
            let Operation = new DeviceDataOperation(
                'NSDevices', '', this.state.role_detail, this.state.role_template);
            let data = Operation.getData();
             RoleAjax.post_add_role(data).then((reponse) => {
                if (reponse.code == 0) {
                    message.success('新建成功')
                }
            })
        } else {
            let Operation = new DeviceDataOperation(
                'NSDevices', '', this.state.role_detail, this.state.role_template);
            let data = Operation.getData2();
            console.log((data))
            let roleId = this.props.query.rowKey
            
            RoleAjax.post_modified_role(roleId, data).then((reponse) => {
                if (reponse.code == 0) {
                    message.success('保存成功')
                    // this.componentWillMount()
                }
            })
        }
    }
    componentWillMount() {
        if (this.state.isNew) {
            let p1 = RoleAjax.get_role_template()
            p1.then(() => {
                this.setState({
                    role_template: RoleAjax.role_template
                })
            })
        } else {
            let p1 = RoleAjax.get_role_template();
            let p2 = RoleAjax.get_role_detail(this.props.query.rowKey)
            Promise.all([p1, p2]).then(() => { 
                this.setState({
                    role_template: RoleAjax.role_template,
                    role_detail: objectToArray2(RoleAjax.role_detail[this.props.query.rowKey])
                })
                console.log(this.state.role_detail)
            })
        }
    }

    handleChange = (template, e) => {
        const value = e.target.value
        this.state.role_detail[template.Name] = value
        this.setState({
            role_detail: this.state.role_detail
        })
    }

    render() {
        console.log(this.state)
        return (<section>
            <TemplateTable data={this.state.role_detail} template={this.state.role_template} />
        </section >)
    }
}