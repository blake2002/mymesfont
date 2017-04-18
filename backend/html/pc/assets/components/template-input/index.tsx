import { NSDevices, DevicesTemplate } from './types';
import { post, get } from '../ajax/index';
import {
    DatePicker, Input, Select, Option, Switch,
    Button, Dropdown, Menu, message, Modal, Pagination,
    CheckboxGroup, Tabs, TabPane
} from '../antd/index';
import * as React from 'react';
import * as moment from 'moment';
import SwitchText from '../switch-text/index';
import MapInput from '../map-input/index';
import { MyTreeSelect } from '../../pages/device/selectTree/selectTree';
import { CheckTree } from '../../pages/model/system/_tree';

export class DeviceDataOperation {
    data: NSDevices[]
    template: DevicesTemplate[]
    deviceId: string
    categroy: string

    constructor(categroy: string, deviceId: string, data: NSDevices[], template: DevicesTemplate[]) {
        this.categroy = categroy;
        this.deviceId = deviceId;
        this.data = data;
        this.template = template;
    }

    /**
     * 获取值
     * 
     * @param {string} key
     * @returns
     * 
     * @memberOf DeviceClass
     */
    getValue(key: string) {
        let data = this.data.find(value => value.ParameterName === key);
        return data && data.ParameterValue;
    }
    /**
     * 更新值
     * 
     * @param {string} key
     * @param {string} value
     * 
     * @memberOf DeviceDrive
     */
    update(key: string, value: string) {
        let data = this.data.find(value => value.ParameterName === key);

        if (data) {
            if (!data._stateType) {
                data._stateType = 'update';
            }
            data.ParameterValue = value;
        } else {
            this.data.push({
                ParameterValue: value,
                ParameterName: key,
                _stateType: 'update'
            });
        }
    }

    getData() {
        let data = JSON.parse(JSON.stringify(this.data));

        data.forEach(value => {
            if (value.ParameterName === 'Organization') {
                value.ParameterValue = value.ParameterValue.map(value => {
                    return value.Path[value.Path.length - 1].ID
                });
            }

            if (value.ParameterName === 'Area') {
                value.ParameterValue = value.ParameterValue.map(value => {
                    return value.Path[value.Path.length - 1].ID
                });
            }

            if (value.ParameterName === 'ID') {
                value.ParameterValue = value.ParameterValue.map(value => {
                    return value.ID
                });
            }
        });
        return data;
    }

    getData2() {
        let data = JSON.parse(JSON.stringify(this.data.filter(value =>
            value._stateType === 'update')));


        data.forEach(value => {
            if (value.ParameterName === 'Organization') {
                value.ParameterValue = value.ParameterValue.map(value => {
                    return value.Path[value.Path.length - 1].ID
                });
                value.OriginalParameterValue = value.OriginalParameterValue.map(value => {
                    return value.Path[value.Path.length - 1].ID
                });
                return
            }

            if (value.ParameterName === 'Area') {
                value.ParameterValue = value.ParameterValue.map(value => {
                    return value.Path[value.Path.length - 1].ID
                });
                value.OriginalParameterValue = value.OriginalParameterValue.map(value => {
                    return value.Path[value.Path.length - 1].ID
                });
                return
            }
            delete value.OriginalParameterValue


        });
        console.log(data)
        return data
    }

    /**
     * 获取ajax data
     * 
     * @returns
     * 
     * @memberOf DeviceDrive
     */
    getUpdate() {

        let data = JSON.parse(JSON.stringify(this.data.filter(value =>
            value._stateType === 'update')));

        data.forEach(value => {
            if (value.ParameterName === 'Organization') {
                value.ParameterValue = value.ParameterValue.map(value => {
                    return value.Path[value.Path.length - 1].ID
                });
            }
            else  if (value.ParameterName === 'Area') {
                value.ParameterValue = value.ParameterValue.map(value => {
                    return value.Path[value.Path.length - 1].ID
                });
            }
            else if (value.ParameterName === 'Role') {
                value.ParameterValue = value.ParameterValue.map(value => {
                    return value.ID
                });
            }
        });

        // 添加hidden的值
        // this.template.forEach(value => {
        //     if (value.Form && value.Form.Type === 'Hidden') {
        //         let dev = this.data.find(devices => devices.ParameterName === value.Name);
        //         data.push(dev);
        //     }
        // });

        return data;
    }

    /**
     * ajax修改
     * 
     * 
     * @memberOf DeviceClass
     */
    async ajaxUpdate() {
        let { data } = await post('/modified_device', {
            deviceId: [this.deviceId],
            props: {
                ['${this.categroy}']: this.getUpdate()
            }
        });
        // this.setState(this.state);
        message.success('修改成功！')
    }

}

interface IParameterProps {
    template: DevicesTemplate
    dataList?: NSDevices[]
    data: NSDevices
};
interface IParameterState { };
export class ParameterText extends React.Component<IParameterProps, IParameterState> {
    state = {}
    public render(): JSX.Element {
        let { props } = this;

        let value = props.data ? props.data.ParameterValue : '';
        let from = props.template.Form;
        let text = value;
        switch (from && from.Type) {
            case 'ComboBox':
                let data = from.Options.find(option => option.Key === value);
                text = data ? data.Value : '';
                break;
            case 'MapPicker':
                let latitude = this.props.dataList.find(value => value.ParameterName === 'Latitude').ParameterValue;
                text = latitude + ',' + value;
                break;
            case 'Switch':
                if (!from.Options) {
                    from.Options = [{ Value: '禁用', Key: '0' }, { Value: '启用', Key: '1' }];
                }

                let Sdata = from.Options.find(val => val.Key === value);
                text = Sdata ? Sdata.Value : '';
                break;
            case 'OrgPicker':
                text = value.map((value, index) => {
                    return <span key={index}>{this.getPath(value.Path)}<br /></span>;
                });
                break;
        }

        return <span>{text}</span>;
    }


    getPath(value) {
        let text = '';
        value.forEach(value => {
            text += value.Name + '-';
        });
        text = text.replace(/\-$/g, '');;
        return text;
    }
}

const dateFormat = 'YYYY/MM/DD HH:mm';
interface IParameterProps {
    template: DevicesTemplate
    data: NSDevices
    dataList?: NSDevices[]
    onChange?: () => void
};
interface IParameterState { };
export default class TemplateInput extends React.Component<IParameterProps, IParameterState> {
    state = {}

    onChangeInput(e) {
        let target: HTMLButtonElement = e.target;
        this.changeValue(target.value);
    }

    onChangeSwitch(value) {
        this.changeValue(value ? '1' : '0');
    }

    onChangeSelect(value) {
        this.changeValue(value);
    }

    onChangeDatePicker(value, text) {
        this.changeValue(text);
    }

    changeValue(value) {
        let { props } = this;
        props.data.ParameterValue = value;

        if (!props.data._stateType) {
            props.data._stateType = 'update';
        }
        if (this.props.onChange) {
            this.props.onChange();
        }
        this.setState(this.state)
    }

    onOkMapInput(value: {
        longitude: string
        latitude: string
    }) {
        let latitude = this.props.dataList.find(value => value.ParameterName === 'Latitude');
        latitude.ParameterValue = value.latitude;

        if (!latitude._stateType) {
            latitude._stateType = 'update';
        }

        this.changeValue(value.longitude);
    }

    public render(): JSX.Element {
        let { props } = this;
        let value = props.data.ParameterValue;
        let from = props.template.Form;
        switch (from && from.Type) {
            case 'ComboBox':
                let data = from.Options || [];
                return <Select value={value}
                    style={{ width: '100%' }}
                    onChange={this.onChangeSelect.bind(this)}>
                    {data.map((value, index) => {
                        return <Option key={value.Key} value={value.Key}>{value.Value}</Option>;
                    })}
                </Select>;
            case 'Switch':
                return <Switch checked={value === '1' ? true : false} onChange={this.onChangeSwitch.bind(this)} />;
            case 'DateTimePicker':
                return <DatePicker value={value && moment(value, dateFormat)} style={{ width: '100%' }}
                    format={dateFormat} onChange={this.onChangeDatePicker.bind(this)} showTime />;
            case 'MapPicker':
                let latitude = this.props.dataList.find(value => value.ParameterName === 'Latitude').ParameterValue;
                return <MapInput value={{
                    latitude: latitude,
                    longitude: value
                }} onOK={this.onOkMapInput.bind(this)} />;
            case 'RelatedRole':
                value = value || [];
                // props.data['OriginalParameterValue'] = value.map(value => {
                //     return value.Path[value.Path.length - 1].ID
                // });
                return <RoleInput value={value} onChange={value => this.changeValue(value)} />;
            case 'OrgPicker':
                value = value || [];
                // props.data['OriginalParameterValue'] = value.map(value => {
                //     return value.Path[value.Path.length - 1].ID
                // });
                return <TreeInput value={value || []} onChange={value => this.changeValue(value)} />;
            case 'AreaPicker':
                return <TreeInput type='region_tree' value={value || []} onChange={value => this.changeValue(value)} />;

            case 'SystemDataNodePicker':
                return <TreeNode value={value} onChange={value => this.changeValue(value)} />;
            case 'CustomDataNodePicker':
                return <TreeNodeCustom value={value} onChange={value => this.changeValue(value)} />;
            default:
                return <Input value={value} onChange={this.onChangeInput.bind(this)} placeholder='' />;
        }
    }
}





interface ITextInputProps {
    template: DevicesTemplate
    data: NSDevices,

    defaultShow?: boolean,

};
interface ITextInputState {
};
export class TextInput extends React.Component<ITextInputProps, ITextInputState> {

    state = {
    }

    clickTarget: any

    public render(): JSX.Element {
        let { state, props } = this;
        let { template, data } = props;
        return (<SwitchText defaultShow={this.props.defaultShow}
            text={<ParameterText template={template} data={data} />}
            input={<TemplateInput template={template} data={data} onChange={() => {
                this.setState(this.state);
            }} />}
        />);
    }

}

/**
 * 对象转数组
 * 
 * @export
 * @param {{ [key: string]: any }} data
 * @returns {NSDevices[]}
 */
export function objectToArray(data: { [key: string]: any }): NSDevices[] {
    let array = [];
    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            let element = data[key];
            array.push({
                ParameterName: key,
                ParameterValue: element
            })
        }
    }
    return array
}

export function objectToArray2(data: { [key: string]: any }): NSDevices[] {
    let array = [];
    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            let element = data[key];
            array.push({
                ParameterName: key,
                ParameterValue: element,
                OriginalParameterValue: JSON.parse(JSON.stringify(element))
            })
        }
    }
    return array
}


/**
 * 数组转对象
 * 
 * @param {NSDevices[]} data
 * @returns {{ [key: string]: any }}
 */
export function arrayToObject(data: NSDevices[]): { [key: string]: any } {
    let obj = {};
    data.forEach(value => {
        obj[value.ParameterName] = value.ParameterValue;
    })
    return obj;
}




interface IRoleInputProps {
    value: { ID: string, Name: string }[]
    onChange: (value: { ID: string, Name: string }[]) => void
};
interface IRoleInputState { };
class RoleInput extends React.Component<IRoleInputProps, IRoleInputState> {

    state = {
        data: [],
        visible: false,
        value: this.props.value.map(value => value.ID)
    }

    async ajaxGet() {
        let { data } = await get('/sys/role_list', {
            pageSize: 100,
            pageIndex: 1
        });
        this.state.data = data.roleList;
        this.setState(this.state)
    }

    getPlainOptions() {
        return this.state.data.map(value => {
            return {
                label: value['Name'],
                value: value['ID']
            };
        });
    }

    onChange(value) {
        this.state.value = value;
        this.setState(this.state);
    }

    onDeselect() {
        console.log(1);
    }

    onClick() {
        this.state.value = this.props.value.map(value => value.ID);
        this.state.visible = true;
        this.setState(this.state);
    }

    onOk() {
        this.state.visible = false;
        this.setState(this.state);

        let newData = this.state.value.map(value => {
            return this.state.data.find(data => data.ID === value)
        })
        this.props.onChange(newData);
    }

    onDelClick(event, i) {
        this.props.onChange(this.props.value.filter((value, index) => index !== i));
        event.stopPropagation();
    }

    getName(value) {
        let obj = this.state.data.find(obj => obj.ID === value);
        return obj ? obj['Name'] : '';
    }

    public render(): JSX.Element {
        let { props, state } = this;

        return (<span >
            <div className='ant-select ant-select-enabled' style={{ width: '100%' }} onClick={this.onClick.bind(this)}>
                <div className='ant-select-selection  ant-select-selection--multiple'
                    role='combobox' aria-autocomplete='list' aria-haspopup='true' aria-expanded='false'>
                    <div className='ant-select-selection__rendered'>
                        <ul>
                            {this.props.value.map((value, index) => <li key={index} unselectable={true}
                                className='ant-select-selection__choice'
                                title='11' style={{ userSelect: 'none' }}>
                                <div className='ant-select-selection__choice__content'>
                                    {value.Name}
                                </div>
                                <span onClick={(e) => this.onDelClick(e, index)}
                                    className='ant-select-selection__choice__remove'></span>
                            </li>)}
                        </ul>
                    </div>
                </div>
            </div>

            <Modal title='请选择' visible={state.visible}
                onOk={this.onOk.bind(this)}
                onCancel={() => {
                    this.state.visible = false;
                    this.setState(this.state);
                }} >
                <CheckboxGroup options={this.getPlainOptions()}
                    value={this.state.value}
                    onChange={this.onChange.bind(this)} />
            </Modal>
        </span >);
    }

    /**
     * 组件渲染完毕获取ajax数据
     *
     *
     * @memberOf RoleInput
     */
    componentDidMount() {
        this.ajaxGet();
    }
}


interface ITreeInputProps {
    type?: string
    value: { Path: { ID: string, Name: string }[] }[]
    onChange: (value: { Path: { ID: string, Name: string }[] }[]) => void
};
interface ITreeInputState { };
class TreeInput extends React.Component<ITreeInputProps, ITreeInputState> {
    state = {
        data: [],
        visible: false,
        value: this.props.value
    }

    onOk() {
        this.state.visible = false;
        this.setState(this.state);
        this.props.onChange(this.state.value);
    }

    onClick() {
        this.state.value = Object.assign([], this.props.value);
        this.state.visible = true;
        this.setState(this.state);
    }

    onDelClick(event, i) {
        this.props.onChange(this.props.value.filter((value, index) => index !== i));
        event.stopPropagation();
    }


    getValueArray() {
        return this.props.value.map(value => {
            let obj = value.Path[value.Path.length - 1];
            return {
                id: obj.ID,
                name: obj.Name
            };
        });
    }


    onGetNode(value) {
        let obj = value.map(value => {
            return {
                Path: [{
                    ID: value.id,
                    Name: value.name
                }]
            }
        })
        this.state.value = obj as any;
    }

    public render(): JSX.Element {
        let { props, state } = this;
        return (<span >
            <div className='ant-select ant-select-enabled' style={{ width: '100%' }} onClick={this.onClick.bind(this)}>
                <div className='ant-select-selection  ant-select-selection--multiple'
                    role='combobox' aria-autocomplete='list' aria-haspopup='true' aria-expanded='false'>
                    <div className='ant-select-selection__rendered'>
                        <ul>
                            {this.props.value.map((value, index) => <li key={index} unselectable={true}
                                className='ant-select-selection__choice'
                                title='11' style={{ userSelect: 'none' }}>
                                <div className='ant-select-selection__choice__content'>
                                    {value.Path[value.Path.length - 1].Name}
                                </div>
                                <span onClick={(e) => this.onDelClick(e, index)}
                                    className='ant-select-selection__choice__remove'></span>
                            </li>)}
                        </ul>
                    </div>
                </div>
            </div>

            <Modal title='请选择' visible={state.visible}
                onOk={this.onOk.bind(this)}
                onCancel={() => {
                    this.state.visible = false;
                    this.setState(this.state);
                }} >
                <MyTreeSelect onGetNode={this.onGetNode.bind(this)}
                    treeType={this.props.type || 'department_tree'}
                    value={this.getValueArray()}
                    multiple={true} />
            </Modal>
        </span >);
    }
}


interface ITreeNodeProps {
    value: {
        DataModel: string,
        DataNode: string
    }
    onChange: (obj: {
        DataModel: string,
        DataNode: string
    }) => void
};
interface ITreeNodeState { };
class TreeNode extends React.Component<ITreeNodeProps, ITreeNodeState> {

    state = {
        data: this.props.value,
        visible: false,
        value: this.props.value
    }

    onDelClick(event) {
        this.props.onChange(null);
        event.stopPropagation();
    }

    onOk() {
        (this.refs['system'] as any).clearValue();
        this.state.visible = false;
        this.setState(this.state);
        this.props.onChange(this.state.value);
    }
    onClick() {

        this.state.value = Object.assign([], this.props.value);
        this.state.visible = true;
        this.setState(this.state);
    }

    onChange(value) {
        this.state.value = {
            DataModel: value.ModelName,
            DataNode: value.Name
        };
    }

    public render(): JSX.Element {
        let { props, state } = this;
        return (<span >
            <div className='ant-select ant-select-enabled' style={{ width: '100%' }} onClick={this.onClick.bind(this)}>
                <div className='ant-select-selection  ant-select-selection--multiple'
                    role='combobox' aria-autocomplete='list' aria-haspopup='true' aria-expanded='false'>
                    <div className='ant-select-selection__rendered'>
                        <ul>
                            {this.props.value &&
                                <li unselectable={true}
                                    className='ant-select-selection__choice'
                                    title='11' style={{ userSelect: 'none' }}>
                                    <div className='ant-select-selection__choice__content'>
                                        {this.props.value.DataNode}
                                    </div>
                                    <span onClick={(e) => this.onDelClick(e)}
                                        className='ant-select-selection__choice__remove'></span>
                                </li>
                            }
                        </ul>
                    </div>
                </div>
            </div>

            <Modal title='请选择' visible={state.visible}
                onOk={this.onOk.bind(this)}
                onCancel={() => {
                    (this.refs['system'] as any).clearValue();
                    this.state.visible = false;
                    this.setState(this.state);
                }} >
                <CheckTree ref='system'
                    type='system' defaultValue={props.value && {
                        ModelName: props.value.DataModel,
                        Name: props.value.DataNode
                    }} onChange={this.onChange.bind(this)} />
            </Modal>
        </span >);
    }
}



interface ITreeNodeState { };
class TreeNodeCustom extends React.Component<ITreeNodeProps, ITreeNodeState> {

    state = {
        data: this.props.value,
        visible: false,
        value: this.props.value
    }

    onDelClick(event) {
        this.props.onChange(null);
        event.stopPropagation();
    }

    onOk() {
        (this.refs['system'] as any).clearValue();
        if (this.refs['custom']) {
            (this.refs['custom'] as any).clearValue();
        }
        this.state.visible = false;
        this.setState(this.state);
        this.props.onChange(this.state.value);
    }
    onClick() {
        this.state.value = Object.assign([], this.props.value);
        this.state.visible = true;
        this.setState(this.state);
    }

    onChange(value) {
        this.state.value = {
            DataModel: value.ModelName,
            DataNode: value.Name
        };
    }


    public render(): JSX.Element {
        let { props, state } = this;
        return (<span >
            <div className='ant-select ant-select-enabled' style={{ width: '100%' }} onClick={this.onClick.bind(this)}>
                <div className='ant-select-selection  ant-select-selection--multiple'
                    role='combobox' aria-autocomplete='list' aria-haspopup='true' aria-expanded='false'>
                    <div className='ant-select-selection__rendered'>
                        <ul>
                            {this.props.value &&
                                <li unselectable={true}
                                    className='ant-select-selection__choice'
                                    title='11' style={{ userSelect: 'none' }}>
                                    <div className='ant-select-selection__choice__content'>
                                        {this.props.value.DataNode}
                                    </div>
                                    <span onClick={(e) => this.onDelClick(e)}
                                        className='ant-select-selection__choice__remove'></span>
                                </li>
                            }
                        </ul>
                    </div>
                </div>
            </div>

            <Modal title='请选择' visible={state.visible}
                onOk={this.onOk.bind(this)}
                onCancel={() => {
                    (this.refs['system'] as any).clearValue();
                    if (this.refs['custom']) {
                        (this.refs['custom'] as any).clearValue();
                    }
                    this.state.visible = false;
                    this.setState(this.state);
                }} >
                <Tabs type='card'>
                    <TabPane tab='系统' key='1'>
                        <CheckTree ref='system'
                            type='system' defaultValue={props.value && {
                                ModelName: this.props.value.DataModel,
                                Name: this.props.value.DataNode
                            }} onChange={this.onChange.bind(this)} />
                    </TabPane>
                    <TabPane tab='用户' key='2'>
                        <CheckTree ref='custom'
                            type='custom' defaultValue={props.value && {
                                ModelName: this.props.value.DataModel,
                                Name: this.props.value.DataNode
                            }} onChange={this.onChange.bind(this)} />
                    </TabPane>
                </Tabs>
            </Modal>
        </span >);
    }
}
