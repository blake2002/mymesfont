import * as React from 'react';
export { React };
import { Link } from 'react-router';
import { PageGenerics } from '../../../components/global/components';
import {
    Menu, Button, Switch, message, Table,
    Pagination, ModalSlip, Modal, Tabs, TabPane
} from '../../../components/antd/index';
import { post, get } from '../../../components/ajax/index';

import globalValue from '../../../components/global/value';
import { Nav as NavBase } from '../../_main';
import Tree, { Level, TreeData } from './_tree';
import TemplateTable from '../../../components/template-table/index';
import { objectToArray, arrayToObject } from '../../../components/template-input/index';

import Updata from './_update';
import Variable from '../../device/device/add/_variable';
import { uuid } from '../../../components/util/index';
import { TextInput, ParameterText } from '../../../components/template-input/index';

import './index.css';

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
        tabKey: string,

        treeType: 'system' | 'custom',
        treeData: TreeData

        contentType: 'index' | 'update' | 'runtime'
    } = {
        name: this.props.query.name,
        modelName: this.props.query.modelName,
        tabKey: '1',

        treeType: 'system',
        treeData: {} as any,

        contentType: 'index'
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
        this.props.jump('/model/system/cluster');
    }

    navRender() {
        return <Tabs type='card'
            activeKey={this.state.tabKey}
            onChange={this.onChangeTabs.bind(this)}
            tabBarExtraContent={this.menuRender()}
        >
            <TabPane tab='设计时' key='1'>
            </TabPane>
            <TabPane tab='运行时' key='2'>
            </TabPane>
        </Tabs>
    }

    menuRender() {
        let level = this.state.treeData.level;
        if (level === 'level2' || level === 'level3+') {
            return <section>
                <Button className='ml20'
                    onClick={() => {
                        (this.refs['NodeContent'] as any).add();
                    }}>新增属性</Button>
                <Button className='ml20'
                    onClick={() => {
                        (this.refs['NodeContent'] as any).moveUp();
                    }}>上移</Button>
                <Button className='ml20'
                    onClick={() => {
                        (this.refs['NodeContent'] as any).moveDown();
                    }}>下移</Button>
                <Button className='ml20'
                    type='primary' onClick={() => {
                        (this.refs['NodeContent'] as any).ajaxUpdate();
                    }}>保存</Button>
            </section>;
        }
    }

    treeOnClick(name: string, modelName: string, data: TreeData) {
        this.state.modelName = modelName;
        this.state.name = name;
        this.state.treeData = data;
        this.setStateMerge();
    }

    renderMainLeft() {
        let disabled = this.state.contentType === 'index';
        return (<section className='main-left'>
            <section className='main-left-content'>
                <Tabs type='card' activeKey={this.state.treeType} onChange={(key) => {
                    this.state.treeType = key as any;
                    this.setStateMerge();
                }}>
                    <TabPane tab='系统模型' key='system'>
                        <section className='tabpane-content'>
                            <Tree disabled={!disabled}
                                ref='systemTree'
                                onClick={this.treeOnClick.bind(this)}
                                type='system'
                            ></Tree>
                        </section>
                    </TabPane>
                    <TabPane tab='用户模型' key='custom'>
                        <section className='tabpane-content'>
                            <Tree disabled={!disabled}
                                ref='customTree'
                                onClick={this.treeOnClick.bind(this)}
                                type='custom'
                            ></Tree>
                        </section>
                    </TabPane>
                </Tabs>
            </section>
        </section >);
    }

    /**
     * 头部标题渲染
     * 
     * @returns
     * 
     * @memberOf MainRightContent
     */
    contentRender() {
        let { state } = this;
        switch (state.treeData.level) {
            case 'model':
                return <ModelContent
                    onUpdataClick={() => this.changeContent('update')}
                    modelName={this.state.modelName} />;
            case 'level2':
                if (state.name && state.modelName) {
                    return <NodeContent
                        onNodeClick={this.onNodeClick.bind(this)}
                        ref='NodeContent'
                        onUpdataClick={() => this.changeContent('update')}
                        name={this.state.name} modelName={this.state.modelName} />;
                }
                return;
            case 'level3+':
                if (state.name && state.modelName) {
                    return <NodeContent
                        ref='NodeContent'
                        onNodeClick={this.onNodeClick.bind(this)}
                        onUpdataClick={() => this.changeContent('update')}
                        name={this.state.name} modelName={this.state.modelName} />;
                }
                return;
            default:
                break;
        }
    }

    onNodeClick(modelName: string, name: string, ModelType: any) {
        if (ModelType === 'custom') {
            this.state.treeType = ModelType;
            (this.refs['customTree'] as any).onNodeClick(modelName, name);
        } else {
            this.state.treeType = ModelType;
            (this.refs['systemTree'] as any).onNodeClick(modelName, name);
        }
    }


    changeContent(value) {
        this.state.contentType = value;
        this.setStateMerge();
    }

    renderList() {
        return <section className='main-right'>
            {this.navRender()}
            <section className='main-right-content'>
                <section className='main-right-content-box'>
                    {this.contentRender()}
                </section>
            </section>
        </section>;
    }

    renderContent() {
        let { state, props } = this;
        switch (this.state.contentType) {
            case 'update':
                if (this.state.modelName || this.state.name) {
                    return <Updata
                        type={state.treeType}
                        name={state.name}
                        modelName={state.modelName}
                        data={state.treeData}
                        onReturn={(name) => {
                            state.contentType = 'index';

                            if (state.name) {
                                state.name = name || state.name;
                                this.state.treeData['Name'] = name || state.name;
                            } else {
                                state.modelName = name || state.name;
                                this.state.treeData['ModelName'] = name || state.name;
                            }
                            this.setStateMerge();
                        }} />
                }
                break;
            default:
                return this.renderList();
        }
    }

    public render(): JSX.Element {
        let { state, props } = this;
        return <section className='h100 page-model'>
            {this.renderMainLeft()}
            {this.renderContent()}
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
    modelName: string
    name: string
    onUpdataClick: () => void
    onNodeClick: (modelName: string, name: string, type: string) => void
};
interface INodeContentState { };
class NodeContent extends React.Component<INodeContentProps, INodeContentState> {
    state = {
        data: {
            Description: '',
            Name: '',
            RelatedDataNode: { DataModel: '', DataNode: '', ModelType: '' },
            IsEmbeded: '',
            IsRecursive: ''
        },
        dataArray: [],
        template: [],
        loading: true
    }

    async ajaxGetData() {
        let { data } = await get('/model_node_detail', {
            modelName: this.props.modelName,
            nodeName: this.props.name
        });

        this.state.data = data['Model'];
        this.state.dataArray = objectToArray(this.state.data);

        this.state.dataArray.find(value => {
            if (value.ParameterName === 'RelatedDataNode') {
                value.ParameterModelValue = JSON.parse(JSON.stringify(value.ParameterValue));
                return true;
            }
        })

        this.state.loading = false;
        this.setState(this.state);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.modelName !== nextProps.modelName || this.props.name !== nextProps.name) {
            this.props = nextProps;
            this.state.loading = true;
            this.ajaxGetData();
        }
    }

    add() {
        this.refs['ModelNodeProperty']['add']();
    }
    moveUp() {
        this.refs['ModelNodeProperty']['moveUp']();
    }
    moveDown() {
        this.refs['ModelNodeProperty']['moveDown']();
    }
    ajaxUpdate() {
        this.refs['ModelNodeProperty']['ajaxUpdate']();
    }

    public render(): JSX.Element {
        let { props, state } = this;
        let { data } = state;

        let nodeLink = <a onClick={() => {
            props.onNodeClick(data.RelatedDataNode.DataModel, data.RelatedDataNode.DataNode,
                data.RelatedDataNode.ModelType);
        }}>
            {data.RelatedDataNode && data.RelatedDataNode.DataModel + ',' + data.RelatedDataNode.DataNode}
        </a>

        return (
            <section>
                <section className='main-right-title'>
                    <h3>
                        {data.Name}
                        <span className='ml10'>{data.Description}</span>
                        <span className='ml40'>自递归:{data.IsRecursive === 'true' ? '是' : '否'}</span>
                        <span className='ml40'>嵌入式:{data.IsEmbeded === 'true' ? '是' : '否'}</span>
                        <span className='ml40'>引用节点:{nodeLink}</span>
                    </h3>
                    <div className='cf'>
                        <span className='fl'>
                            <a onClick={() => this.props.onUpdataClick()}>修改</a>
                        </span>
                        <div className='fr'>

                        </div>
                    </div>
                </section>
                <section className='mt20'>
                    {!state.loading &&
                        <TableContent ref='ModelNodeProperty'
                            categroy='ModelNodeProperty'
                            showText='Name' name={props.name} modelName={props.modelName} />
                    }
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

export class TableContent extends Variable {
    async ajaxGetDate(categroy: string) {

        let nodeTemplate = await get('/model_property_template');
        this.state.template = nodeTemplate.data.ModelTemplate.Props;

        let { data } = await get('/model_node_property', {
            modelName: this.props.modelName,
            nodeName: this.props.name
        })

        let rData: any = data['ModelNodeProperty'];

        rData.forEach((value, index) => {
            this.state.template.forEach((templateValue, index) => {
                if (!value[templateValue.Name]) {
                    value[templateValue.Name] = '';
                }
            })
            for (let key in value) {
                if (value.hasOwnProperty(key)) {
                    let element = value[key];
                    value[key] = {
                        ParameterName: key,
                        ParameterValue: element
                    }
                }
            }
            value.key = uuid();
        })
        return rData;
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.modelName !== nextProps.modelName || this.props.name !== nextProps.name) {
            this.props = nextProps;
            this.componentWillMount();
        }
    }

    async getData(categroy?: string) {
        this.state.loading = true;
        this.setState(this.state);
        let data = await this.ajaxGetDate(this.props.categroy)
        this.state.loading = false;
        // this.state.data = [data[this.props.categroy][0]];

        this.state.data = data;
        this.state._ID = data._ID;
        this.saveColums();
        this.setState(this.state);
    }

    moveUp() {
        let { state, props } = this;
        let selectedData = state.data[state.selectedIndex];
        let nextData = state.data[state.selectedIndex - 1];

        if (nextData) {
            state.data[state.selectedIndex] = nextData;
            state.data[state.selectedIndex - 1] = selectedData;

            state.selectedIndex--;
            this.setState(this.state);
        }
    }

    moveDown() {
        let { state, props } = this;
        let selectedData = state.data[state.selectedIndex];
        let nextData = state.data[state.selectedIndex + 1];

        if (nextData) {
            state.data[state.selectedIndex] = nextData;
            state.data[state.selectedIndex + 1] = selectedData;

            state.selectedIndex++;
            this.setState(this.state);
        }
    }

    async ajaxUpdate() {
        let updateList = [];

        this.state.data.forEach(value => {
            let obj = {};
            if (!value.isRelatedProperty) {
                for (let key in value) {
                    let element = value[key];
                    delete element['_stateType'];
                    if (key !== 'key') {
                        obj[key] = element.ParameterValue;
                    }
                }
                updateList.push(obj);
            }
        });

        await post('/upsert_model_node_property', {
            modelName: this.props.modelName,
            nodeName: this.props.name,
            props: updateList
        });

        this.componentWillMount();
        message.success('保存成功!');
    }

    selectRender() {
        return <section>
            <ul className='ul-details'>
                {this.state.selectedRows.map((data, index) => {
                    return <li key={index}>{data[this.props.showText].ParameterValue}</li>;
                })}
            </ul>
            <section className='component-slip-footer'>
                <Button privileges={this.props.privileges + ':remove'} onClick={() => {
                    this.onDelete(this.state.selectedRows);
                }}>删除</Button>
            </section>
        </section >;
    }

    rowSelection() {
        return {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.selectChange.bind(this),
            getCheckboxProps: record => ({
                disabled: record.isRelatedProperty
            })
        };
    }


    renderText(template) {
        return (data: any, value, index) => {
            if (data) {
                if (value.isRelatedProperty) {
                    return <ParameterText template={template} data={data}></ParameterText>;
                }

                if (this.banArray.indexOf(data.ParameterName) === -1) {
                    return <TextInput template={template} data={data}
                        defaultShow={data._stateType === 'add' ? true : false} />;
                } else {
                    return <ParameterText template={template} data={data}></ParameterText>;
                }
            } else {
                return <span>没有值</span>
            }
        };
    }

}



interface IModelContentProps {
    modelName: string
    onUpdataClick: () => void
};
interface IModelContentState { };
class ModelContent extends React.Component<IModelContentProps, IModelContentState> {

    state = {
        data: {
            DataSourceType: '',
            Description: '',
            MODELUPDATED: false,
            Name: ''
        },
        dataArray: []
    }

    async ajaxGetData() {
        let { data } = await get('/model_detail', {
            modelName: this.props.modelName
        });
        this.state.data = data['Model'];
        this.state.dataArray = objectToArray(this.state.data);
        this.setState(this.state);
    }

    async ajaxPublish() {
        await post('/publish_model', {
            modelName: this.props.modelName
        });
        this.setState(this.state);
        message.success('发布成功!');
    }

    public render(): JSX.Element {
        let { props, state } = this;
        let { data } = state;
        return (
            <section>
                <section className='main-right-title'>
                    <h3>
                        {data.Name}
                        <span className='ml10'>{data.Description}</span>
                        <span className='ml40'>数据源类型:{data.DataSourceType}</span>
                        <span className='ml40'>数据源:{data.MODELUPDATED}</span>
                    </h3>
                    <div className='cf'>
                        <span className='fl'>
                            <a onClick={() => this.props.onUpdataClick()}>修改</a>
                            <a className='ml10' onClick={this.ajaxPublish.bind(this)}>发布</a>
                        </span>
                        <div className='fr'>

                        </div>
                    </div>
                </section>
            </section >
        );
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.modelName !== nextProps.modelName) {
            this.props = nextProps;
            this.ajaxGetData();
        }
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


