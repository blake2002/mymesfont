import * as React from 'react';
export { React };
import { PageGenerics } from '../../../../components/global/components';
import { Tabs, TabPane, Button, message, Modal, Input, Select } from '../../../../components/antd/index';
import { post, get } from '../../../../components/ajax/index';
import OptionsSelect from '../../../../components/options-select/index';
import { uuid } from '../../../../components/util/index';
import RoleAttribute from './_roleAttribute'
import RoleMenuTree from './_roleMenuTree'
const Option = Select.Option;

export default class RoleNav extends PageGenerics<any, any> {
    componentWillMount() {
    }
    state = {
        activeKey: '1'
    }
    onChange = (activeKey) => {
        this.setState({
            activeKey
        })
    }

    tabBarExtraContentRender() {
        return <Button className='menu-manager-btn-add' type="primary" onClick={this.save}>保存</Button>
    }

    save = () => {
        if (this.state.activeKey == '1')
            (this.refs['role_attribute'] as RoleAttribute).save();
        else
            (this.refs['role_auth'] as RoleMenuTree).save();
    }

    handleAreaChange(value) {
        console.log(`selected ${value}`);
    }

    render() {
        let {state, props} = this;
        return <section className='h100 page-device'>
            <section >
                <section className='main-right-tabs'>
                    <div className='main-right-tabs-left ml20 mr20'>
                        <Button onClick={() => this.props.goBack()}> 返回</Button>
                    </div>
                    <Tabs defaultActiveKey='1' type='card'
                        onChange={this.onChange}
                        activeKey={this.state.activeKey}
                        tabBarExtraContent={this.tabBarExtraContentRender()} >
                        <TabPane tab='角色属性' key='1'>
                            <RoleAttribute ref='role_attribute' query={this.props.query} />
                        </TabPane>
                        <TabPane tab='角色授权' key='2'>{
                            <RoleMenuTree ref='role_auth' query={this.props.query} />
                        }
                        </TabPane>
                    </Tabs>
                </section>
            </section>
        </section>
    }
}

