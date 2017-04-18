import * as React from 'react';
import { default as Validate } from '../../components/validate/index';
import { Button } from '../../components/antd/index';
import { PageGenerics } from '../../components/global/components';
import { get, post } from '../../components/ajax/index';
import './index.css';


export default class Component extends PageGenerics<any, any> {


    states = {
        username: '',
        password: ''
    }


    async loginAjax() {
        let json = post('/login', {
            username: this.states.username,
            password: this.states.password,
            token: '0'
        }).then((json) => {
            localStorage.setItem('token', json.data['token']);
            localStorage.setItem('userId', json.data['userId']);
            localStorage.setItem('userPrivileges', JSON.stringify(json.data['userPrivileges']));
            this.props.jump('/');
        });
    }


    onChange(e) {
        let target: HTMLButtonElement = e.target;
        console.log(target.name);
        this.states[target.name] = target.value;
        console.log(target.value);
    }

    render() {
        return <section className='page-login'>
            <section className='page-login-content'>
                <h2>登录</h2>
                <table >
                    <tbody>
                        <tr>
                            <td>
                                <Validate required={true} onChange={this.onChange.bind(this)} name='username' />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <Validate required={true} onChange={this.onChange.bind(this)}
                                    name='password' type='password' />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <Button onClick={this.loginAjax.bind(this)}>登录</Button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </section>
    }
}

export let style = 'separate';
