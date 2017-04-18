import * as React from 'react';
export { React };
import { PageGenerics } from '../../../components/global/components';
import { Tabs, Pagination, TabPane, Button, message } from '../../../components/antd/index';
import { post, get } from '../../../components/ajax/index';
import { MainLeft } from '../../_main';
import { trim } from '../../../components/util/index';
import globalValue from '../../../components/global/value';
import DeviceSeach from '../../device/members/seach';


export default class Com extends DeviceSeach {
    title = '人员'
    listUrl = '/department/members/index';


    async ajaxSeach() {
        let {data} = await get({
            url: '/search_department_tree',
            data: {
                keyword: trim(this.props.query.seach),
                top: -1,
                pageSize: this.state.pageSize,
                pageIndex: this.props.query.seachCurrent || 1
            },
            type: 2
        });

        this.state.regionList = data.DepartmentList;
        this.state.deviceList = data.UserList;
        this.state.count = data.TotalCount;


        let count = data.DepartmentCount > data.UserCount ? data.DepartmentCount : data.UserCount;
        this.state.total = count;
        this.setState(this.state);
        return data;
    }



    render() {
        let {state, props} = this;
        return <section className='h100 page-device-seach'>
            <MainLeft type='member'>
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
                                                    {this.renderBlue(value['UserID'])}
                                                </span>
                                                <span className='td-span'>
                                                    {this.renderBlue(value['Name'])}
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


}