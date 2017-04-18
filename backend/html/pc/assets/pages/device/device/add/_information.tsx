import * as React from 'react';
export { React };
import { PureComponentGenerics } from '../../../../components/global/components';
import { DatePicker, Input, Select, Option, Switch, message } from '../../../../components/antd/index';
import { DeviceData, NSDevices, DevicesTemplate } from '../types';
import OptionsSelect from '../../../../components/options-select/index';
import { post, get } from '../../../../components/ajax/index';
import TemplateInput, { DeviceDataOperation } from '../../../../components/template-input/index';
import globalValue from '../../../../components/global/value';


interface IDeviceDriveProps {
    deviceId: string
};
interface IDeviceDriveState {
    data: DeviceData
};
/**
 * 设备信息
 * 
 * @class DeviceDrive
 * @extends {PureComponentGenerics<IDeviceDriveProps, IDeviceDriveState>}
 */
export default class DeviceDrive extends React.Component<IDeviceDriveProps, IDeviceDriveState> {
    state: IDeviceDriveState = {
        data: {
            NSDevices: [],
            NSDevicesTemplate: {
                Props: []
            }
        }
    }

    getTemplate(value: NSDevices) {
        let {NSDevicesTemplate} = this.state.data;
        let {Props} = NSDevicesTemplate;

        return Props.find(data => data.Name === value.ParameterName);
    }

    async getData() {
        let {data} = await get('/device_attribute', {
            deviceId: this.props.deviceId,
            categroy: 'NSDevices'
        });
        this.state.data = data;

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

        // 添加hidden的值
        // this.state.data.NSDevicesTemplate.Props.forEach(value => {
        //     if (value.Form && value.Form.Type === 'Hidden') {
        //         let dev = this.state.data.NSDevices.find(devices => devices.ParameterName === value.Name);
        //         data.push(dev);
        //     }
        // });



        let deviceId = this.props.deviceId;
        await post('/modified_device', {
            deviceId, props: {
                NSDevices: data
            }
        });
        message.success('修改成功!');

        globalValue.query['deviceId'] = this.getValue({ Name: 'deviceId' }).ParameterValue;
        globalValue.jump(globalValue.url, globalValue.query);
    }

    componentWillMount() {
        this.getData();
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

    /**
     * 是否有改动
     * 
     * @returns
     * 
     * @memberOf Com
     */
    isChange() {
        let data = this.state.data.NSDevices.filter(value =>
            value._stateType === 'update');
        if (data.length) {
            return true;
        } else {
            return false;
        }
    }

    public render(): JSX.Element {
        let {props, state} = this;
        let {data} = state;
        return (<section>
            <table className='table-from' >
                {data.NSDevicesTemplate.Props.map(template => {
                    let value = this.getValue(template);
                    let bl = this.isShow(template);

                    if (bl) {
                        return <tbody key={value.ParameterName}>
                            <tr>
                                {
                                    template.Name === 'Longitude' ?
                                        <td>经纬度</td> :
                                        <td>{template.Description}</td>
                                }
                            </tr>
                            <tr>
                                <td>
                                    <TemplateInput data={value} dataList={data.NSDevices} template={template} />
                                </td>
                            </tr>
                        </tbody>;
                    }
                })}
            </table>
        </section >);
    }
}

