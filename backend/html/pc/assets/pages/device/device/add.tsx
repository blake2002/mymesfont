import * as React from 'react';
export { React };
import { PageGenerics } from '../../../components/global/components';
import { Tabs, TabPane, Button, message } from '../../../components/antd/index';
import { post, get } from '../../../components/ajax/index';

import { MainLeft } from '../../_main';
import Information from './add/_information';
import { DeviceData, NSDevices, DevicesTemplate } from './types';
import TemplateInput from '../../../components/template-input/index';
import TemplateTable from '../../../components/template-table/index';
import globalValue from '../../../components/global/value';
import MapInput from '../../../components/map-input/index';
import Privileges, { havePrivileges } from '../../../components/privileges/index';

import './add.css';

/**
 * 页面权限
 *
 */
export let privileges = '/device/devices/add';

interface IDeviceAddProps {
    /**
     * 区域id
     * 
     * @type {string}
     * @memberOf IDeviceProps
     */
    regionId: string
};

/**
 * 新增设备
 * 
 * @export
 * @class DeviceAdd
 * @extends {PageGenerics<IDeviceAddProps, any>}
 */
export default class DeviceAdd extends PageGenerics<IDeviceAddProps, any> {

    title = '设备属性'
    treeType: any = 'region_tree'
    returnUrl = '/device/device/index'

    state = {};
    /**
     * 保存ajax
     * 
     * 
     * @memberOf DeviceAdd
     */
    async ajaxSave() {
        let newData: NSDevices[] = (this.refs['AddInformation'] as any).getData();
        let {data} = await post({
            url: '/new_device',
            data: {
                companyId: this.props.query.regionId || 125,
                props: { NSDevices: newData }
            }
        });

        this.props.jump('/device/device/update', {
            ...this.props.query,
            DeviceID: newData.find(value => value.ParameterName === 'DeviceID').ParameterValue
        });
        message.success('新增成功！')
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
            <Button privileges='/device/devices/add:save'
                className='ml20' type='primary' onClick={this.ajaxSave.bind(this)}>创建</Button>
        </section>;
    }

    AddInformationRender() {
        return <AddInformation ref='AddInformation' />;
    }

    renderMainLeft() {
        return <MainLeft disabled={true}
            type='device'
            treeType={this.treeType}
            regionId={this.props.query['regionId']}></MainLeft>
    }

    render() {
        let {state, props} = this;
        return <section className='h100 page-device'>
            {this.renderMainLeft()}
            <section className='main-right'>
                <section className='main-right-tabs'>
                    <div className='main-right-tabs-left ml20 mr20'>
                        <Button onClick={() => {
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

    state: IAddInformationState = {
        data: {
            NSDevices: [],
            NSDevicesTemplate: {
                Props: []
            }
        }
    }

    templateUrl = '/device_template'
    key = 'NSDevicesTemplate'

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
        let {data} = await get(this.templateUrl, {
            categroy: 'NSDevices'
        });

        let AddData = data[this.key].Props;
        this.state.data = {
            NSDevices: AddData.map(value => {
                return {
                    ParameterName: value.Name,
                    ParameterValue: value.DefaultValue || ''
                };
            }),
            NSDevicesTemplate: {
                Props: AddData
            }
        };

        this.setState(this.state);
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
        let {NSDevices} = this.state.data;
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
        let {props, state} = this;
        let {data} = state;
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
