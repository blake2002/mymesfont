import * as React from 'react';
import { PureComponentGenerics } from '../../../components/global/components';
import { Button, Dropdown, Menu, message, Modal, CheckboxGroup } from '../../../components/antd/index';
import { Link } from 'react-router';
import { DeviceData, NSDevices, ParameterConfig, NSDevicesCommunicateParameter, DevicesTemplate } from './types';
import { post, get } from '../../../components/ajax/index';
import { DeviceDataOperation, ParameterText, objectToArray } from '../../../components/template-input/index';
import { MyTreeSelect } from '../selectTree/selectTree';
import Privileges, { havePrivileges } from '../../../components/privileges/index';


interface IDeviceDriveProps {
    id: string
    regionId: string
    onChange: (value?: DeviceData) => void
    query: any
}
interface IDeviceDriveState {
    data: DeviceData
    treeVisible: boolean
    tagModalVisible: boolean
    tagList: { value: string, label: string }[]
    selectTagList: string[],
    treeSelectId: string
};
/**
 * 设备详情页面
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
        },
        tagList: [],
        treeVisible: false,
        tagModalVisible: false,
        selectTagList: [],
        treeSelectId: ''
    }
    deviceDataOperation: DeviceDataOperation = new DeviceDataOperation(
        'NSDevices', this.props.id, this.state.data.NSDevices, this.state.data.NSDevicesTemplate.Props);
    treeType: any = 'region_tree'

    menu = <Menu onClick={this.menuClick.bind(this)}>
        <Menu.Item key='addTag'>
            添加标签
        </Menu.Item>
        <Menu.Item key='move'>
            移动
        </Menu.Item>
        <Menu.Item key='delete'>
            删除
        </Menu.Item>
    </Menu>
    ignoreList = ['DeviceID', 'DeviceName']
    treeTitle = '区域架构'

    menuClick({ key }) {
        switch (key) {
            case 'delete':
                Modal.confirm({
                    title: '删除',
                    content: '确定删除?',
                    onOk: () => {
                        this.ajaxDelete();
                    }
                });
                break;
            case 'addTag':
                this.ajaxGetTag();
                this.state.tagModalVisible = true;
                this.setState(this.state);
                break;
            case 'move':
                this.state.treeVisible = true;
                this.setState(this.state);
                break;
            default:
                break;
        }
    }

    async ajaxConcern(bl = true) {
        let ajaxUrl = bl ? '/concern_device' : '/unconcern_device'

        if (bl) {
            await post(ajaxUrl, {
                deviceId: this.props.id
            });
        } else {
            await post(ajaxUrl, {
                deviceIds: [this.props.id]
            });
        }

        let msg = bl ? '关注成功！' : '取消关注成功！';
        this.componentWillMount();
        message.success(msg);
    }

    async getData() {
        let { data } = await get('/device_detail', {
            deviceId: this.props.id,
            categroy: 'NSDevices'
        });

        data.NSDevices = objectToArray(data.NSDevices);
        this.state.data = data;

        this.deviceDataOperation = new DeviceDataOperation(
            'NSDevices', this.props.id, this.state.data.NSDevices,
            this.state.data.NSDevicesTemplate.Props);
        this.setState(this.state);
    }

    componentWillMount() {
        this.getData();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.id !== nextProps.id) {
            this.props = nextProps;
            this.componentWillMount();
        }
    }

    getTemplate(value: NSDevices) {
        let { NSDevicesTemplate } = this.state.data;
        let { Props } = NSDevicesTemplate;

        return Props.find(data => data.Name === value.ParameterName);
    }

    /**
     * 是否显示
     * 
     * @param {DevicesTemplate} template
     * @returns
     * 
     * @memberOf DeviceDrive
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
     * 根据模版找值
     * 
     * @param {NSDevices} value
     * @returns
     * 
     * @memberOf AddInformation
     */
    getValueByTemplate(template) {
        let { NSDevices } = this.state.data;
        return NSDevices.find(data => data.ParameterName === template.Name);
    }


    listRender() {
        return this.state.data.NSDevicesTemplate.Props.map((template, index) => {
            let value = this.getValueByTemplate(template);
            let bl = this.isShow(template);
            if (bl && this.ignoreList.indexOf(template.Name) === -1) {
                return <tr key={index}>
                    {
                        template.Name === 'Longitude' ?
                            <th>经纬度</th> :
                            <th>{template.Description}</th>
                    }
                    <td>
                        <ParameterText data={value} template={template} dataList={this.state.data.NSDevices} />
                    </td>
                </tr>
            }
        });
    }


    /**
     * 获取值
     * 
     * @param {string} key
     * @returns
     * 
     * @memberOf DeviceDrive
     */
    getValue(key: string) {
        return this.deviceDataOperation.getValue(key);
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
        return this.deviceDataOperation.update(key, value);
    }


    enableChange(bl: boolean = true) {
        this.update('Enable', bl.toString());
        this.ajaxUpdate();
    }

    topChange(bl: '0' | '1') {
        this.update('Top', bl);
        this.ajaxUpdate();
    }

    async ajaxUpdate() {

        console.log(this.deviceDataOperation.getUpdate());

        let { data } = await post('/modified_device', {
            deviceId: this.props.id,
            props: {
                NSDevices: this.deviceDataOperation.getUpdate()
            }
        });
        this.props.onChange();
        // this.setState(this.state);
        message.success('修改成功！')
    }

    async ajaxDelete() {
        await post('/delete_device', {
            deviceIds: [this.props.id]
        });
        this.props.onChange();
        message.success('删除成功！')
    }

    getRegionPath() {
        let str = '';

        if (!this.state.data.NSDevices.length) {
            return str;
        }

        let arr: {
            Name: string
        }[] = (this.state.data.NSDevices.find(value => value.ParameterName === 'RegionPath'
            || value.ParameterName === 'DepartmentPath')
            .ParameterValue[0] as any).Path;

        arr.forEach(value => {
            str += value.Name + '-';
        });

        str = str.replace(/\-$/g, '');

        return str;
    }

    renderFooter() {
        let { props, state } = this;
        return <section className='component-slip-footer'>
            {
                (this.getValue('Top') === '0') || (this.getValue('Top') == null) ?
                    <Button onClick={() => this.topChange('1')}>置顶</Button> :
                    <Button onClick={() => this.topChange('0')}>取消置顶</Button>
            }

            <Privileges value='/device/devices:modify'>
                <Link to={{
                    pathname: '/device/device/update',
                    query: { ...props.query, DeviceID: props.id }
                }} ><Button>修改</Button></Link>
            </Privileges>

            <Privileges value='/device/devices:enable'>
                {this.getValue('Enable') === 'true' ?
                    <Button onClick={() => this.enableChange(false)}>禁用</Button> :
                    <Button onClick={() => this.enableChange(true)}>启动</Button>}
            </Privileges>

            <Dropdown overlay={this.menu}><Button>更多</Button></Dropdown>
        </section>;
    }

    renderTitle() {
        return <h4>
            <p>{this.getValue('DeviceName')}</p>
            <p>{this.getValue('DeviceID')}</p>
        </h4>;
    }


    tagListOnChange(e) {
        this.state.selectTagList = e;
    }

    async ajaxGetTag() {
        let { data } = await get('/tag_list', {
            category: 'device',
            pageIndex: 1,
            pageSize: 10
        });

        this.state.tagList = [];
        data.TagList.forEach(value => {
            this.state.tagList.push({
                label: value['Name'],
                value: value['Name']
            })
        });

        this.setState(this.state);
    }

    async onTagOk() {
        let { data } = await post('/tag_device', {
            deviceIds: [this.props.id],
            tagNames: this.state.selectTagList
        });

        this.state.tagModalVisible = false;
        this.setState(this.state);
        message.success('添加成功！');
    }

    renderTagList() {
        return <Modal visible={this.state.tagModalVisible} title={'添加标签'}
            onOk={this.onTagOk.bind(this)}
            onCancel={() => {
                this.state.tagModalVisible = false;
                this.setState(this.state);
            }}>
            <CheckboxGroup options={this.state.tagList}
                onChange={this.tagListOnChange.bind(this)} />
        </Modal>;
    }


    onGetNode(obj) {
        this.state.treeSelectId = obj[0].id;
    }


    async ajaxMoveDevice(idArray) {
        await post('/move_device', {
            deviceIds: idArray,
            newCompanyId: this.state.treeSelectId
        });
        this.state.treeVisible = false;
        message.success('移动成功！');
    }

    async onOkTree() {
        await this.ajaxMoveDevice([this.props.id]);
        this.props.onChange();
    }

    renderTree() {
        return <Modal
            onOk={this.onOkTree.bind(this)}
            visible={this.state.treeVisible} title={'移动'} onCancel={() => {
                this.state.treeVisible = false;
                this.setState(this.state);
            }}>
            <MyTreeSelect
                jurisdiction='only'
                onGetNode={this.onGetNode.bind(this)} treeType={this.treeType} />
        </Modal>;
    }

    renderRegion() {
        if (!this.state.data.NSDevices.length) {
            return '';
        }

        let arr: {
            Name: string,
            ID: string
        }[] = (this.state.data.NSDevices.find(value => value.ParameterName === 'RegionPath'
            || value.ParameterName === 'DepartmentPath')
            .ParameterValue[0] as any).Path;
        let linkTo = arr[arr.length - 1].ID;

        return <tr>
            <th>{this.treeTitle}</th>
            <td><Link to={'/device/device/index?regionId=' + linkTo}>{
                this.getRegionPath()
            }</Link></td>
        </tr >;
    }
    public render(): JSX.Element {
        let { props, state } = this;
        let { data } = state;

        let objConcerned = this.getValue('Concerned');
        return (<section className='device-details'>
            {
                objConcerned && (objConcerned === 'False' ?
                    <Button onClick={() => this.ajaxConcern(true)} className='btn-position'>关注</Button> :
                    <Button onClick={() => this.ajaxConcern(false)} className='btn-position'>取消关注</Button>)
            }

            {this.renderTitle()}
            <table className='table-details'>
                <tbody>
                    {this.listRender()}
                    {this.renderRegion()}
                </tbody>
            </table>
            {this.renderFooter()}
            {this.renderTagList()}
            {this.renderTree()}
        </section >);
    }
}


        // post('/new_tag', {
        //     tagName: '核弹制造机'
        // });