import * as React from 'react';
import { PageGenerics } from '../../../components/global/components';
import { post, get } from '../../../components/ajax/index';
import TemplateTable from '../../../components/template-table/index';
import { objectToArray, arrayToObject, DeviceDataOperation } from '../../../components/template-input/index';
import {
    Menu, Button, Switch, message, Table,
    Pagination, ModalSlip, Modal, Tabs, TabPane
} from '../../../components/antd/index';
import Tree from './_tree';
import globalValue from '../../../components/global/value';

import './index.css';
import { TreeData } from './_tree';
import Variable from '../../device/device/add/_variable';
import { uuid } from '../../../components/util/index';

/**
 * 页面权限
 *
 */
export let privileges = '/device/devices/add';

interface IDeviceProps {
    type: string,
    modelName: string,
    name: string
    data: TreeData
    onReturn: (name: string) => void
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
export default class Device extends React.Component<IDeviceProps, IDeviceState> {
    state = {
        data: [],
        name: null,
        template: [],
        activeKey: '1'
    }

    async ajaxGetData() {
        if (this.props.data.level !== 'model') {

            let temUrl = this.props.type === 'system' ? '/system_model_node_template' : '/custom_model_node_template';
            let { data } = await get(temUrl, {
                modelName: this.props.modelName
            });
            this.state.template = data.ModelTemplate.Props.filter(value => value.Name !== 'Index');
            let detailData = await get('/model_node_detail', {
                modelName: this.props.modelName,
                nodeName: this.props.name
            });
            this.state.data = objectToArray(detailData.data.Model);

            this.setState(this.state);

        } else {
            let { data } = await get('/model_template');
            this.state.template = data.ModelTemplate.Props
            let detailData = await get('/model_detail', {
                modelName: this.props.modelName
            });
            this.state.data = objectToArray(detailData.data.Model);
            this.setState(this.state);
        }
    }



    async ajaxSave() {
        let newName = this.state.data.find(value => value.ParameterName === 'Name').ParameterValue;
        if (this.props.data.level === 'model') {
            await post('/modify_model', {
                modelName: this.props.modelName,
                props: {
                    Models: this.state.data
                }
            });
            if (newName !== this.props.modelName) {
                // location.reload();
                this.state.name = newName;
            }
        } else {
            await post('/modify_model_node', {
                nodeName: this.props.name,
                modelName: this.props.modelName,
                props: {
                    ModelNodes: this.state.data
                }
            });
            if (newName !== this.props.name) {
                // location.reload();
                this.state.name = newName;
            }
        }

        message.success('修改成功！');
    }

    tabBarExtraContentRender() {
        if (this.state.activeKey === '1') {
            return <Button privileges='/department/users/update:save'
                className='ml20' type='primary' onClick={this.ajaxSave.bind(this)}>保存</Button>;
        } else {
            return <span>
                <Button className='ml20'
                    onClick={() => {
                        (this.refs['content'] as any).modalShow();
                    }}>新增索引</Button>
                <Button className='ml20'
                    type='primary' onClick={() => {
                        (this.refs['content'] as any).ajaxUpdate();
                    }}>保存</Button>
            </span>
        }
    }

    render() {
        let { state, props } = this;
        return <section className='main-right'>
            <section className='main-right-tabs'>
                <div className='main-right-tabs-left ml20 mr20'>
                    <Button onClick={() => this.props.onReturn(state.name)}>
                        返回
                    </Button>
                </div>
                <Tabs activeKey={this.state.activeKey} type='card'
                    onChange={(key) => {
                        this.state.activeKey = key;
                        this.setState(this.state);
                    }}
                    tabBarExtraContent={this.tabBarExtraContentRender()} >
                    <TabPane tab='数据属性' key='1'>
                        <section className={'main-right-content page-deviceadd '}>
                            <TemplateTable data={this.state.data} template={state.template} >
                            </TemplateTable>
                        </section>
                    </TabPane>
                    {this.props.data.level !== 'model' &&
                        <TabPane tab='索引' key='2'>
                            <section className={'main-right-content page-deviceadd '}>
                                <TableContent ref='content'
                                    showText='Name' name={props.name} modelName={props.modelName} />
                            </section>
                        </TabPane>
                    }
                </Tabs>
            </section>


        </section>
    }


    componentWillReceiveProps(nextProps) {
        if (this.props.modelName !== nextProps.modelName || this.props.name !== nextProps.name) {
            this.props = nextProps;
            this.componentDidMount();
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



class TableContent extends Variable {

    banArray = ['Name']

    async ajaxGetDate() {
        let { data } = await get('/model_nodeindex', {
            modelName: this.props.modelName,
            nodeName: this.props.name
        });



        let indexDataTemplate = await get('/model_nodeindex_template', {
            modelName: this.props.modelName,
            nodeName: this.props.name
        });
        this.state.template = indexDataTemplate.data.ModelTemplate.Props;


        data['ModelNodeIndex'].forEach((value, index) => {
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


        return data['ModelNodeIndex'];
    }

    async ajaxUpdate() {
        let updateList = [];

        this.state.data.forEach(value => {
            let obj = {};
            for (let key in value) {
                let element = value[key];
                delete element['_stateType'];
                if (key !== 'key') {
                    obj[key] = element.ParameterValue;
                }
            }
            updateList.push(obj);
        });

        await post('/upsert_model_nodeindex', {
            modelName: this.props.modelName,
            nodeName: this.props.name,
            props: updateList
        });

        // this.componentWillMount();
        message.success('保存成功!');
    }

    async getData(categroy?: string) {
        this.state.loading = true;
        this.setState(this.state);
        let data = await this.ajaxGetDate()
        this.state.loading = false;
        // this.state.data = [data[this.props.categroy][0]];

        this.state.data = data;
        this.state._ID = data._ID;
        this.saveColums();
        this.setState(this.state);
    }

    modalShow() {
        (this.refs['SelectMember'] as any).modalShow(true);
    }

    onOk(selectedRows) {
        selectedRows.forEach(value => {
            this.state.data.push(this.getTemplateData(value))
        })
        this.setState(this.state);
    }

    getTemplateData(obj) {
        let data: any = {
            key: uuid()
        }
        this.state.template.forEach(value => {
            let key = value['Name'];
            data[key] = {
                ParameterName: key,
                ParameterValue: obj[key] || ''
            }
        })

        return data;
    }

    additional() {
        return <SelectMember ref='SelectMember' onOk={this.onOk.bind(this)}
            modelName={this.props.modelName} name={this.props.name} ></SelectMember>
    }
}




interface ISelectMemberProps {
    name?: string
    modelName?: string
    onOk?: (data: { [key: string]: string }[]) => void
};
interface ISelectMemberState { };
export class SelectMember extends React.Component<ISelectMemberProps, ISelectMemberState> {

    state = {
        visible: false,
        loading: true,
        selectedRows: [],
        selectedRowKeys: [],
        data: []
    }

    columns = [
        {
            title: '名称',
            dataIndex: 'Name',
            key: 'Name'
        },
        {
            title: '描述',
            dataIndex: 'Description',
            key: 'Description'
        }
    ];

    modalShow(bl: boolean) {
        if (bl && this.state.data.length === 0) {
            this.getNSDevicesVarInfoList();
        }
        this.setState({
            visible: bl
        })
    }

    async ajaxGetDate() {
        let { data } = await get('/model_nodeindex_property', {
            modelName: this.props.modelName,
            nodeName: this.props.name
        });

        this.state.data = data.ModelNodeIndexProperty;
        this.state.data.forEach((value, index) => {
            value.key = value.Name;
        });
        return data;
    }

    async getNSDevicesVarInfoList() {
        this.state.loading = true;
        let data = await this.ajaxGetDate();
        this.state.loading = false;
        this.setState(this.state);
    }

    handleOk() {
        this.props.onOk(this.state.selectedRows);

        this.modalShow(false);
        // 清空选中
        this.state.selectedRowKeys = [];
        this.state.selectedRows = [];
    }

    selectChange(selectedRowKeys) {
        this.state.selectedRowKeys = selectedRowKeys;

        this.state.selectedRows = [];
        this.state.selectedRowKeys.forEach((value, index) => {
            let data = this.state.data.find(data => data['key'] as any === value);
            this.state.selectedRows.push(data);
        });

        this.setState(this.state);
    }


    public render(): JSX.Element {
        let { state, props } = this;

        return <Modal title='选择人员' visible={this.state.visible}
            onOk={this.handleOk.bind(this)} onCancel={() => this.modalShow(false)}
        >
            <div className='modal-Content'>
                <Table className='edit-table mt20'
                    loading={state.loading}
                    dataSource={this.state.data}
                    columns={this.columns}
                    pagination={false}
                    scroll={{ y: 400 }}
                    rowSelection={{
                        selectedRowKeys: state.selectedRowKeys,
                        onChange: this.selectChange.bind(this)
                    }}
                ></Table>
            </div>
        </Modal>;
    }
}
