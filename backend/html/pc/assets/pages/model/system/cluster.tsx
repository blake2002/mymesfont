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
import { ParameterText } from '../../../components/template-input/index';


interface IDeviceProps {
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
    state = {
        data: [],
        template: [],
        loading: true,
        selectedRowKeys: [],
        tableWidth: 50
    }
    columns = [];


    async ajaxGetData() {
        this.state.loading = true;

        let templateData = await get('/model_cluster_state_template');
        this.state.template = templateData.data.ModelTemplate.Props;
        let { data } = await get('/model_cluster_state_list');
        this.state.data = data.stateList;
        this.state.data.forEach((value, index) => {
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
        })

        this.saveColums();
        this.state.loading = false;
        this.setState(this.state);

    }

    renderText(template) {
        return (data, value, index) => {
            if (data) {
                return <ParameterText template={template} data={data} />;
            } else {
                return <span>没有值</span>
            }
        };
    }

    saveColums() {
        this.columns = [];
        this.state.template.forEach((value, index) => {
            if (!value.Visible) {
                let width = value.Form.Properties && value.Form.Properties.Width;
                this.columns.push({
                    title: value.Description,
                    dataIndex: value.Name,
                    width: width,
                    render: this.renderText(value)
                });
                this.state.tableWidth += width || 100;
            }
        });

    }

    onChangeTabs() {
        this.props.jump('/model/system/index');
    }

    getTableHeight() {
        let height = document.body.clientHeight - 210;
        if (height <= this.state.data.length * 55) {
            return height;
        } else {
            return null;
        }
    }

    /**
     * 行点击事件
     * 
     * @param {any} record
     * @param {any} index
     * 
     * @memberOf Device
     */
    onRowClick(record, index) {
        this.props.jump('/model/system/cluster-details', {
            clusterNodeId: record['ID'].ParameterValue
        })
    }


    render() {
        let { state, props } = this;
        return <Tabs type='card'
            activeKey='2'
            onChange={this.onChangeTabs.bind(this)}
        >
            <TabPane tab='设计时' key='1'>
            </TabPane>
            <TabPane tab='运行时' key='2'>
                <Table className='edit-table'
                    loading={state.loading}
                    dataSource={this.state.data} columns={this.columns} pagination={false}
                    onRowClick={this.onRowClick.bind(this)}
                    scroll={{
                        x: 50,
                        y: this.getTableHeight()
                    }}
                ></Table>
            </TabPane>
        </Tabs>
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
