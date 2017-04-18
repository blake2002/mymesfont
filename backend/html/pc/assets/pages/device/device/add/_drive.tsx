import * as React from 'react';
export { React };
import { PureComponentGenerics, Component } from '../../../../components/global/components';
import { Select, Option, Switch, Button, Input, Modal, message } from '../../../../components/antd/index';
import { get, post } from '../../../../components/ajax/index';
import { uuid } from '../../../../components/util/index';
import OptionsSelect from '../../../../components/options-select/index';
import { Link, History } from 'react-router';
import globalValue from '../../../../components/global/value';
import {
    DriverData,
    NSDriverLogicDevice,
    NSDevicesCommunicateDataBlock,
    NSDevicesCommunicateParameter,
    DriverTemplate,
    ParameterConfig,
    ControlType,
    StateType
} from '../types';
import Privileges, { havePrivileges } from '../../../../components/privileges/index';

interface IDeviceDriveProps {
    deviceId: string
};
interface IDeviceDriveState {
    _ID: string
    data: DriverData[],
    driverValue: string
    driverText: string
    addDriverVisible: boolean
    template: DriverTemplate[]
};


/**
 * 驱动
 * 
 * @class DeviceDrive
 * @extends {PureComponentGenerics<IDeviceDriveProps, IDeviceDriveState>}
 */
export default class DeviceDrive extends React.Component<IDeviceDriveProps, IDeviceDriveState> {

    state: IDeviceDriveState = {
        data: [],
        template: [],
        _ID: '',
        driverValue: '',
        driverText: '',
        addDriverVisible: false
    };

    mixins = [History]

    async getData() {
        let { data } = await get('/device_attribute', {
            deviceId: this.props.deviceId,
            categroy: 'NSDevicesDriver'
        });
        this.state.data = data.NSDevicesDriver;
        this.state._ID = data._ID;
        this.state.template = data.NSDriverTemplate;
        this.setState(this.state);
    }

    componentWillMount() {
        // post('/delete_device_driver', {
        //     deviceId: this.props.deviceId,
        //     _ID: '9795e1e7-5374-46cf-9aa3-a0ca86451a8e',
        //     itemIds: ['12f8d3f3-67a4-4778-b17c-9db975a0e733']
        // });
        this.getData();
    }


    /**
     * 临时记录值
     * 
     * @type {NSDevicesCommunicateParameter[]}
     * @memberOf DeviceDrive
     */
    temporaryData: any[] = []
    onDel(index) {
        if (this.state.data.length === 1) {
            message.error('最后一个驱动不可删除！');
            return;
        }
        let data = this.state.data[index];
        if (!data._stateType) {
            data._stateType = 'delete';
        } else {
            this.state.data.splice(index, 1);
        }
        this.setState(this.state);
    }

    /**
     * 获取驱动模版
     * 
     * @returns
     * 
     * @memberOf DeviceDrive
     */
    async getDriverConfig() {
        let { data } = await get('/device_driver_config', { driverId: this.state.driverValue });
        return data;
    }
    /**
     * 添加新驱动
     * 
     * 
     * @memberOf DeviceAdd
     */
    async addDriver() {
        let data = await this.getDriverConfig();
        this.state.template.push(data);

        this.state.data.push({
            NSDriverLogicDevice: [this.getNewDevice(this.state.template.length - 1)],
            DriverID: this.state.driverText,
            _stateType: 'add'
        });
        this.driverModal(false);
        this.setState(this.state);
    }
    getNewDevice(index): NSDriverLogicDevice {
        let template = this.state.template[index];
        let value = template.NSDevicesCommunicateParameter.map(value => {
            let cp: NSDevicesCommunicateParameter = {
                _uuid: uuid(),
                _stateType: 'add',
                ParameterName: value.Column,
                ParameterValue: value.DefaultValue || ''
            };
            return cp;
        })
        return {
            _uuid: uuid(),
            _stateType: 'add',
            DriverDeviceID: '',
            NSDevicesCommunicateDataBlock: [this.newDataBlock(index)],
            NSDevicesCommunicateParameter: value
        };
    }
    newDataBlock(index): NSDevicesCommunicateDataBlock {
        let template = this.state.template[index];
        let value: any = template.NSDevicesCommunicateDataBlockParameter.map(value => {
            return {
                _uuid: uuid(),
                _stateType: 'add',
                ParameterName: value.Column,
                ParameterValue: value.DefaultValue || ''
            };
        })
        return {
            DataBlockID: '',
            _uuid: uuid(),
            _stateType: 'add',
            NSDevicesCommunicateDataBlockParameter: value
        }
    }


    /**
     * 添加驱动弹窗 显示/隐藏
     * 
     * @param {any} bl
     * 
     * @memberOf DeviceAdd
     */
    driverModal(bl) {
        this.state.addDriverVisible = bl;
        this.setState(this.state);
    }
    /**
     * 驱动修改页面
     * 
     * @returns
     * 
     * @memberOf DeviceAdd
     */
    adddDriverRender() {
        return <Modal title='新增驱动' visible={this.state.addDriverVisible}
            onOk={this.addDriver.bind(this)} onCancel={() => this.driverModal(false)}
        >
            <OptionsSelect style={{ width: '100%' }} onChange={(value, text) => {
                this.state.driverValue = value;
                this.state.driverText = text;
            }} type='driver' />
        </Modal>;
    }


    async ajaxSave() {
        let failData = this.getUpdateDataNSDevicesDriver('fail');
        if (failData.length) {
            message.error('通信参数端口号重复！');
            return;
        }


        let updateData = this.getUpdateDataNSDevicesDriver('update');
        if (updateData.length) {
            console.log('更新数据:', updateData);
            await post('/modified_device_driver', {
                deviceId: this.props.deviceId,
                _ID: this.state._ID,
                props: updateData
            });
        }

        let deleteDate = this.getUpdateDataNSDevicesDriver('delete');
        if (deleteDate.length) {
            console.log('删除数据:', deleteDate);
            await post('/delete_device_driver', {
                _ID: this.state._ID,
                deviceId: this.props.deviceId,
                itemIds: deleteDate
            });
        }

        let addDate = this.getUpdateDataNSDevicesDriver('add');
        if (addDate.length) {
            console.log('添加数据:', addDate);
            await post('/new_device_driver', {
                _ID: this.state._ID,
                deviceId: this.props.deviceId,
                categroy: 'NSDevicesDriver',
                props: {
                    NSDevicesDriver: addDate
                }
            });
        }


        this.getData();
        message.success('保存成功！');
    }

    /**
     * 是否有改动
     * 
     * @returns
     * 
     * @memberOf DeviceDrive
     */
    isChange() {
        let updateData = this.getUpdateDataNSDevicesDriver('update');
        let deleteDate = this.getUpdateDataNSDevicesDriver('delete');
        let addDate = this.getUpdateDataNSDevicesDriver('add');

        if (updateData.length || deleteDate.length || addDate.length) {
            return true;
        } else {
            return false;
        }
    }

    getUpdateDataNSDevicesDriver(type: StateType) {
        this.temporaryData = [];

        let data = this.state.data.map(value => this.getUpdateDataByDriverData(value, type)).filter(value => value);
        if (type === 'add') {
            return data;
        }
        return this.temporaryData;
    }

    getUpdateDataByDriverData(data: DriverData, type: StateType) {
        data = Object.assign({}, data);
        data.NSDriverLogicDevice = data.NSDriverLogicDevice.map(value =>
            this.getUpdateDataByNSDriverLogicDevice(value, type)).filter(value => value);

        if (data._stateType === type) {
            switch (type) {
                case 'delete':
                    this.temporaryData.push(data._ID);
                    break;
            }
        }

        if (data.NSDriverLogicDevice.length) {
            return data;
        }

    }
    getUpdateDataByNSDriverLogicDevice(data: NSDriverLogicDevice, type: StateType) {
        data = Object.assign({}, data);

        data.NSDevicesCommunicateDataBlock = data.NSDevicesCommunicateDataBlock.map(value =>
            this.getUpdateDataByNSDevicesCommunicateDataBlock(value, type)).filter(value => value);

        data.NSDevicesCommunicateParameter = data.NSDevicesCommunicateParameter.map(value =>
            this.getUpdateDataByNSDevicesCommunicateParameter(value, type)).filter(value => value);

        if (data._stateType === type) {
            switch (type) {
                case 'update':
                    this.temporaryData.push({
                        _ID: data._ID,
                        ParameterName: 'DriverDeviceID',
                        ParameterValue: data.DriverDeviceID
                    } as any);
                    break;
                case 'delete':
                    this.temporaryData.push(data._ID);
                    break;
            }
            return data;
        }

        if (data.NSDevicesCommunicateDataBlock.length) {
            return data;
        }

    }
    getUpdateDataByNSDevicesCommunicateDataBlock(data: NSDevicesCommunicateDataBlock, type: StateType) {
        data = Object.assign({}, data);
        data.NSDevicesCommunicateDataBlockParameter = data.NSDevicesCommunicateDataBlockParameter.map(value =>
            this.getUpdateDataByNSDevicesCommunicateParameter(value, type)
        ).filter(value => value)
        if (data._stateType === type) {
            switch (type) {
                case 'update':
                    this.temporaryData.push({
                        _ID: data._ID,
                        ParameterName: 'DataBlockID',
                        ParameterValue: data.DataBlockID
                    });
                    break;
                case 'delete':
                    this.temporaryData.push(data._ID);
                    break;
            }
            return data;
        }

        if (data.NSDevicesCommunicateDataBlockParameter.length) {
            return data;
        }
    }
    getUpdateDataByNSDevicesCommunicateParameter(data: NSDevicesCommunicateParameter, type: StateType) {
        data = Object.assign({}, data);

        if (data._stateType === type) {
            switch (type) {
                case 'update':
                    this.temporaryData.push({
                        _ID: data._ID,
                        ParameterName: data.ParameterName,
                        ParameterValue: data.ParameterValue
                    });
                    break;
                case 'fail':
                    this.temporaryData.push({
                        _ID: data._ID,
                        ParameterName: data.ParameterName,
                        ParameterValue: data.ParameterValue
                    });
                    break;
                case 'delete':
                    this.temporaryData.push(data._ID);
                    break;
            }

            return data;
        }
    }

    public render(): JSX.Element {
        let { state, props } = this;
        return (<section>
            {state.data.map((value, index) => {
                if (value._stateType !== 'delete') {
                    value._uuid = value._uuid || uuid();
                    return <Drive key={value._uuid}
                        data={value}
                        template={state.template[index]}
                        onDel={() => this.onDel(index)} />
                }
            })}
            {this.adddDriverRender()}
        </section>);
    }
}



interface IDriveProps {
    onDel: () => void
    data: DriverData,
    template: DriverTemplate
};
interface IDriveState {
};
class Drive extends React.Component<IDriveProps, IDriveState> {

    state = {}

    newDataBlock(): NSDevicesCommunicateDataBlock {
        let value: any = this.props.template.NSDevicesCommunicateDataBlockParameter.map(value => {
            return {
                _uuid: uuid(),
                _stateType: 'add',
                ParameterName: value.Column,
                ParameterValue: value.DefaultValue || ''
            };
        })
        return {
            DataBlockID: '',
            _uuid: uuid(),
            _stateType: 'add',
            NSDevicesCommunicateDataBlockParameter: value
        }
    }

    addDevice() {
        let value = this.props.template.NSDevicesCommunicateParameter.map(value => {
            let cp: NSDevicesCommunicateParameter = {
                _uuid: uuid(),
                _stateType: 'add',
                ParameterName: value.Column,
                ParameterValue: value.DefaultValue || ''
            };
            return cp;
        })
        this.props.data.NSDriverLogicDevice.push({
            _uuid: uuid(),
            _stateType: 'add',
            DriverDeviceID: '',
            NSDevicesCommunicateDataBlock: [this.newDataBlock()],
            NSDevicesCommunicateParameter: value
        });
        this.setState(this.state);
    }

    onDel(index) {
        if (this.props.data.NSDriverLogicDevice.length === 1) {
            message.error('最后一个设备不可删除！');
            return;
        }

        let data = this.props.data.NSDriverLogicDevice[index];
        if (!data._stateType) {
            data._stateType = 'delete';
        } else {
            this.props.data.NSDriverLogicDevice.splice(index, 1);
        }
        this.setState(this.state);
    }

    public render(): JSX.Element {
        let { state, props } = this;
        let { data } = props;

        return <section className='device-add'>
            <section className='device-add-title'>
                {data.DriverID}
                <Privileges value='/device/devices/update/nsDevicesDriver:removeDriver'>
                    <Button className='ml20' onClick={() => this.props.onDel()}>删除</Button>
                </Privileges>
                <Privileges value='/device/devices/update/nsDevicesDriver:addLogicDevice'>
                    <Button className='ml20' onClick={() => this.addDevice()}>新增设备</Button>
                </Privileges>
            </section>
            {
                data.NSDriverLogicDevice.map((value, index) => {
                    if (value._stateType !== 'delete') {
                        value._uuid = value._uuid || uuid();
                        return <Device key={value._uuid} data={value}
                            template={props.template}
                            onDel={() => this.onDel(index)}
                        />;
                    }
                })
            }
        </section >;
    }
}


interface IDeviceProps {
    onDel: () => void
    data: NSDriverLogicDevice,
    template: DriverTemplate
};
interface IDeviceState {
};
/**
 * 设备
 *
 * @class Device
 * @extends {PureComponentGenerics<IDeviceProps, IDeviceState>}
 */
class Device extends React.Component<IDeviceProps, IDeviceState> {

    state = {
    }

    dataBlockAdd() {
        let value: any = this.props.template.NSDevicesCommunicateDataBlockParameter.map(value => {
            return {
                _uuid: uuid(),
                _stateType: 'add',
                ParameterName: value.Column,
                ParameterValue: value.DefaultValue || ''
            };
        })
        this.props.data.NSDevicesCommunicateDataBlock.push({
            DataBlockID: '',
            _uuid: uuid(),
            _stateType: 'add',
            NSDevicesCommunicateDataBlockParameter: value
        });
        this.setState(this.state);
    }


    onChange(e) {
        let target: HTMLButtonElement = e.target;
        this.props.data.DriverDeviceID = target.value;

        if (!this.props.data._stateType) {
            this.props.data._stateType = 'update';
        }
        this.setState(this.state);
    }

    onDel(index) {
        if (this.props.data.NSDevicesCommunicateDataBlock.length === 1) {
            message.error('最后一个数据块不可删除！');
            return;
        }

        let data = this.props.data.NSDevicesCommunicateDataBlock[index];
        if (!data._stateType) {
            data._stateType = 'delete';
        } else {
            this.props.data.NSDevicesCommunicateDataBlock.splice(index, 1);
        }
        this.setState(this.state);
    }

    public render(): JSX.Element {
        let { state, props } = this;
        let { data } = props;


        return (<section className='device-add-content'>
            <section className='cf'>
                <section className='device-add-box' onChange={this.onChange.bind(this)}>
                    <table className='table-from'>
                        <tbody>
                            <tr>
                                <td>设备</td>
                            </tr>
                            <tr>
                                <td>
                                    <Input data-key='title' onChange={this.onChange.bind(this)}
                                        value={data.DriverDeviceID} placeholder='请输入' />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className='tr'>
                        <Privileges value='/device/devices/update/nsDevicesDriver:removeLogicDevice'>
                            <Button onClick={() => this.props.onDel()}>删除</Button>
                        </Privileges>
                        <Privileges value='/device/devices/update/nsDevicesDriver:addDataBlock'>
                            <Button onClick={() => this.dataBlockAdd()} className='ml20'>新增数据块</Button>
                        </Privileges>
                    </div>
                </section>
                <CommParam data={data.NSDevicesCommunicateParameter}
                    template={props.template.NSDevicesCommunicateParameter} />
            </section>
            {
                props.data.NSDevicesCommunicateDataBlock.map((value, index) => {
                    if (value._stateType !== 'delete') {
                        value._uuid = value._uuid || uuid();
                        return <DataBlock
                            template={props.template.NSDevicesCommunicateDataBlockParameter}
                            data={value} key={value._uuid} onDel={() => this.onDel(index)} />;
                    }
                })
            }
        </section>);
    }
}

interface ICommParamProps {
    data: NSDevicesCommunicateParameter[]
    template: ParameterConfig[]
};
interface ICommParamState {
};
/**
 * 通讯参数
 *
 * @class CommunicationParameters
 * @extends {PureComponentGenerics<ICommParamProps, ICommParamState>}
 */
class CommParam extends React.Component<ICommParamProps, ICommParamState> {

    public render(): JSX.Element {
        let { state, props } = this;
        let { data } = props;
        let template = props.template.filter(value => value.Column !== 'Enabled');
        let checkedBox = props.template.find(value => value.Column === 'Enabled');

        return (<section className='comm-param'>
            <div className='comm-param-title'>通讯参数</div>
            <Parameter data={data} template={checkedBox} />
            <table className='table-from table-from-sm mr20'>
                {template.map((value, index) => {
                    if (index % 2 === 0) {
                        let tr2 = template[index + 1];
                        return <tbody key={index}>
                            <tr>
                                <td>{value.ColumnHeader}</td>
                                {
                                    tr2 && <td>{tr2.ColumnHeader}</td>
                                }
                            </tr>
                            <tr>
                                <td>
                                    <Parameter data={data} template={value} />
                                </td>
                                {
                                    tr2 && <td>
                                        <Parameter data={data} template={tr2} />
                                    </td>
                                }
                            </tr>
                        </tbody>;
                    }
                })}
            </table>
        </section>);
    }
}

interface IDataBlockProps {
    onDel: () => void
    data: NSDevicesCommunicateDataBlock
    template: ParameterConfig[]
};
interface IDataBlockState { };
/**
 * 数据块
 *
 * @class DataBlock
 * @extends {PureComponentGenerics<IDataBlockProps, IDataBlockState>}
 */
class DataBlock extends React.Component<IDataBlockProps, IDataBlockState> {

    state = {
        name: ''
    }


    onChange(e) {
        let target: HTMLButtonElement = e.target;
        this.props.data.DataBlockID = target.value;
        if (!this.props.data._stateType) {
            this.props.data._stateType = 'update';
        }
        this.setState(this.state);
    }

    public render(): JSX.Element {
        let { state, props } = this;
        let data = props.data.NSDevicesCommunicateDataBlockParameter;
        let checkedBox = props.template.find(value => value.Column === 'Enabled');
        let template = props.template.filter(value => value.Column !== 'Enabled');

        return (<section className='comm-param data-block'>
            <div className='comm-param-title'>
                数据块
                <Privileges value='/device/devices/update/nsDevicesDriver:removeDataBlock'>
                    <Button className='btn-del' onClick={() => this.props.onDel()}>删除</Button>
                </Privileges>
            </div>
            <Parameter data={data} template={checkedBox} />
            <table className='table-from table-from-sm mr20'>

                <tbody>
                    <tr>
                        <td>数据块名称</td>
                    </tr>
                    <tr>
                        <td>
                            <Input value={props.data.DataBlockID} onChange={this.onChange.bind(this)} />
                        </td>
                    </tr>
                </tbody>

                {template.map((value, index) => {
                    return <tbody key={value.Column}>
                        <tr>
                            <td>{value.ColumnHeader}</td>
                        </tr>
                        <tr>
                            <td>
                                <Parameter data={data} template={value} />
                            </td>
                        </tr>
                    </tbody>;
                })}
            </table>
        </section>);
    }
}


interface IDriveAddProps { };
interface IDriveAddState { };
/**
 * 新增驱动
 *
 * @class DriveAdd
 * @extends {PureComponentGenerics<IDriveAddProps, IDriveAddState>}
 */
class DriveAdd extends React.Component<IDriveAddProps, IDriveAddState> {
    public render(): JSX.Element {
        return (<section className='drive-add'>
            <table className='table-from table-from-sm'>
                <tbody>
                    <tr>
                        <td>驱动</td>
                    </tr>
                    <tr>
                        <td>
                            <Select style={{ width: '100%' }} defaultValue='1'>
                                <Option value='1'>分组1</Option>
                                <Option value='2'>分组2</Option>
                                <Option value='3'>分组</Option>
                            </Select>
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>);
    }
}


interface IParameterProps {
    template: ParameterConfig
    data: NSDevicesCommunicateParameter[],
    // onChange?: (value) => void
};
interface IParameterState { };
class Parameter extends React.Component<IParameterProps, IParameterState> {
    state = {}

    data = this.props.data.find(data => data.ParameterName === this.props.template.Column);
    onChangeInput(e) {
        let target: HTMLButtonElement = e.target;
        this.changeValue(target.value);
    }

    onChangeSelect(value) {
        this.changeValue(value);
    }

    onChangeSwitch(value: boolean) {
        this.changeValue(value ? '1' : '0');
    }

    changeValue(value) {
        this.data.ParameterValue = value;
        if (!this.data._stateType) {
            this.data._stateType = 'update';
        }
        this.setState(this.state)
    }


    async onBlur(e) {
        let target: HTMLButtonElement = e.target;
        let value = target.value;
        if (this.data.ParameterName === 'CommParameter') {
            let str = value.match(/^[^,]+,/g);
            if (str) {
                let bl = await this.ajaxCheck(str[0]);
                if (!bl) {
                    this.data._stateType = 'fail';
                    message.error('通信参数端口号重复！');
                }
            }
        }
    }

    async ajaxCheck(port) {
        let { data } = await get('/check_driver_com_port', {
            deviceId: globalValue.query['DeviceID'],
            comPort: port
        });
        return data['result'];
    }

    objectToArray(object): { value: string, text: string }[] {
        let arr = [];
        for (let key in object) {
            if (object.hasOwnProperty(key)) {
                let element = object[key];
                arr.push({
                    value: key,
                    text: element
                });
            }
        }
        return arr;
    }

    public render(): JSX.Element {
        let { props } = this;
        let value = this.data.ParameterValue;
        switch (props.template.ControlType) {
            case 'CheckBox':
                return <Switch onChange={this.onChangeSwitch.bind(this)}
                    checked={value === '1' ? true : false}></Switch>;
            case 'ComboBox':
                let arr = this.objectToArray(props.template.Val2Disp);
                return <Select value={value}
                    style={{ width: '100%' }}
                    onChange={this.onChangeSelect.bind(this)}>
                    {arr.map((value, index) => {
                        return <Option key={index} value={value.value}>{value.text}</Option>;
                    })}
                </Select>;
            default:
                return <Input value={value} onBlur={this.onBlur.bind(this)}
                    onChange={this.onChangeInput.bind(this)} placeholder='' />;
        }
    }
}
