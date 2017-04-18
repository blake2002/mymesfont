import * as React from 'react';
import { Link } from 'react-router';
import { post } from '../ajax/index';
import { PageGenerics } from '../global/components';
import Privileges from '../privileges/index';

export default class Component extends PageGenerics<any, any> {

    states = {
        unread: 0
    }

    async msgInit() {
        // get({
        //     url: 'http://192.167.8.34:8020/mes_app/events',
        //     type: 4,
        //     callback: (data: {
        //         unread: string
        //     }) => {
        //         this.setState({
        //             unread: data.unread
        //         });
        //     }
        // }).then(res => {
        //     console.log('消息数量监视开始');
        // });
    }

    componentDidMount() {
        this.msgInit();
    }


    async signOut() {
        let json = await post('/logout');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        this.props.jump('/login/index');
        console.log(json);
    }


    getLink(to: string, active: string, text: string) {
        let url: string = this.props.url;
        return <Link to={to} className={url.indexOf(active) === 0 ? 'active' : ''}>{text}</Link>;
    }

    render() {
        return <nav className='nav'>
            <Privileges value='/device'>
                {this.getLink('/device/device/index', '/device', '设备管理')}
            </Privileges>
            {this.getLink('/department/members/index', '/department', '组织架构')}
            {this.getLink('/model/system/index', '/model', '模型管理')}
            {this.getLink('/report/system/index', '/report', '报表管理')}
            {this.getLink('/system/systemMenuManager/index', '/system', '系统设置')}

            <section className='nav-right'>
                {localStorage.getItem('userId')}
                <a onClick={this.signOut.bind(this)}>退出</a>
            </section>
        </nav>
    }
}
