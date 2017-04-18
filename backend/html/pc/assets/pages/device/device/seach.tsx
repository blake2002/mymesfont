import * as React from 'react';
export { React };
import { PageGenerics } from '../../../components/global/components';
import { Tabs, Pagination, TabPane, Button, message } from '../../../components/antd/index';
import { post, get } from '../../../components/ajax/index';
import { MainLeft } from '../../_main';
import { trim } from '../../../components/util/index';
import globalValue from '../../../components/global/value';

import './seach.css';


interface IDeviceAddProps {
    seach: string
    seachCurrent: string
};

/**
 * 设备搜索
 * 
 * @export
 * @class DeviceSeach
 * @extends {PageGenerics<IDeviceAddProps, any>}
 */
export default class DeviceSeach extends PageGenerics<IDeviceAddProps, any> {
    key = 'DeviceList'
    title = '设备'
    returnUrl = '/device/device/index'


    state: {
        total: number,
        pageSize: number,
        count: number,
        regionList: {
            ID: string
            Name: string,
            Path: {
                Name: string
            }[]
        }[],
        deviceList: {
            DeviceID: string
            DeviceName: string,
            DeviceType: string
        }[]
    } = {
        total: 0,
        pageSize: 10,
        count: 0,
        regionList: [],
        deviceList: []
    }

    listUrl = '/device/device/index';


    async ajaxSeach() {
        let {data} = await get({
            url: '/search_region_tree',
            data: {
                searchTarget: 'device',
                keyword: trim(this.props.query.seach),
                top: -1,
                pageSize: this.state.pageSize,
                pageIndex: this.props.query.seachCurrent || 1
            },
            type: 2
        });

        this.state.regionList = data.RegionList;
        this.state.deviceList = data.DeviceList;
        this.state.count = data.TotalCount;


        let count = data.RegionCount > data.DeviceCount ? data.RegionCount : data.DeviceCount;
        this.state.total = count;
        this.setState(this.state);
        return data;
    }

    renderBlue(text: string) {
        let str = text.replace(new RegExp(this.props.query.seach, 'g'),
            `<span className="blue">${this.props.query.seach}</span>`);
        return <span dangerouslySetInnerHTML={{ __html: str }}></span>
    }

    getPathString(arr: any[]) {
        let str = '';
        arr.forEach(value => str += (value.Name + '-'));
        str.replace(/\-&/g, '');
        return str;
    }

    onPaginationChange(index) {
        this.props.query.seachCurrent = index;
        globalValue.jump(globalValue.url, this.props.query);
    }

    onDeviceClick(obj) {
        globalValue.jump(this.listUrl, {
            Id: obj.DeviceID || obj.UserID
        })
    }

    onRegionClick(obj) {
        globalValue.jump(this.listUrl, {
            regionId: obj.ID
        })
    }

    render() {
        let {state, props} = this;
        return <section className='h100 page-device-seach'>
            <MainLeft>
                <div className='center-box'>已为您搜索到<span className='blue'>{this.state.count}</span>个结果</div>
            </MainLeft>
            <section className='main-right'>
                <section className='main-right-tabs'>
                    <div className='main-right-tabs-left ml20 mr20'>
                        <Button onClick={() => {
                            delete this.props.query.seach;
                            globalValue.jump(this.returnUrl, this.props.query);
                        }}> 返回</Button>
                    </div>
                    <Tabs activeKey='1' type='card' >
                        <TabPane tab={this.title + '搜索'} key='1'>
                        </TabPane>
                    </Tabs>
                </section>

                <section className={'main-right-content'}>
                    <section className={'main-right-content-box'}>
                        <section className='seach-box'>

                            <section className='region-box'>
                                <dl className='seach-dl'>
                                    <dt>区域节点</dt>
                                    {
                                        state.regionList.map((value, index) => {
                                            return <dd key={index} onClick={() => this.onRegionClick(value)}>
                                                {this.getPathString(value.Path)}
                                                {this.renderBlue(value.Name)}
                                            </dd>
                                        })
                                    }
                                </dl>
                            </section>
                            <section className='device-box'>
                                <dl className='seach-dl'>
                                    <dt>{this.title}</dt>
                                    {
                                        state.deviceList.map((value, index) => {
                                            return <dd key={index} onClick={() => this.onDeviceClick(value)} >
                                                <span className='td-span'>
                                                    {this.renderBlue(value.DeviceID)}
                                                </span>
                                                <span className='td-span'>
                                                    {this.renderBlue(value.DeviceName)}
                                                </span>
                                                <span className='td-span'>
                                                    {value.DeviceType}
                                                </span>
                                            </dd>
                                        })
                                    }
                                </dl>
                            </section>

                        </section>

                        <Pagination className='mt20'
                            current={parseInt(props.query.seachCurrent || '1', null)}
                            total={state.total}
                            pageSize={state.pageSize}
                            onChange={this.onPaginationChange.bind(this)} />
                    </section>
                </section>
            </section>
        </section>
    }

    /**
     * 组件渲染完毕获取ajax数据
     *
     *
     * @memberOf Device
     */
    componentDidMount() {
        this.ajaxSeach();
    }
}

