import * as React from 'react';
export { React };
import { Link } from 'react-router';
import { PageGenerics } from '../../../components/global/components';
import {
    Menu, Button, Switch, message, Table,
    Pagination, ModalSlip, Modal, Tabs, TabPane, Upload
} from '../../../components/antd/index';
import { post, get } from '../../../components/ajax/index';

import globalValue from '../../../components/global/value';
import { Nav as NavBase } from '../../_main';
import Tree, { TreeData, getParentString } from './_tree';
import TemplateTable from '../../../components/template-table/index';
import { objectToArray, arrayToObject } from '../../../components/template-input/index';
import { notification } from '../../../components/antd/index';
let errorMsg = notification.error;
import Variable from '../../device/device/add/_variable';
import { uuid } from '../../../components/util/index';
import { ajax as config } from '../../../components/global/config';
import '../../model/system/index.css';

/**
 * 页面权限
 *
 */
export let privileges = '/device/devices/add';


interface IDeviceProps {
    name: string
    modelName: string
};

interface IDeviceState {

};


/**
 * 设备管理页面
 * 
 * @export
 * @class Device
 * @extends {PageGenerics<IDeviceProps, IDeviceState>}
 */
export default class Device extends PageGenerics<IDeviceProps, IDeviceState> {

    state: {
        name: string,
        modelName: string,

        treeType: 'system' | 'custom',
        treeData: TreeData

        contentType: 'index' | 'runtime'

        Id: string
    } = {
        name: this.props.query.name,
        modelName: this.props.query.modelName,

        treeType: 'system',
        treeData: {} as any,

        contentType: 'index',
        Id: null
    }

    columns = [{
        title: '设备编号',
        dataIndex: 'DeviceID',
        key: '1'
    }, {
        width: '150px',
        title: '实时数据库',
        dataIndex: 'RTDBID',
        key: '2'
    }, {
        width: '150px',
        title: '设备名称',
        dataIndex: 'DeviceName',
        key: '3'
    }, {
        width: '25%',
        title: '设备型号',
        dataIndex: 'DeviceType',
        key: '4'
    }, {
        width: '100px',
        title: '启用/禁用',
        dataIndex: 'Enable',
        key: '5'
    }]

    getType() {
        if (this.state.modelName && this.state.name) {
            return 'node';
        } else if (this.state.modelName) {
            return 'model';
        }
    }


    onChangeTabs(key) {
        this.state.contentType = key
        this.setState(this.state);
    }

    navRender() {
        return <Tabs type='card'
            activeKey={this.state.contentType}
            onChange={this.onChangeTabs.bind(this)}
            tabBarExtraContent={this.menuRender()}
        >
            <TabPane tab='设计时' key='index'>
            </TabPane>
            <TabPane tab='运行时' key='runtime'>
            </TabPane>
        </Tabs>
    }

    getUpload() {
        return {
            path: getParentString(this.state.treeData),
            dirId: this.state.treeData.Id,
            token: localStorage.getItem('token'),
            userId: localStorage.getItem('userId')
        }
    }

    uploadOnChange(e) {
        // console.log(e);
        let file = e.file;
        if (file.status === 'done') {
            if (file.response.code !== 0) {
                errorMsg({
                    message: `请求错误!`,
                    description: <div>
                        <p>错误码:{file.response.code}</p>
                        <p>错误信息:{file.response.data.msg}</p>
                    </div>
                });
            } else {
                (this.refs['NodeContent'] as any).componentDidMount()
            }
        }


    }

    menuRender() {
        if (this.state.contentType === 'index') {
            return <section>
                <span className='fl'>
                    <Upload action={config.requestUrl + '/report_upload'}
                        data={this.getUpload.bind(this)}
                        onChange={this.uploadOnChange.bind(this)}
                        showUploadList={false}
                    >
                        <Button className='ml20'
                        >新增报表</Button>
                    </Upload>
                </span>
            </section>;
        }
    }

    treeOnClick(data: TreeData) {
        this.state.treeData = data;
        this.setStateMerge();
    }


    renderMainLeft() {
        return (<section className='main-left'>
            <section className='main-left-content'>
                <Tabs type='card' defaultActiveKey='system'>
                    <TabPane tab='服务端列表' key='system'>
                        <section className='tabpane-content'>
                            <Tree onClick={this.treeOnClick.bind(this)}
                            ></Tree>
                        </section>
                    </TabPane>
                </Tabs>
            </section>
        </section >);
    }


    changeContent(value) {
        this.state.contentType = value;
        this.setStateMerge();
    }

    renderContent() {
        if (this.state.contentType === 'index') {
            return <NodeContent Id={this.state.treeData.Id}></NodeContent>;
        } else {
            return <Content Id={this.state.treeData.Id}></Content>;
        }
    }

    renderList() {
        return <section className='main-right'>
            {this.navRender()}
            <section className='main-right-content'>
                <section className='main-right-content-box'>
                    {this.state.treeData.Id && this.renderContent()}
                </section>
            </section>
        </section>;
    }

    public render(): JSX.Element {
        let { state, props } = this;
        return <section className='h100 page-model'>
            {this.renderMainLeft()}
            {this.renderList()}
        </section>;
    }

    /**
     * 组件渲染完毕获取ajax数据
     *
     *
     * @memberOf Device
     */
    componentDidMount() {

    }
}


interface INodeContentProps {
    Id: string
};
interface INodeContentState { };
class NodeContent extends React.Component<INodeContentProps, INodeContentState> {
    state = {
        data: [],
        loading: true
    }


    columns = [{
        title: '报表名',
        dataIndex: 'RptName',
        key: 'RptName'
    }, {
        title: '上传人',
        dataIndex: 'UploadPerson',
        key: 'UploadPerson'
    }, {
        title: '上传时间',
        dataIndex: 'UploadTime',
        key: 'UploadTime'
    }]

    async ajaxGetData() {
        this.state.loading = true;
        let { data } = await post('/report_designtime_list', {
            id: this.props.Id
        });

        this.state.data = data['list'];
        this.state.loading = false;
        this.setState(this.state);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.Id !== nextProps.Id) {
            this.props = nextProps;
            this.ajaxGetData();
        }
    }


    public render(): JSX.Element {
        let { props, state } = this;
        let { data } = state;
        return (
            <section>
                <section className='mt20'>
                    <Table columns={this.columns} pagination={false} dataSource={this.state.data}></Table>
                </section>
            </section >
        );
    }


    /**
     * 组件渲染完毕获取ajax数据
     *
     *
     * @memberOf Device
     */
    componentDidMount() {
        this.ajaxGetData();
    }
}



class Content extends NodeContent {
    columns = [{
        title: '报表名',
        dataIndex: 'RptName',
        key: 'RptName'
    }, {
        title: '查询次数',
        dataIndex: 'QueryCount',
        key: 'QueryCount'
    }, {
        title: '导出次数',
        dataIndex: 'ExportCount',
        key: 'ExportCount'
    }, {
        title: '最近一次查询人',
        dataIndex: 'LastQeuryPerson',
        key: 'LastQeuryPerson'
    }, {
        title: '最近一次查询时间',
        dataIndex: 'LastQueryTime',
        key: 'LastQueryTime'
    }]

    async ajaxGetData() {
        let { data } = await post('/report_runtime_list', {
            id: this.props.Id
        });

        this.state.data = data['list'];
        this.state.loading = false;
        this.setState(this.state);
    }
}