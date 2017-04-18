import * as React from 'react';
import { post, get } from '../../../components/ajax/index';
import deviceDetails from '../../device/device/_details';
import { Tabs, TabPane, Button, message } from '../../../components/antd/index';
import { DeviceData, NSDevices, DevicesTemplate } from '../../device/device/types';
import { PageGenerics } from '../../../components/global/components';
import { MainLeft } from '../../_main';
import globalValue from '../../../components/global/value';
import TemplateTable from '../../../components/template-table/index';
import { objectToArray2, DeviceDataOperation } from '../../../components/template-input/index';
import Privileges, { havePrivileges } from '../../../components/privileges/index';
export let privileges = '/department/users/update';
interface IDeviceAddProps {
    /**
     * 区域id
     * 
     * @type {string}
     * @memberOf IDeviceProps
     */
    deptUserId: string
};

/**
 * 新增设备
 * 
 * @export
 * @class DeviceAdd
 * @extends {PageGenerics<IDeviceAddProps, any>}
 */
export default class DeviceAdd extends PageGenerics<IDeviceAddProps, any> {
    treeType: any = 'department_tree'
    returnUrl = '/department/members/index'
    title = '人员属性'

    state = {};

    async ajaxSave() {
        (this.refs['AddInformation'] as any).ajaxUpdate();
    }


    /**
     * 新增驱动渲染
     * 
     * @returns
     * 
     * @memberOf DeviceAdd
     */
    tabBarExtraContentRender() {
        return <section className='device-add-menu'>
            <Button privileges='/department/users/update:save'
                className='ml20' type='primary' onClick={this.ajaxSave.bind(this)}>保存</Button>
        </section>;
    }


    AddInformationRender() {
        return <AddInformation ref='AddInformation' deptUserId={this.props.query.deptUserId} />;
    }

    render() {
        let { state, props } = this;
        return <section className='h100 page-device'>
            <MainLeft disabled={true}
                type='member'
                treeType={this.treeType}
                regionId={this.props.query['regionId']}></MainLeft>
            <section className='main-right'>
                <section className='main-right-tabs'>
                    <div className='main-right-tabs-left ml20 mr20'>
                        <Button onClick={() => {
                            delete this.props.query.deptUserId;
                            globalValue.jump(this.returnUrl, this.props.query);
                        }}> 返回</Button>
                    </div>
                    <Tabs activeKey='1' type='card'
                        tabBarExtraContent={this.tabBarExtraContentRender()} >
                        <TabPane tab={this.title} key='1'>
                        </TabPane>
                    </Tabs>
                </section>

                <section className={'main-right-content page-deviceadd '}>
                    {this.AddInformationRender()}
                </section>
            </section>
        </section>
    }
}


interface IAddInformationProps {
    deptUserId: string
};
interface IAddInformationState {
    data: DeviceData
};
/**
 * 新增设备-表单
 * 
 * @class AddInformation
 * @extends {React.Component<IAddInformationProps, IAddInformationState>}
 */
export class AddInformation extends React.Component<IAddInformationProps, IAddInformationState> {
    key = 'NSUsersTemplate'

    state: IAddInformationState = {
        data: {
            NSDevices: [],
            NSDevicesTemplate: {
                Props: []
            }
        }
    }

    /**
     * 用于给父级获取数据
     * 
     * @returns
     * 
     * @memberOf AddInformation
     */
    getData() {
        return this.state.data.NSDevices;
    }

    /**
     * 获取设备模版
     * 
     * 
     * @memberOf AddInformation
     */
    async ajaxGet() {
        let { data } = await get('/user_detail', {
            deptUserId: this.props.deptUserId
        });

        let AddData = data[this.key].Props;
        this.state.data = {
            NSDevices: objectToArray2(data.NSUsers),
            NSDevicesTemplate: {
                Props: AddData
            }
        };
        this.setState(this.state);
    }


    async ajaxUpdate() {
        let Operation = new DeviceDataOperation(
            'NSDevices', '', this.state.data.NSDevices, this.state.data.NSDevicesTemplate.Props);
        let data = Operation.getUpdate();

        if (!data.length) {
            message.success('请修改数据！');
            return;
        }

        let deptUserId = this.props.deptUserId;
        await post('/modified_user', {
            deptUserId, props: {
                NSUsers: Operation.getUpdate()
            }
        });
        message.success('修改成功!');

        // globalValue.query['deptUserId'] = this.getValue({ Name: 'UserID' }).ParameterValue;
        // globalValue.jump(globalValue.url, globalValue.query);
        this.componentDidMount();
    }


    /**
     * 根据模版找值
     * 
     * @param {NSDevices} value
     * @returns
     * 
     * @memberOf AddInformation
     */
    getValue(template) {
        let { NSDevices } = this.state.data;
        return NSDevices.find(data => data.ParameterName === template.Name);
    }



    /**
     * 是否显示
     * 
     * @param {DevicesTemplate} template
     * @returns
     * 
     * @memberOf AddInformation
     */
    isShow(template: DevicesTemplate) {
        let show = true;
        if (!template) {
            show = false;
        } else {
            if (template.Visible === 'false') {
                show = false;
            }
            if (template.Form && template.Form.Type === 'Hidden') {
                show = false;
            }

            if (template.Name === 'Latitude') {
                show = false;
            }
        }

        return show;
    }

    public render(): JSX.Element {
        let { props, state } = this;
        let { data } = state;
        return (<section>
            <TemplateTable data={this.state.data.NSDevices} template={this.state.data.NSDevicesTemplate.Props} />
        </section >);
    }

    /**
     * 渲染后执行
     * 
     * 
     * @memberOf AddInformation
     */
    componentDidMount() {
        this.ajaxGet();
    }
}



