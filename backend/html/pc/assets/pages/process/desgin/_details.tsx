import * as React from 'react';
import { PureComponentGenerics } from '../../../components/global/components';
import { Button, Dropdown, Menu, Icon } from '../../../components/antd/index';
import { get, post } from '../../../components/ajax/index'
import { Link } from 'react-router';
import './index.css'


export default class DeviceDrive extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            categroy_options: props.categroy_options,
            category: props.data['category'] ? props.data.category : ''
        };
    }

    menu = <Menu onClick={this.handleClick.bind(this)}>
        <Menu.Item key='1'>历史版本</Menu.Item>
        <Menu.Item key='del'>删除</Menu.Item>
        <Menu.Item key='5'>日志</Menu.Item>
    </Menu>;

    handleClick(e) {
        let key = e.key;

        switch (key) {
            case 'del':
                this.props.onDelete(this.props.data);
                break;
            default:
                break;
        }
    }

    

    //加载真实DOM之前
    componentWillMount() {

    }
    getDisplayValue(text) {
        for (let obj of this.state.categroy_options) {
            if (obj.key == text) {
                return obj.value;
            }
        }
        return '';
    }
    componentWillUpdate(nextProps, nextState) {
        let category = nextProps.data['category'] ? nextProps.data.category : '';
        this.state.categroy_options = nextProps.categroy_options;
        this.state.category = category;
    }

    render() {
        let {state, props} = this; 
        const menu = (
            <Menu onClick={this.props.handleMenuClick}>
                {
                    state.categroy_options.map((obj) => {
                        return <Menu.Item key={obj.key}>{obj.value}</Menu.Item>;
                    })
                }
            </Menu>
        );
        return (<section className='device-details'>
            <Button className='btn-position'>关注</Button>
            <h4>
                <p>{props.data.name}</p>
                <p>{props.data.key}</p>
            </h4>
            <table className='table-details'>
                <tbody>
                    <tr>
                        <th>流程版本</th>
                        <td>{props.data.version}</td>
                    </tr>
                    <tr>
                        <th>流程类型</th>
                        <td>
                            <Dropdown trigger={['click']} overlay={menu}>
                                <Button type="ghost" style={{ marginLeft: 8 }}>
                                    {
                                        this.getDisplayValue(state.category)} <Icon type="down" />
                                </Button>
                            </Dropdown></td>
                    </tr>
                    <tr>
                        <th>创建时间</th>
                        <td>{props.data.createTime}</td>
                    </tr>
                    <tr>
                        <th>更新时间</th>
                        <td>{props.data.lastUpdateTime}</td>
                    </tr>
                    <tr>
                        <th>更新人员</th>
                        <td>{props.data.updateBy}</td>
                    </tr>
                    <tr>
                        <th>流程描述</th>
                        <td>''</td>
                    </tr>
                </tbody>
            </table>
            <section className='component-slip-footer'>
                <Link to={{
                    pathname: '/process/desgin/processDetails',
                    query: { DeviceID: props.data.DeviceID }
                }} ><Button>修改</Button></Link>
                <Button onClick={() => props.onSwitchChange(false, props.data)}>发布</Button>

                <Dropdown overlay={this.menu}><Button>更多</Button></Dropdown>
            </section>
        </section >);
    }
}
